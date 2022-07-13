import { Inject, Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { CONFIG_OPTIONS } from 'src/common/common.constants';
import { UploadModuleOptions } from './upload.interface';

@Injectable()
export class UploadService {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: UploadModuleOptions,
  ) {}
  async uploadFile(file) {
    try {
      AWS.config.update({
        credentials: {
          accessKeyId: this.options.accesskey,
          secretAccessKey: this.options.secretkey,
        },
      });
      try {
        const upload = await new AWS.S3()
          .createBucket({ Bucket: this.options.buketname })
          .promise();
        console.log(file);
        console.log(upload);
      } catch (error) {
        console.log('Nested Error : ', error);
      }
    } catch (error) {
      console.log('Error : ', error);
    }
  }
}
