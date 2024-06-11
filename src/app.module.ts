import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { BoardModule } from './board/board.module';
// import { ListModule } from './list/list.module';
import { CardModule } from './card/card.module';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { MyLoggerModule } from './my-logger/my-logger.module';
import { AuthModule } from './auth/auth.module';
import { TaskModule } from './task/task.module';
import { EffortModule } from './effort/effort.module';
import config from './config/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      load: [config],
    }),
    DatabaseModule,
    BoardModule,
    // ListModule,
    CardModule,
    UserModule,
    RoleModule,
    // ThrottlerModule.forRoot([
    //   {
    //     name: 'short',
    //     ttl: 1000,
    //     limit: 3,
    //   },
    //   {
    //     name: 'long',
    //     ttl: 60000,
    //     limit: 100,
    //   },
    // ]),
    MyLoggerModule,
    AuthModule,
    TaskModule,
    EffortModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // {
    //   provide: APP_GUARD,
    //   useClass: ThrottlerGuard,
    // },
  ],
})
export class AppModule {}
