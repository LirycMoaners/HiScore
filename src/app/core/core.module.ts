import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';

import { GameService } from './http-services/game.service';
import { NonUserPlayerService } from './http-services/non-user-player.service';
import { GameCategoryService } from './http-services/game-category.service';
import { HeaderService } from './header/header.service';
import { HeaderComponent } from './header/header.component';
import { SharedModule } from '../shared/shared.module';
import { OptionMenuComponent } from './header/option-menu/option-menu.component';
import { OptionMenuService } from './header/option-menu/option-menu.service';
import { SidenavComponent } from './sidenav/sidenav.component';
import { AuthenticationService } from './http-services/authentication.service';
import { AuthGuard } from './guards/auth.guard';
import { environment } from '../../environments/environment';
import { PlayerService } from './http-services/player.service';
import { UserService } from './http-services/user.service';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    HttpClientModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    SharedModule
  ],
  exports: [
    SharedModule,
    HeaderComponent,
    SidenavComponent
  ],
  declarations: [
    HeaderComponent,
    OptionMenuComponent,
    SidenavComponent
  ],
  providers: [
    AuthGuard,
    HeaderService,
    OptionMenuService,
    GameService,
    NonUserPlayerService,
    PlayerService,
    GameCategoryService,
    AuthenticationService,
    UserService
  ],
})
export class CoreModule { }
