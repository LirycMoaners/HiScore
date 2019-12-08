import { NgModule } from '@angular/core';

import { routedComponents, GameEditionRoutingModule } from './game-edition-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { AddCategoryDialogComponent } from './add-category-dialog/add-category-dialog.component';
import { NewPlayerScoreDialogComponent } from './new-player-score-dialog/new-player-score-dialog.component';


@NgModule({
  imports: [
    GameEditionRoutingModule,
    SharedModule
  ],
  exports: [],
  declarations: [
    routedComponents,
    AddCategoryDialogComponent,
    NewPlayerScoreDialogComponent
  ],
  entryComponents: [
    AddCategoryDialogComponent,
    NewPlayerScoreDialogComponent
  ]
})
export class GameEditionModule { }
