import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { UserService } from '../../user/user.service';
import { UserResponse } from '../../models/user.model';
import { MatSnackBar } from '@angular/material/snack-bar';

interface TaskRequest {
  title: string;
  description: string;
  userId: number;
}

@Component({
  selector: 'app-btn-novo-task',
  templateUrl: './btn-new-task.component.html',
  styleUrls: ['./btn-new-task.component.css']
})
export class BtnNovoTaskComponent implements OnInit {
  @Input() estilo: string = '';
  @Input() texto: string = '';
  @Output() novoTaskEvent = new EventEmitter<TaskRequest>();

  modalRef?: BsModalRef;
  frmNew!: FormGroup;
  users: UserResponse[] = [];
  error: boolean = false;
  backendErrors: { [key: string]: string } = {};

  constructor(
    private modalService: BsModalService,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {
    this.criarFormulario();
  }

  private criarFormulario(): void {
    this.frmNew = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      userId: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.error = false;
      },
      error: (error) => {
        console.error('Erro ao carregar usuários:', error);
        this.error = true;
        this.showErrorMessage(error, 'Erro ao carregar usuários');
      }
    });
  }

  abrirModal(template: TemplateRef<any>) {
    this.frmNew.reset();
    this.backendErrors = {};
    this.loadUsers();
    this.modalRef = this.modalService.show(template);
  }

  salvar() {
    if (this.frmNew.valid) {
      this.modalRef?.hide();
      const taskData: TaskRequest = {
        title: this.frmNew.value.title,
        description: this.frmNew.value.description,
        userId: this.frmNew.value.userId
      };
      this.novoTaskEvent.emit(taskData);
    }
  }

  private showErrorMessage(error: any, defaultMessage: string): void {
    console.error(defaultMessage, error);
    let errorMessage = defaultMessage;
    
    if (error.error?.messages && error.error.messages.length > 0) {
      errorMessage = error.error.messages[0];
      // Mapeia as mensagens de erro do backend para os campos do formulário
      if (error.error.messages.length > 1) {
        this.backendErrors = {};
        error.error.messages.forEach((msg: string) => {
          if (msg.toLowerCase().includes('título')) {
            this.backendErrors['title'] = msg;
          } else if (msg.toLowerCase().includes('descrição')) {
            this.backendErrors['description'] = msg;
          } else if (msg.toLowerCase().includes('responsável') || msg.toLowerCase().includes('usuário')) {
            this.backendErrors['userId'] = msg;
          }
        });
      }
    }
    
    this.snackBar.open(errorMessage, 'Fechar', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['error-snackbar']
    });
  }

  getErrorMessage(field: string): string {
    if (this.backendErrors[field]) {
      return this.backendErrors[field];
    }
    
    const control = this.frmNew.get(field);
    if (control?.hasError('required')) {
      return 'Campo obrigatório';
    }
    if (control?.hasError('minlength')) {
      return `Mínimo de ${control.errors?.['minlength'].requiredLength} caracteres`;
    }
    return '';
  }
} 