import { NgModule } from '@angular/core';

import { routedComponents, CurrentGameRoutingModule } from './current-game-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { ScoreDialogComponent } from './score-dialog/score-dialog.component';
import { WinDialogComponent } from './win-dialog/win-dialog.component';

@NgModule({
  imports: [
    CurrentGameRoutingModule,
    SharedModule
  ],
  exports: [],
  declarations: [
    routedComponents,
    ScoreDialogComponent,
    WinDialogComponent
  ],
  entryComponents: [
    ScoreDialogComponent,
    WinDialogComponent
  ]
})
export class CurrentGameModule { }
