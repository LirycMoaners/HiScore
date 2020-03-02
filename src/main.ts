import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { HiScoreModule } from './hi-score/hi-score.module';
import { environment } from './environments/environment';

import 'hammerjs';
declare const AndroidFullScreen;

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(HiScoreModule)
  .catch(err => console.log(err));
