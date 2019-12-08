import { NgModule } from '@angular/core';
import { MatDialogModule, MatButtonModule, MatInputModule,
  MatSelectModule, MatAutocompleteModule, MatIconModule,
  MatToolbarModule, MatTableModule, MatMenuModule, MatSlideToggleModule, MatFormFieldModule } from '@angular/material';
import { LongPressDirective } from './directives/long-press.directive';
import { PlayerNamePipe } from './pipes/player-name.pipe';
import { KeyEnumPipe } from './pipes/key-enum.pipe';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    RouterModule,
    DragDropModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatIconModule,
    MatToolbarModule,
    MatTableModule,
    MatMenuModule,
    MatSlideToggleModule,
    MatFormFieldModule
  ],
  exports: [
    FormsModule,
    CommonModule,
    RouterModule,
    DragDropModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatIconModule,
    MatToolbarModule,
    MatTableModule,
    MatMenuModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    LongPressDirective,
    PlayerNamePipe,
    KeyEnumPipe
  ],
  declarations: [
    LongPressDirective,
    PlayerNamePipe,
    KeyEnumPipe
  ]
})
export class SharedModule { }
