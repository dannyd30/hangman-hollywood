import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HomeComponent } from './home/home.component';
import { GameComponent } from './game/game.component';
import { OnlineComponent } from './game/online/online.component';
import { PlayComponent } from './game/play/play.component';
import { GiverComponent } from './game/play/giver/giver.component';
import { GuesserComponent } from './game/play/guesser/guesser.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    GameComponent,
    OnlineComponent,
    PlayComponent,
    GiverComponent,
    GuesserComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
