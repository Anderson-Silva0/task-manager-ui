import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ListaComponent } from './lista/lista.component';
import { TaskComponent } from './task/task.component';
import { BtnEdicaoTaskComponent } from './task/btn-edit-task/btn-edit-task.component';
import { BtnNovoTaskComponent } from './task/btn-new-task/btn-new-task.component';
import { BtnExcluirTaskComponent } from './task/btn-delete-task/btn-delete-task.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NavbarComponent } from './navbar/navbar.component';

@NgModule({
  declarations: [
    AppComponent,
    ListaComponent,
    TaskComponent,
    BtnEdicaoTaskComponent,
    BtnNovoTaskComponent,
    BtnExcluirTaskComponent,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
