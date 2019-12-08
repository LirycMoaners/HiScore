import { NgModule } from '@angular/core';

import { routedComponents, HomeRoutingModule } from './home-routing.module';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    HomeRoutingModule,
    SharedModule
  ],
  exports: [],
  declarations: [routedComponents]
})
export class HomeModule { }
