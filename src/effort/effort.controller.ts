import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import { EffortService } from './effort.service';
import { MyLoggerService } from 'src/my-logger/my-logger.service';
import { AuthenticationGuard } from 'src/guards/authentication.guard';
import { Prisma } from '@prisma/client';

@SkipThrottle()
@ApiTags('effort')
@ApiBearerAuth('token')
@Controller('effort')
export class EffortController {
  constructor(private readonly effortService: EffortService) {}
  private readonly logger = new MyLoggerService(EffortController.name);

  @UseGuards(AuthenticationGuard)
  @Post()
  async create(
    @Req() { user },
    @Body() createEffortDto: Prisma.EffortCreateInput,
  ) {
    const object = {
      ...createEffortDto,
      taskId: Number(createEffortDto['taskId']),
      userId: user.id,
      costTime: Number(createEffortDto['costTime'])
    };

    const createEffort = await this.effortService.create(object);
    return createEffort;
  }
}

