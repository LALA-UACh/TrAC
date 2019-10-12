import stringify from "json-stringify-safe";
import nodemailer from "nodemailer";
import { MailOptions } from "nodemailer/lib/sendmail-transport";
import requireEnv from "require-env-variable";

const { GMAIL_USERNAME, GMAIL_PASSWORD } = requireEnv([
  "GMAIL_USERNAME",
  "GMAIL_PASSWORD",
]);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: GMAIL_USERNAME,
    pass: GMAIL_PASSWORD,
  },
});

const mailOptions = {
  from: GMAIL_USERNAME,
  subject: "",
  html: "",
};

export const sendMail = (
  opts: MailOptions,
  success = (info: any) =>
    console.log("Email sent successfully: " + stringify(info)),
  failure = (err: any) => console.error("Error sending mail: " + stringify(err))
) => {
  transporter.sendMail(
    {
      ...mailOptions,
      ...opts,
    },
    (err, info) => {
      if (err) {
        console.error(err);
        return failure(err);
      }

      success(info);
    }
  );
};

export { default as Mail } from "./mail";
