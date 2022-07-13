import { Inject, Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { CONFIG_OPTIONS } from 'src/common/common.constants';
import { UploadModuleOptions } from './upload.interface';

@Injectable()
export class UploadService {
  private readonly S3: AWS.S3;
  private readonly ACL: string;
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: UploadModuleOptions,
  ) {
    AWS.config.update({
      region: 'us-east-1',
      credentials: {
        accessKeyId: this.options.accesskey,
        secretAccessKey: this.options.secretkey,
      },
    });

    this.S3 = new AWS.S3();
    this.ACL = 'public-read';
  }
  async uploadFile(file) {
    try {
      // try {
      //   const upload = await new AWS.S3()
      //     .createBucket({ Bucket: this.options.buketname })
      //     .promise();
      //   console.log(file);
      //   console.log(upload);
      // } catch (error) {
      //   console.log('Nested Error : ', error);
      // }
      try {
        const uploadKey = `${Date.now() + file.originalname}`;
        const upload = await this.S3
          // .getSignedUrlPromise('putObject', {
          //   Key: `${Date.now() + file.originalname}`,
          //   Body: file.buffer,
          //   Bucket: this.options.buketname,
          //   ContentType: 'image/jpeg',
          //   ACL: this.ACL,
          // });
          .putObject({
            Key: uploadKey,
            Body: file.buffer,
            Bucket: this.options.buketname,
            ContentType: 'image/jpeg',
            ACL: this.ACL,
          })
          .promise();
        console.log(upload);

        this.S3.getObject(
          {
            Key: uploadKey,
            Bucket: this.options.buketname,
          },
          async (err, data) => {
            console.log(err, data);
            // https://velog.io/@ypd03008/NestJSAWS-S3-Uploader-%EB%AA%A8%EB%93%88-%EB%A7%8C%EB%93%A4%EA%B8%B0
            console.log(
              `https://${this.options.buketname}.s3.us-east-1.amazonaws.com/${uploadKey}`,
            );
          },
        );
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      console.log('Error : ', error);
    }
  }
}
