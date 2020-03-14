import { NgModule } from '@angular/core';
import { GameService } from './services/game.service';
import { PlayerService } from './services/player.service';
import { GameCategoryService } from './services/game-category.service';
import { HeaderService } from './header/header.service';
import { HeaderComponent } from './header/header.component';
import { SharedModule } from '../shared/shared.module';
import { OptionMenuComponent } from './header/option-menu/option-menu.component';
import { OptionMenuService } from './header/option-menu/option-menu.service';
import { SidenavComponent } from './sidenav/sidenav.component';
import { AccountMenuComponent } from './header/account-menu/account-menu.component';
import { AuthenticationService } from './http-services/authentication.service';

@NgModule({
  imports: [SharedModule],
  exports: [
    SharedModule,
    HeaderComponent,
    SidenavComponent
  ],
  declarations: [
    HeaderComponent,
    OptionMenuComponent,
    SidenavComponent,
    AccountMenuComponent
  ],
  providers: [
    HeaderService,
    OptionMenuService,
    GameService,
    PlayerService,
    GameCategoryService,
    AuthenticationService
  ],
})
export class CoreModule { }
