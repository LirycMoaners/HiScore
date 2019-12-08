import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GameListComponent } from './game-list/game-list.component';
import { AboutComponent } from './about/about.component';
import { HelpComponent } from './help/help.component';

const routes: Routes = [
  {
    path: '',
    component: GameListComponent
  },
  {
    path: 'about',
    component: AboutComponent
  },
  {
    path: 'help',
    component: HelpComponent
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [],
  declarations: [],
})
export class HomeRoutingModule { }

export const routedComponents = [
  GameListComponent,
  HelpComponent,
  AboutComponent
];
