import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class CardService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(file: string, createCardDto: Prisma.CardsCreateInput, host: string, port: string) {
    let fields = {
      id: true,
      name: true,
      code: true,
      createdAt: true,
      updatedAt: true,
      description: true,
      image: true,
      listId: true,
      issueType: true,
      priority: true,
      startDate: true,
      endDate: true,
      createdBy: {
        where: {
          isDeleted: false,
        },
        select: {
          id: true,
          name: true,
        },
      },
      closedBy: {
        where: {
          isDeleted: false,
        },
        select: {
          id: true,
          name: true,
        },
      },
      assignedBy: {
        where: {
          isDeleted: false,
        },
        select: {
          id: true,
          name: true,
        },
      },
      assignedTo: {
        where: {
          isDeleted: false,
        },
        select: {
          id: true,
          name: true,
        },
      },
      finishedBy: {
        where: {
          isDeleted: false,
        },
        select: {
          id: true,
          name: true,
        },
      },
    };
    return await this.databaseService.cards.create({
      data: {
        ...createCardDto,
        image: file !== null ? `http://${host}:${port}/${file}` : null,
      },
      select: fields,
    });
  }

  async findAll() {
    return await this.databaseService.cards.findMany({
      where: {
        isDeleted: false
      },
      select: { id: true, name: true },
    });
  }

  async findById(id: number) {
    return await this.databaseService.cards.findUnique({
      where: {
        id,
      },
    });
  }

  async updateById(
    id: number,
    updateCardDto: Prisma.CardsUpdateInput,
    file: string,
    host: string,
    port: string
  ) {
    let fields = {
      id: true,
      name: true,
      code: true,
      createdAt: true,
      updatedAt: true,
      description: true,
      image: true,
      listId: true,
      issueType: true,
      priority: true,
      startDate: true,
      endDate: true,
      createdBy: {
        where: {
          isDeleted: false,
        },
        select: {
          id: true,
          name: true,
        },
      },
      closedBy: {
        where: {
          isDeleted: false,
        },
        select: {
          id: true,
          name: true,
        },
      },
      assignedBy: {
        where: {
          isDeleted: false,
        },
        select: {
          id: true,
          name: true,
        },
      },
      assignedTo: {
        where: {
          isDeleted: false,
        },
        select: {
          id: true,
          name: true,
        },
      },
      finishedBy: {
        where: {
          isDeleted: false,
        },
        select: {
          id: true,
          name: true,
        },
      },
    };
    return await this.databaseService.cards.update({
      where: {
        id,
      },
      data: {
        ...updateCardDto,
        image: file !== null ? `http://${host}:${port}/${file}` : null,
      },
      select: fields,
    });
  }

  async deleteById(id: number) {
    return await this.databaseService.cards.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
      },
    });
  }
}
