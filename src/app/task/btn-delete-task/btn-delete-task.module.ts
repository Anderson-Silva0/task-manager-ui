import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { BtnExcluirTaskComponent } from './btn-delete-task.component';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';

@NgModule({
  declarations: [
    BtnExcluirTaskComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule
  ],
  exports: [
    BtnExcluirTaskComponent
  ]
})
export class BtnExcluirTaskModule { } 