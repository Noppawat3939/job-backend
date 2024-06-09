import { ISendMailOptions } from '@nestjs-modules/mailer';
import path from 'path';
import fs from 'fs';

const generateTemplateFilePath = (fileName: string) => {
  const filePath = path.join(__dirname, '..', '..', 'src', 'templates', fileName);
  const template = fs.readFileSync(filePath, 'utf-8');

  return template;
};

export const generateMailerOptions = ({
  email,
  firstName,
  lastName,
}: {
  email: string;
  firstName?: string;
  lastName?: string;
}) => {
  generateTemplateFilePath('create-account.html');
  const html = generateTemplateFilePath('create-account.html').replace(
    /\[full_name\]/g,
    `${firstName || ''} ${lastName || ''} `,
  );

  const createAccount = {
    to: email.toLowerCase(),
    from: 'jobify@co.com',
    subject: 'Welcome to Jobify!',
    sender: 'jobify@co.com',
    html,
  } satisfies ISendMailOptions;

  return { createAccount };
};
