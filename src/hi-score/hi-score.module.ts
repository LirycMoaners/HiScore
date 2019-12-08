import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HiScoreComponent } from './hi-score.component';
import { HiScoreRoutingModule } from './hi-score.routing.module';
import { CoreModule } from './core/core.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    HiScoreComponent
  ],
  imports: [
    BrowserAnimationsModule,
    HiScoreRoutingModule,
    CoreModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  bootstrap: [HiScoreComponent]
})
export class HiScoreModule { }
