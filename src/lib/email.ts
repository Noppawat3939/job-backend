import { ISendMailOptions } from '@nestjs-modules/mailer';
import path from 'path';
import fs from 'fs';
import dayjs from 'dayjs';

const generateTemplateFilePath = (fileName: string) => {
  const filePath = path.join(__dirname, '..', '..', 'src', 'templates', `${fileName}.html`);
  const template = fs.readFileSync(filePath, 'utf-8');

  return template;
};

export const generateMailerOptions = ({
  email,
  verify_code,
  full_name,
  username,
}: {
  email: string;
  full_name?: string;
  verify_code?: string;
  username?: string;
}) => {
  const createAccountTemplate = generateTemplateFilePath('create-account').replace(
    /\[full_name\]/g,
    `${full_name || ''} `,
  );

  const emailVerifyTemplate = generateTemplateFilePath('email-verification').replace(
    /\[verify_code\]/g,
    verify_code,
  );

  const subscribeTemplate = generateTemplateFilePath('subscribe').replace(
    /\[username\]/g,
    username,
  );

  const defaultOption = { to: email.toLowerCase(), from: 'jobify@co.com', sender: 'jobify@co.com' };

  const createAccount = {
    ...defaultOption,
    subject: 'Welcome to Jobify!',
    html: createAccountTemplate,
  } satisfies ISendMailOptions;

  const emailVerify = {
    ...defaultOption,
    subject: 'Jobify Email Verification',
    cc: 'jobify@co.com',
    html: emailVerifyTemplate,
    date: dayjs().format('DD/MM/YYYY'),
  } satisfies ISendMailOptions;

  const subscribe = {
    ...defaultOption,
    subject: 'Thank you for subscribe',
    html: subscribeTemplate,
    cc: 'jobify@co.com',
    date: dayjs().format('DD/MM/YYYY'),
  } satisfies ISendMailOptions;

  return { createAccount, emailVerify, subscribe };
};
