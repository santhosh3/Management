import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class EffortService {
    constructor(
        private readonly databaseService: DatabaseService,
    ) {}

    async create(createEffortDto: Prisma.EffortCreateInput){
         return await this.databaseService.effort.create({
            data: createEffortDto
         })
    }
}
