import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NavbarModule } from './navbar/navbar.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TaskComponent } from './task/task.component';
import { ConfirmDialogComponent } from './shared/confirm-dialog/confirm-dialog.component';
import { BtnEdicaoTaskComponent } from './task/btn-edit-task/btn-edit-task.component';
import { BtnNovoTaskComponent } from './task/btn-new-task/btn-new-task.component';
import { BtnExcluirTaskModule } from './task/btn-delete-task/btn-delete-task.module';
import { ListaComponent } from './lista/lista.component';
import { UserModule } from './user/user.module';

@NgModule({
  declarations: [
    AppComponent,
    TaskComponent,
    ConfirmDialogComponent,
    BtnEdicaoTaskComponent,
    BtnNovoTaskComponent,
    ListaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    ModalModule.forRoot(),
    NavbarModule,
    UserModule,
    BtnExcluirTaskModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
