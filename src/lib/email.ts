import { ISendMailOptions } from '@nestjs-modules/mailer';
import path from 'path';
import fs from 'fs';
import dayjs from 'dayjs';

const generateTemplateFilePath = (fileName: string) => {
  const filePath = path.join(__dirname, '..', '..', 'src', 'templates', fileName);
  const template = fs.readFileSync(filePath, 'utf-8');

  return template;
};

export const generateMailerOptions = ({
  email,
  firstName,
  lastName,
  verify_code,
}: {
  email: string;
  firstName?: string;
  lastName?: string;
  verify_code?: string;
}) => {
  const createAccountTemplate = generateTemplateFilePath('create-account.html').replace(
    /\[full_name\]/g,
    `${firstName || ''} ${lastName || ''} `,
  );

  const emailVerifyTemplate = generateTemplateFilePath('email-verification.html').replace(
    /\[verify_code\]/g,
    verify_code,
  );

  const to = email.toLowerCase();

  const createAccount = {
    to,
    from: 'jobify@co.com',
    subject: 'Welcome to Jobify!',
    sender: 'jobify@co.com',
    html: createAccountTemplate,
  } satisfies ISendMailOptions;

  const emailVerify = {
    to,
    from: 'jobify@co.com',
    subject: 'Jobify Email Verification',
    sender: 'jobify@co.com',
    cc: 'jobify@co.com',
    html: emailVerifyTemplate,
    date: dayjs().format('DD/MM/YYYY'),
  } satisfies ISendMailOptions;

  return { createAccount, emailVerify };
};
