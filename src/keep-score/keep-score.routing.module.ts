import { RouterModule, Routes } from '@angular/router';
import { GameListComponent } from './game-list/game-list.component';
import { NgModule } from '@angular/core';
import { CurrentGameComponent } from './current-game/current-game.component';
import { GameCreationComponent } from './game-creation/game-creation.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'game-list'
  },
  {
    path: 'game-list',
    component: GameListComponent
  },
  {
    path: 'current-game/:id',
    component: CurrentGameComponent
  },
  {
    path: 'game-creation',
    component: GameCreationComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class KeepScoreRoutingModule {}

export const routedComponents = [
  GameListComponent,
  CurrentGameComponent,
  GameCreationComponent
];
