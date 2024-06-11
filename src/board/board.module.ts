import { Module } from '@nestjs/common';
import { BoardController } from './board.controller';
import { BoardService } from './board.service';
import { DatabaseModule } from 'src/database/database.module';
import config from 'src/config/config';
import { ConfigModule } from '@nestjs/config/dist';

@Module({
  imports: [DatabaseModule, ConfigModule.forFeature(config)],
  controllers: [BoardController],
  providers: [BoardService],
})
export class BoardModule {}
