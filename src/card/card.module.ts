import { Module } from '@nestjs/common';
import { CardController } from './card.controller';
import { CardService } from './card.service';
import { DatabaseModule } from 'src/database/database.module';
import config from 'src/config/config';
import { ConfigModule } from '@nestjs/config/dist';

@Module({
  imports: [DatabaseModule,ConfigModule.forFeature(config)],
  controllers: [CardController],
  providers: [CardService],
})
export class CardModule {}
