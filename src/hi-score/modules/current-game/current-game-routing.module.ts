import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CurrentGameComponent } from './current-game.component';

const routes: Routes = [
  {
    path: ':id',
    component: CurrentGameComponent
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [],
  declarations: [],
})
export class CurrentGameRoutingModule { }

export const routedComponents = [
  CurrentGameComponent
];
