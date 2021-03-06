import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { CommonModule } from './common/common.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PW,
      database: process.env.DB_NAME,
      synchronize: process.env.NODE_ENV !== 'prod',
      logging:
        process.env.NODE_ENV !== 'prod' && process.env.NODE_ENV !== 'test',
      entities: [User],
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    }),
    UsersModule,
    CommonModule,
    AuthModule,
    UploadModule.forRoot({
      accesskey: process.env.AWS_ACCESS_KEY,
      secretkey: process.env.AWS_SECRET_KEY,
      buketname: process.env.AWS_BUCKET_NAME,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
