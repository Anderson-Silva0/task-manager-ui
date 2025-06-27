import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { MatSnackBar } from '@angular/material/snack-bar';

interface TaskRequest {
  title: string;
  description: string;
  userId: number;
  deadline?: string;
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
  users: User[] = [];
  error: boolean = false;
  backendErrors: { [key: string]: string } = {};
  minDeadline: string = '';

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
      userId: ['', [Validators.required]],
      deadline: [null]
    });
  }

  ngOnInit(): void {
    this.loadUsers();
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    this.minDeadline = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
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
      let deadline = this.frmNew.value.deadline;
      if (deadline) {
        let deadlineDate: Date;
        if (typeof deadline === 'string') {
          deadlineDate = new Date(deadline.length === 16 ? deadline+':00' : deadline);
        } else {
          deadlineDate = deadline;
        }
        if (deadlineDate < new Date()) {
          this.modalRef?.hide();
          this.snackBar.open('A data limite não pode ser menor que a data/hora atual.', 'Fechar', { duration: 3000 });
          return;
        }
      }
      this.modalRef?.hide();
      let deadlineFormatted = this.frmNew.value.deadline;
      if (deadlineFormatted) {
        if (typeof deadlineFormatted === 'string') {
          if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(deadlineFormatted)) {
            deadlineFormatted += ':00';
          } else if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(deadlineFormatted)) {
            deadlineFormatted = deadlineFormatted.substring(0, 19);
          }
        } else if (deadlineFormatted instanceof Date) {
          const pad = (n: number) => n.toString().padStart(2, '0');
          deadlineFormatted = `${deadlineFormatted.getFullYear()}-${pad(deadlineFormatted.getMonth()+1)}-${pad(deadlineFormatted.getDate())}T${pad(deadlineFormatted.getHours())}:${pad(deadlineFormatted.getMinutes())}:${pad(deadlineFormatted.getSeconds())}`;
        }
      } else {
        deadlineFormatted = null;
      }
      const taskData: any = {
        title: this.frmNew.value.title,
        description: this.frmNew.value.description,
        userId: this.frmNew.value.userId,
        deadline: deadlineFormatted
      };
      this.novoTaskEvent.emit(taskData);
    }
  }

  private showErrorMessage(error: any, defaultMessage: string): void {
    console.error(defaultMessage, error);
    let errorMessage = defaultMessage;
    
    if (error.error?.messages && error.error.messages.length > 0) {
      errorMessage = error.error.messages[0];
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