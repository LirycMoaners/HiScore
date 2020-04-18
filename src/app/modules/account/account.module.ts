import { NgModule } from '@angular/core';

import { routedComponents, AccountRoutingModule } from './account-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { SignInDialogComponent } from './sign-in-dialog/sign-in-dialog.component';
import { SignUpDialogComponent } from './sign-up-dialog/sign-up-dialog.component';
import { DeleteUserDialogComponent } from './delete-user-dialog/delete-user-dialog.component';


@NgModule({
  declarations: [
    routedComponents,
    SignInDialogComponent,
    SignUpDialogComponent,
    DeleteUserDialogComponent
  ],
  imports: [
    AccountRoutingModule,
    SharedModule
  ],
  entryComponents: [
    SignInDialogComponent,
    SignUpDialogComponent,
    DeleteUserDialogComponent
  ]
})
export class AccountModule { }
