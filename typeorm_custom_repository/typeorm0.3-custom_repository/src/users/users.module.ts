import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import {
  getDataSourceToken,
  getRepositoryToken,
  TypeOrmModule,
} from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { DataSource } from 'typeorm';
import { customUserRepositoryMethods } from './repositories/user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [
    {
      provide: getRepositoryToken(User),
      inject: [getDataSourceToken()],
      useFactory(dataSource: DataSource) {
        // Override default repository for User with a custom one
        return dataSource
          .getRepository(User)
          .extend(customUserRepositoryMethods);
      },
    },
    UsersService,
  ],
})
export class UsersModule {}
