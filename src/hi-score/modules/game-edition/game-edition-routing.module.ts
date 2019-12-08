import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GameEditionComponent } from './game-edition.component';

const routes: Routes = [
  {
    path: '',
    component: GameEditionComponent
  },
  {
    path: ':id',
    component: GameEditionComponent
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [],
  declarations: [],
})
export class GameEditionRoutingModule { }

export const routedComponents = [
  GameEditionComponent
];
