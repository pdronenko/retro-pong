import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { GameBoardModule } from './modules/game-board/game-board.module';
import { StatusBarModule } from './modules/status-bar/status-bar.module';
import { NxWelcomeComponent } from './nx-welcome.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [AppComponent, NxWelcomeComponent],
  imports: [BrowserModule, HttpClientModule, RouterModule, AppRoutingModule, StatusBarModule, GameBoardModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
