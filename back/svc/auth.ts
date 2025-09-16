// Authentication service implementation placeholder

import { sql } from "bun";
import { useEmail } from "./email";
import useEmployee from "./employee";

function useAuth() {

  const checkCodeExists = async (email: string) => {
    const res = await sql`
      SELECT COUNT(*) as cnt FROM auth_code WHERE email = ${email} AND created_at > datetime('now', '-1 minute');
    `.then((res) => res[0]);

    return res.cnt > 0;
  }

  const generateCode = () => {
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += Math.floor(Math.random() * 10);
    }
    return code;
  }

  const setCode = async (email: string, code: string) => {
    await sql`
      DELETE FROM auth_code WHERE email = ${email}
    `;
    await sql`
      INSERT INTO auth_code (email, code) VALUES (${email}, ${code});
    `;
  }

  const getCode = async (email: string) => {
    const res = await sql`
      SELECT code FROM auth_code WHERE email = ${email} AND created_at > datetime('now', '-1 minute')
    `.then(res => res[0]);

    return res?.code || '';
  }

  const useCode = async (email: string) => {

    const res = await sql.begin(async (sql) => {

      const res = await sql`
        SELECT count(*) as count FROM auth_code WHERE email = ${email} AND created_at > datetime('now', '-1 minute');
      `.then((res) => res[0]);

      console.log(res)

      if (!res) {
        return false;
      }

      await sql`
        DELETE FROM auth_code WHERE email = ${email};
      `;

      return res?.count || 0;
    });

    return !!res;
  }

  const sendCodeEmail = async (email: string): Promise<boolean> => {
    const exists = await checkCodeExists(email);
    if (exists) {
      return false;
    }

    const code = generateCode();
    await setCode(email, code);

    const mailer = useEmail();
    await mailer.sendMail(email, code);

    console.log("sent email")

    return true;
  }

  const finalizeLogin = async (email: string, code: string) => {
    const storedCode = await getCode(email);

    if (code !== storedCode) {
      return false;
    }

    // check if user is already registered

    const user = await sql`
      SELECT * FROM employee WHERE email = $email;
    `.then((res) => res[0]);

    // if no, then add a user
    if (!user) {
      const employee = useEmployee();
      await employee.createEmployee(email);
    }

    // then create a session
    await sql`
      DELETE FROM session WHERE employee_id = (SELECT id FROM employee WHERE email = ${email});
    `;

    const sessionId = crypto.randomUUID();
    await sql`
      INSERT INTO session (id, employee_id, expires_at) VALUES (${sessionId}, (SELECT id FROM employee WHERE email = ${email}), datetime('now', '+30 days'));
    `;
    return sessionId;
  }

  const getSessionEmployee = async (sessionId: string) => {
    const user = await sql`
      SELECT email, first_name as firstName, last_name as lastName, onboarded
      FROM employee
      LEFT JOIN session ON employee.id = session.employee_id
      WHERE session.id = ${sessionId} AND session.expires_at > datetime('now')
      ;
    `.then(res => res[0]);

    console.log(user)

    return user as {
      firstName: string,
      lastName: string,
      email: string,
      onboarded: boolean
    };
  }

  const logoutSession = async (email: string, sessionId: string) => {
    const result = await sql`
      DELETE FROM session
      WHERE employee_id = (SELECT id FROM employee WHERE email = ${email}) AND id = ${sessionId}
      RETURNING CHANGES() as c;
    `.then(res => res[0]);

    console.log(result)

    return !!result?.c;
  }

  return {
    checkCodeExists,
    generateCode,
    setCode,
    getCode,
    useCode,
    sendCodeEmail,
    finalizeLogin,
    logoutSession,
    getSessionEmployee
  }
}

export default useAuth;
