import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule, MatButtonModule, MatInputModule,
  MatSelectModule, MatAutocompleteModule, MatIconModule, MatToolbarModule, MatTableModule } from '@angular/material';
import { DndModule } from 'ng2-dnd';

import { HiScoreComponent } from './hi-score.component';
import { HiScoreRoutingModule, routedComponents } from './hi-score.routing.module';
import { MainBarComponent } from './shared/main-bar/main-bar.component';
import { OptionMenuComponent } from './shared/option-menu/option-menu.component';
import { GameService } from './shared/game/game.service';
import { PlayerService } from './shared/player/player.service';
import { GameCategoryService } from './shared/game-category/game-category.service';
import { LongPressDirective } from './shared/long-press.directive';
import { ScoreDialogComponent } from './current-game/score-dialog/score-dialog.component';
import { MainBarService } from './shared/main-bar/main-bar.service';
import { PlayerNamePipe } from './shared/player/player-name.pipe';
import { AddCategoryDialogComponent } from './game-creation/add-category-dialog/add-category-dialog.component';
import { KeyEnumPipe } from './shared/key-enum.pipe';
import { WinDialogComponent } from './current-game/win-dialog/win-dialog.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    HiScoreComponent,
    routedComponents,
    MainBarComponent,
    OptionMenuComponent,
    ScoreDialogComponent,
    WinDialogComponent,
    AddCategoryDialogComponent,
    LongPressDirective,
    PlayerNamePipe,
    KeyEnumPipe
  ],
  entryComponents: [
    ScoreDialogComponent,
    WinDialogComponent,
    AddCategoryDialogComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatIconModule,
    MatToolbarModule,
    MatTableModule,
    HiScoreRoutingModule,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production }),
    DndModule.forRoot()
  ],
  providers: [
    GameService,
    PlayerService,
    GameCategoryService,
    MainBarService
  ],
  bootstrap: [HiScoreComponent]
})
export class HiScoreModule { }
