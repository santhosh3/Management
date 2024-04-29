import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { DatabaseModule } from 'src/database/database.module';
import { ConfigModule } from '@nestjs/config/dist';
import config from 'src/config/config';

@Module({
  imports: [DatabaseModule, ConfigModule.forFeature(config)],
  controllers: [TaskController],
  providers: [TaskService]
})
export class TaskModule {}
