import { Inject, Injectable } from '@nestjs/common';
import { EmailVar, MailModuleOptions } from './mail.interface';
import { CONFIG_OPTIONS } from './mail.module';
import axios from 'axios';

@Injectable()
export class MailService {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: MailModuleOptions,
  ) {}

  async sendEmail(
    to: string,
    subject: string,
    template: string,
    emailVars: EmailVar[],
  ) {
    const form = new FormData();
    form.append('from', `Hou27 from Jalapeno <mailgun@${this.options.domain}>`);
    form.append('to', to);
    form.append('subject', subject);
    form.append('template', template);
    emailVars.forEach((eVar) => form.append(`v:${eVar.key}`, eVar.value));

    try {
      await axios.post(
        `https://api.mailgun.net/v3/${this.options.domain}/messages`,
        form,
        {
          auth: {
            username: 'api',
            password: this.options.apiKey,
          },
        },
      );

      // await got.post(
      //   `https://api.mailgun.net/v3/${this.options.domain}/messages`,
      //   {
      //     // method: 'POST',
      //     headers: {
      //       Authorization: `Basic ${Buffer.from(
      //         `api:${this.options.apiKey}`,
      //       ).toString('base64')}`,
      //     },
      //     // body: form,
      //     form,
      //   },
      // );
      return true;
    } catch (error) {
      // console.log(error);
      return false;
    }
  }

  sendVerificationEmail(email: string, code: string) {
    this.sendEmail(email, 'Verify Your Email', 'verify-email', [
      { key: 'code', value: code },
      { key: 'username', value: email },
    ]);
  }
}
