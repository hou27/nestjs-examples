import { DynamicModule, Global, Module } from '@nestjs/common';
import { MailModuleOptions } from './mail.interface';
import { MailService } from './mail.service';

export const CONFIG_OPTIONS = 'CONFIG_OPTIONS';

@Module({})
@Global()
export class MailModule {
  static forRoot(options: MailModuleOptions): DynamicModule {
    return {
      module: MailModule,
      providers: [
        {
          provide: CONFIG_OPTIONS,
          useValue: options,
        },
        MailService,
      ],
      exports: [MailService],
    };
  }
}
