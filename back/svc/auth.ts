// Authentication service implementation placeholder

import { and, eq, getTableColumns, gt, inArray, sql } from "drizzle-orm";
import { db } from "../db/db";
import { authCode, employee, session } from "../db/schema";
import { useEmail } from "./email";
import useEmployee from "./employee";
import useInvitation from "./invitation";

function useAuth() {

  const canRegenerateCode = async (email: string) => {
    const [result] = await db
      .select({ cnt: sql<number>`COUNT(*)` })
      .from(authCode)
      .where(and(
        eq(authCode.email, email),
        gt(authCode.created_at, sql`datetime('now', '-1 minute')`)
      ));

    return !result || result.cnt === 0;
  }

  const generateCode = () => {
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += Math.floor(Math.random() * 10);
    }
    return code;
  }

  const setCode = async (email: string, code: string) => {
    await db
      .delete(authCode)
      .where(eq(authCode.email, email));

    await db
      .insert(authCode)
      .values({ email, code });
  }

  const getCode = async (email: string) => {
    const [result] = await db
      .select({ code: authCode.code })
      .from(authCode)
      .where(and(
        eq(authCode.email, email),
        gt(authCode.created_at, sql`datetime('now', '-5 minute')`)
      ));

    return result?.code || '';
  }

  const useCode = async (email: string) => {
    const result = await db.transaction(async (tx) => {
      const [codeResult] = await tx
        .select({ count: sql<number>`count(*)` })
        .from(authCode)
        .where(and(
          eq(authCode.email, email),
          gt(authCode.created_at, sql`datetime('now', '-5 minute')`)
        ));

      console.log(codeResult);

      if (!codeResult) {
        return false;
      }

      await tx
        .delete(authCode)
        .where(eq(authCode.email, email));

      return codeResult?.count || 0;
    });

    return !!result;
  }

  const sendCodeEmail = async (email: string): Promise<boolean> => {
    const canRegen = await canRegenerateCode(email);
    if (!canRegen) {
      return false;
    }

    const code = generateCode();
    await setCode(email, code);

    const mailer = useEmail();
    await mailer.sendMail(email, code);

    console.log("sent email:", code)

    return true;
  }

  const finalizeLogin = async (email: string, code: string, ip: string) => {
    const storedCode = await getCode(email);

    if (code !== storedCode) {
      return false;
    }

    // check if user is already registered
    const [user] = await db
      .select()
      .from(employee)
      .where(eq(employee.email, email));

    // if no, then add a user
    if (!user) {
      const employeeService = useEmployee();
      await employeeService.createEmployee(email);
    }

    // then create a session
    await db
      .delete(session)
      .where(eq(session.employee_id, sql`(SELECT id FROM employee WHERE email = ${email})`));

    const session_id = crypto.randomUUID();
    await db
      .insert(session)
      .values({
        session_id,
        employee_id: sql`(SELECT id FROM employee WHERE email = ${email})`,
        expires_at: sql`datetime('now', '+30 days')`,
        last_ip: ip
      });

    return session_id;
  }

  const getSessionUserId = async (sessionId: string) => {
    const [result] = await db
      .select({
        id: employee.id,
        email: employee.email,
        company_id: employee.company_id
      })
      .from(employee)
      .leftJoin(session, eq(employee.id, session.employee_id))
      .where(and(
        eq(session.session_id, sessionId),
        gt(session.expires_at, sql`datetime('now')`)
      ));

    if (!result)
      return undefined;

    return result;
  }

  const logoutEmployee = async (sessionId: number) => {
    const result = await db
      .delete(session)
      .where(eq(session.id, sessionId))
      .returning({ id: session.id });

    return result.length > 0;
  }

  const loginWithInvitation = async (invitationToken: string) => {
    const invitationService = useInvitation();

    // Validate the invitation token
    const invitationData = await invitationService.validateInvitation(invitationToken);

    if (!invitationData) {
      return null; // Invalid or expired invitation
    }

    const email = invitationData.email;

    // Check if user already exists
    const [existingUser] = await db
      .select()
      .from(employee)
      .where(eq(employee.email, email));

    let userId: string;

    if (!existingUser) {
      // Create new user account
      const employeeService = useEmployee();
      userId = await employeeService.createEmployee(email, invitationData.company_id);
    } else {
      userId = existingUser.id;

      // Check if user already has a company (shouldn't happen with valid invitations)
      if (existingUser.company_id !== null) {
        return null;
      }
    }

    // Delete any existing sessions for this user
    await db
      .delete(session)
      .where(eq(session.employee_id, userId));

    // Create new session
    const session_id = crypto.randomUUID();
    await db
      .insert(session)
      .values({
        session_id,
        employee_id: userId,
        expires_at: sql`datetime('now', '+30 days')`,
        last_ip: ''
      });

    return session_id;
  }

  const getCompanySessions = async (company_id: number) => {

    const { ...sessionColumns } = getTableColumns(session);
    const sessions = await db
      .select({
        ...sessionColumns,
        email: employee.email,
        avatar: employee.avatar,
        first_name: employee.first_name,
        last_name: employee.last_name
      })
      .from(session)
      .leftJoin(employee, eq(session.employee_id, employee.id))
      .where(eq(employee.company_id, company_id));

    return sessions;
  }

  const deleteSession = async (company_id: number, id: number) => {
    const result = await db
      .delete(session)
      .where(and(
        eq(session.id, id),
        inArray(session.employee_id, db
          .select({ id: employee.id })
          .from(employee)
          .where(eq(employee.company_id, company_id))
        )
      ))
      .returning({ id: session.id });

    return result;
  }

  return {
    canRegenerateCode,
    generateCode,
    setCode,
    getCode,
    useCode,
    sendCodeEmail,
    finalizeLogin,
    loginWithInvitation,
    logoutEmployee,
    getSessionEmployee: getSessionUserId,
    getCompanySessions,
    deleteSession
  }
}

export default useAuth;
