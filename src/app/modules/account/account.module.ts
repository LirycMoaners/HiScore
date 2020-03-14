import { NgModule } from '@angular/core';
import { routedComponents, AccountRoutingModule } from './account-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { SignInDialogComponent } from './sign-in-dialog/sign-in-dialog.component';
import { SignUpComponent } from './sign-up/sign-up.component';



@NgModule({
  declarations: [
    routedComponents,
    SignInDialogComponent,
    SignUpComponent
  ],
  imports: [
    AccountRoutingModule,
    SharedModule
  ],
  entryComponents: [
    SignInDialogComponent
  ]
})
export class AccountModule { }
