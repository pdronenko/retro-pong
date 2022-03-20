import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { AppController } from './app.controller';
import { GameModule } from './game/game.module';

@Module({
  imports: [
    GameModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'retro-pong'),
      renderPath: 'root',
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
