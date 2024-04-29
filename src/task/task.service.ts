import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class TaskService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(
    file: string,
    createTaskDto: Prisma.TasksCreateInput,
    host: string,
    port: string,
  ) {
    let result: any;
    let fields = {
      id: true,
      name: true,
      code: true,
      createdAt: true,
      updatedAt: true,
      description: true,
      image: true,
      cardId: true,
      createdBy: {
        where: {
          isDeleted: false,
        },
        select: {
          id: true,
          name: true,
        },
      },
    };

    result = await this.databaseService.tasks.create({
      data: {
        ...createTaskDto,
        image: file !== null ? `http://${host}:${port}/${file}` : null,
      },
      select: {
        id: true,
        name: true,
        description: true,
        estimatedTime: true,
        Card: {
          select: {
            id: true,
            name: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
          },
        },
        assignedBy: {
          select: {
            id: true,
            name: true,
          },
        },
        assignedTo: {
          select: {
            id: true,
            name: true,
          },
        },
        finishedBy: {
          select: {
            id: true,
            name: true,
          },
        },
        closedBy: {
          select: {
            id: true,
            name: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });

    return {
      status: 201,
      message: 'success',
      data: result,
    };
  }

  async updateTaskById() {}

  async deleteTaskById(id: number) {
    try {
      return this.databaseService.tasks.update({
        where: {
          id: id,
          isDeleted: false,
        },
        data: {
          isDeleted: true,
        },
      });
    } catch (error) {
      return error;
    }
  }

  async findAll(user: any) {
    const result = await this.databaseService.tasks.findMany({
      where: { isDeleted: false, createdById: user.id },
      select: {
        id: true,
        name: true,
        description: true,
        estimatedTime: true,
        Card: {
          select: {
            id: true,
            name: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
          },
        },
        assignedBy: {
          select: {
            id: true,
            name: true,
          },
        },
        assignedTo: {
          select: {
            id: true,
            name: true,
          },
        },
        finishedBy: {
          select: {
            id: true,
            name: true,
          },
        },
        closedBy: {
          select: {
            id: true,
            name: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });
    return {
      status: 200,
      message: 'success',
      data: result,
    };
  }

  async findById(id: number) {
    const result = await this.databaseService.cards.findUnique({
      where: {
        id,
        isDeleted: false,
      },
      select: {
        name: true,
        task: { select: { name: true } },
      },
    });
    return {
      status: 200,
      message: 'success',
      data: result,
    };
  }

  async ProjectStoryTask(user: any) {
    let result = await this.databaseService.board.findMany({
      where: {
        isDeleted: false,
        peopleInvolved: {
          some: {
            userId: user.id,
          },
        },
      },
      select: {
        id: true,
        name: true,
        list: {
          select: {
            id: true,
            name: true,
            card: {
              select: {
                id: true,
                name: true,
                task: {
                  where: {
                    isDeleted: false,
                  },
                  select: {
                    id: true,
                    name: true,
                    image: true,
                    description: true,
                    estimatedTime: true,
                    effort: {
                      select: {
                        costTime: true,
                      },
                    },
                    Card: {
                      select: {
                        id: true,
                        name: true,
                      },
                    },
                    createdBy: {
                      select: {
                        id: true,
                        name: true,
                      },
                    },
                    assignedBy: {
                      select: {
                        id: true,
                        name: true,
                      },
                    },
                    assignedTo: {
                      select: {
                        id: true,
                        name: true,
                      },
                    },
                    finishedBy: {
                      select: {
                        id: true,
                        name: true,
                      },
                    },
                    closedBy: {
                      select: {
                        id: true,
                        name: true,
                      },
                    },
                    createdAt: true,
                    updatedAt: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return result
  }
}
