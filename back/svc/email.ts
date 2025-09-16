import formData from "form-data";
import Mailgun from "mailgun.js";
import { config } from "../config/index";
import type { EmailSendResult, EmailTemplate } from "./interfaces";

// Mailgun client singleton
let mailgunClient: any = null;

function getMailgunClient() {
    if (!mailgunClient) {
        const mailgun = new Mailgun(formData);
        mailgunClient = mailgun.client({
            username: "api",
            key: config.mailgun.apiKey,
        });
    }
    return mailgunClient;
}

async function sendEmail(
    to: string,
    template: EmailTemplate,
): Promise<EmailSendResult> {
    try {
        const mg = getMailgunClient();
        const messageData = {
            from: `${config.mailgun.fromName} <${config.mailgun.fromEmail}>`,
            to: to,
            subject: template.subject,
            text: template.textBody,
            html: template.htmlBody,
            "o:tracking": "yes",
            "o:tracking-clicks": "yes",
            "o:tracking-opens": "yes",
        };

        const response = await mg.messages.create(
            config.mailgun.domain,
            messageData,
        );

        return {
            success: true,
            messageId: response.id,
        };
    } catch (error) {
        console.error("Failed to send email via Mailgun:", error);
        return {
            success: false,
            error:
                error instanceof Error ? error.message : "Unknown email sending error",
        };
    }
}

function createAuthCodeTemplate(code: string): EmailTemplate {
    const subject = "Your ChatMesh login code";

    const htmlBody = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your ChatMesh login code</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }
        .code-box { background: #ffffff; border: 2px solid #2563eb; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0; }
        .code { font-size: 32px; font-weight: bold; color: #2563eb; letter-spacing: 8px; font-family: monospace; }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 14px; color: #64748b; }
        .warning { background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 6px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="header">
        <h1>ChatMesh Login</h1>
    </div>
    <div class="content">
        <h2>Your login code</h2>
        <p>Enter this 6-digit code to access your ChatMesh account:</p>
        
        <div class="code-box">
            <div class="code">${code}</div>
        </div>
        
        <div class="warning">
            <strong>Security Notice:</strong> This code will expire in 1 minute for your security. If you didn't request this login, please ignore this email.
        </div>
        
        <p>Enter this code on the ChatMesh login page to complete your authentication.</p>
    </div>
    <div class="footer">
        <p>This email was sent by ChatMesh. If you have any questions, please contact our support team.</p>
        <p><strong>Do not reply to this email.</strong> This mailbox is not monitored.</p>
    </div>
</body>
</html>`;

    const textBody = `
ChatMesh Login

Your 6-digit login code is: ${code}

Enter this code on the ChatMesh login page to access your account.

This code will expire in 1 minute for your security.

If you didn't request this login, please ignore this email.

---
This email was sent by ChatMesh.
Do not reply to this email. This mailbox is not monitored.
`;

    return { subject, htmlBody, textBody };
}



export function useEmail() {
    return {
        async sendMail(email: string, code: string): Promise<EmailSendResult> {
            const template = createAuthCodeTemplate(code);
            return sendEmail(email, template);
        },
    };
}
