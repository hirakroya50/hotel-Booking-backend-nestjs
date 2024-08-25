import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from './auth/auth.module';
import { RoomModule } from './room/room.module';
import { ClodinaryService } from './clodinary/clodinary.service';
import { ClodinaryController } from './clodinary/clodinary.controller';
import { ClodinaryModule } from './clodinary/clodinary.module';
import { MulterModule } from '@nestjs/platform-express';
@Module({
  imports: [
    MulterModule.register({
      dest: './uploads',
    }),
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.db_url),
    AuthModule,
    RoomModule,
    ClodinaryModule,
  ],
  controllers: [AppController, ClodinaryController],
  providers: [AppService, ClodinaryService],
})
export class AppModule {}
