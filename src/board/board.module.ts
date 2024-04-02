import { Module } from '@nestjs/common';
import { BoardController } from './board.controller';
import { BoardService } from './board.service';
import { DatabaseModule } from 'src/database/database.module';
import { ListModule } from 'src/list/list.module';

@Module({
  imports: [DatabaseModule, ListModule],
  controllers: [BoardController],
  providers: [BoardService],
})
export class BoardModule {}
