import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class CardService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findList() {
    const Liststatus = await this.databaseService.list.findMany({});
    return Liststatus;
  }

  async create(
    file: string,
    createCardDto: Prisma.CardsCreateInput,
    host: string,
    port: string,
  ) {
    let fields = {
      id: true,
      name: true,
      code: true,
      createdAt: true,
      updatedAt: true,
      description: true,
      image: true,
      status: true,
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
    const story = await this.databaseService.cards.create({
      data: {
        ...createCardDto,
        image: file !== null ? `http://${host}:${port}/${file}` : null,
      },
      select: fields,
    });
    return story;
  }

  async findAll() {
    let fields = {
      id: true,
      name: true,
      boardId: true,
      code: true,
      createdAt: true,
      updatedAt: true,
      description: true,
      image: true,
      status: true,
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

    function groupByStatus(array: any): any {
      const groupedByStatus = {};
      array.forEach((obj: any) => {
        const status = obj.status;
        if (!groupedByStatus[status]) {
          groupedByStatus[status] = [];
        }
        groupedByStatus[status].push(obj);
      });
      return groupedByStatus;
    }

    let stories = await this.databaseService.cards.findMany({
      where: {
        isDeleted: false,
      },
      select: {
        ...fields,
      },
    });

    return stories;
  }

  async findById(id: number) {
    let fields = {
      id: true,
      name: true,
      boardId: true,
      code: true,
      createdAt: true,
      updatedAt: true,
      description: true,
      image: true,
      status: true,
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
    let cards = await this.databaseService.board.findUnique({
      where: {
        id,
      },
      select: {
        cards: true,
      },
    });
    return cards.cards;
  }

  async updateById(
    id: number,
    updateCardDto: Prisma.CardsUpdateInput,
    file: string,
    host: string,
    port: string,
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
