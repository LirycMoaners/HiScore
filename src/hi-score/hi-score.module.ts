import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HiScoreComponent } from './hi-score.component';
import { HiScoreRoutingModule } from './hi-score.routing.module';
import { CoreModule } from './core/core.module';

@NgModule({
  declarations: [
    HiScoreComponent
  ],
  imports: [
    BrowserAnimationsModule,
    HiScoreRoutingModule,
    CoreModule
  ],
  bootstrap: [HiScoreComponent]
})
export class HiScoreModule { }
