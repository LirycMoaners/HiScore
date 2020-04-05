import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GameListComponent } from './game-list/game-list.component';
import { AboutComponent } from './about/about.component';
import { HelpComponent } from './help/help.component';
import { TermsComponent } from './terms/terms.component';

const routes: Routes = [
  {
    path: '',
    component: GameListComponent
  },
  {
    path: 'help',
    component: HelpComponent
  },
  {
    path: 'about',
    component: AboutComponent
  },
  {
    path: 'terms',
    component: TermsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [],
  declarations: [],
})
export class HomeRoutingModule { }

export const routedComponents = [
  GameListComponent,
  HelpComponent,
  AboutComponent,
  TermsComponent
];
