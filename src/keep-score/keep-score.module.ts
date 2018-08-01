import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { KeepScoreComponent } from './keep-score.component';
import { KeepScoreRoutingModule, routedComponents } from './keep-score.routing.module';
import { MainBarComponent } from './shared/main-bar/main-bar.component';
import { OptionMenuComponent } from './current-game/option-menu/option-menu.component';
import { GameService } from './shared/game/game.service';
import { PlayerService } from './shared/player/player.service';
import { GameCategoryService } from './shared/game-category/game-category.service';
import { LongPressDirective } from './shared/long-press.directive';
import { ScorePopupComponent } from './current-game/score-popup/score-popup.component';
import { MainBarService } from './shared/main-bar/main-bar.service';

@NgModule({
  declarations: [
    KeepScoreComponent,
    routedComponents,
    MainBarComponent,
    OptionMenuComponent,
    ScorePopupComponent,
    LongPressDirective
  ],
  imports: [
    FormsModule,
    BrowserModule,
    KeepScoreRoutingModule
  ],
  providers: [
    GameService,
    PlayerService,
    GameCategoryService,
    MainBarService
  ],
  bootstrap: [KeepScoreComponent]
})
export class KeepScoreModule { }
