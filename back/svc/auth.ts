// Authentication service implementation placeholder

import { and, eq, gt, sql } from "drizzle-orm";
import { db } from "../db/db";
import { authCode, employee, session } from "../db/schema";
import { useEmail } from "./email";
import useEmployee from "./employee";

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

  const finalizeLogin = async (email: string, code: string) => {
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

    const sessionId = crypto.randomUUID();
    await db
      .insert(session)
      .values({
        id: sessionId,
        employee_id: sql`(SELECT id FROM employee WHERE email = ${email})`,
        expires_at: sql`datetime('now', '+30 days')`,
      });

    return sessionId;
  }

  const getSessionUserId = async (sessionId: string) => {
    const [result] = await db
      .select({
        id: employee.id,
        email: employee.email
      })
      .from(employee)
      .leftJoin(session, eq(employee.id, session.employee_id))
      .where(and(
        eq(session.id, sessionId),
        gt(session.expires_at, sql`datetime('now')`)
      ));

    if (!result)
      return undefined;

    return result as {
      id: string,
      email: string,
    };
  }

  const logoutEmployee = async (sessionId: string) => {
    const result = await db
      .delete(session)
      .where(eq(session.id, sessionId))
      .returning({ id: session.id });

    return result.length > 0;
  }

  return {
    canRegenerateCode,
    generateCode,
    setCode,
    getCode,
    useCode,
    sendCodeEmail,
    finalizeLogin,
    logoutEmployee,
    getSessionEmployee: getSessionUserId
  }
}

export default useAuth;
