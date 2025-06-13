import nodemailer from "nodemailer";
import TokenEmail from "../model/TokenEmail";
import crypto from "crypto";

export default class NodemailerService {
  constructor() {
    this.testAccount = this.#createTestAccount();
  }

  async #createTestAccount() {
    return await nodemailer.createTestAccount();
  }

  async sendConfirmationEmail(email, subject, text) {
    try {
      const transporter = nodemailer.createTransport({
        service: process.env.MAIL_SERVICE,
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        secure: false,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
        tls: {
          rejectUnauthorized: false,
        },
      });

      const info = await transporter.sendMail({
        from: process.env.MAIL_USER,
        to: email,
        subject: subject,
        html: text,
      });
      console.log("Message sent: %s", info.messageId);
    } catch (error) {
      console.log("email not sent", error);
    }
  }

  async checkExistsToken(token) {
    try {
      return !!(await TokenEmail.findOne({token}));
    } catch (error) {
      console.log("CheckExistsTokenEmail error", error);
    }
  }

  async createToken(idUser) {
    try {
      let tokenEmail = new TokenEmail({
        id_user: idUser,
        token: crypto.randomBytes(32).toString("hex"),
      });

      await tokenEmail.save();
      return tokenEmail;
    } catch (error) {
      console.log("Create email token error", error);
      return null;
    }
  }

  async removeToken(id) {
    try {
      await TokenEmail.findOneAndDelete({ id_user: id });
    } catch (error) {
      console.log("Remove email token error", error);
    }
  }
}
