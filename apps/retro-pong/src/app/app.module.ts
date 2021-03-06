import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { SocketIoModule } from 'ngx-socket-io';
import { environment } from '../environments/environment';

import { AppComponent } from './app.component';
import { GameBoardModule } from './modules/game-board/game-board.module';
import { StatusBarModule } from './modules/status-bar/status-bar.module';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [AppComponent],
  imports: [
    SocketIoModule.forRoot({ url: `${location.protocol}//${location.hostname}:${environment.socketPort}` }),
    BrowserModule,
    HttpClientModule,
    RouterModule,
    StatusBarModule,
    GameBoardModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
