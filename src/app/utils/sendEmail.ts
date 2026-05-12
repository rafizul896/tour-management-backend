import nodemailer from "nodemailer";
import { envVars } from "../config/env";
import path from "path";
import ejs from "ejs";
import AppError from "../errorHelpers/AppError";

const transporter = nodemailer.createTransport({
  host: envVars.SMTP.SMTP_HOST,
  port: Number(envVars.SMTP.SMTP_PORT),
  secure: false,
  auth: {
    user: envVars.SMTP.SMTP_USER,
    pass: envVars.SMTP.SMTP_PASS,
  },
});

interface ISendEmail {
  to: string;
  subject: string;
  templateName: string;
  templateData?: Record<string, unknown>;
  attachments?: {
    filename: string;
    content: Buffer | string;
    contentType: string;
  }[];
}

export const sendEmail = async ({
  to,
  subject,
  templateName,
  templateData,
  attachments,
}: ISendEmail) => {
  try {
    const templatePath = path.join(__dirname, `templates/${templateName}.ejs`);
    const html = await ejs.renderFile(templatePath, templateData);

    const info = await transporter.sendMail({
      from: envVars.SMTP.SMTP_FROM,
      to,
      subject,
      text: "",
      html: html,
      attachments: attachments?.map((attac) => ({
        fileName: attac.filename,
        content: attac.content,
        contentType: attac.contentType,
      })),
    });

    console.log(`Email sent to ${to}: ${info.messageId}`);
  } catch (err) {
    if (err instanceof Error) {
      console.log("Email seanding error", err.message);
      throw new AppError(401, "Email Error");
    }
  }
};
