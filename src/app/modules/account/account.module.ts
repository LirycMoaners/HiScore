import { NgModule } from '@angular/core';
import { routedComponents, AccountRoutingModule } from './account-routing.module';
import { SharedModule } from '../../shared/shared.module';



@NgModule({
  declarations: [routedComponents],
  imports: [
    AccountRoutingModule,
    SharedModule
  ]
})
export class AccountModule { }
