import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DatabaseModule } from 'src/database/database.module';
import { ConfigModule } from '@nestjs/config/dist';
import config from 'src/config/config';

@Module({
  imports: [DatabaseModule, ConfigModule.forFeature(config)],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
