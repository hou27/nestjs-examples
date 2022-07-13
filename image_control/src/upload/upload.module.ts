import { DynamicModule, Module } from '@nestjs/common';
import { CONFIG_OPTIONS } from 'src/common/common.constants';
import { UploadController } from './upload.controller';
import { UploadModuleOptions } from './upload.interface';
import { UploadService } from './upload.service';

@Module({
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {
  static forRoot(options: UploadModuleOptions): DynamicModule {
    return {
      module: UploadModule,
      providers: [
        {
          provide: CONFIG_OPTIONS,
          useValue: options,
        },
        UploadService,
      ],
      exports: [UploadService],
    };
  }
}
