import { Module } from '@nestjs/common';
import { EffortController } from './effort.controller';
import { EffortService } from './effort.service';
import { DatabaseModule } from 'src/database/database.module';


@Module({
  imports: [DatabaseModule],
  controllers: [EffortController],
  providers: [EffortService]
})
export class EffortModule {}
