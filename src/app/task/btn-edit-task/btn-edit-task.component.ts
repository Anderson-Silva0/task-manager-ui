import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import Task from '../../models/task.model';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaskStatus } from '../task-status.enum';
import { TaskService } from '../../services/task.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-btn-edicao-task',
  templateUrl: './btn-edit-task.component.html',
  styleUrls: ['./btn-edit-task.component.css']
})
export class BtnEdicaoTaskComponent implements OnInit {
  TaskStatus = TaskStatus;
  statusOptions = Object.values(TaskStatus);

  @Input() estilo: string = '';
  @Input() texto: string = '';
  @Input() icone: string = '';
  @Input() task: Task = new Task();
  @Output() atualizaTaskEvent = new EventEmitter<Task>(); 

  modalRef?: BsModalRef;
  frmEdit!: FormGroup;

  constructor(
    private modalService: BsModalService,
    private formBuilder: FormBuilder,
    private taskService: TaskService,
    private snackBar: MatSnackBar
  ) {
    this.criarFormulario();
  }

  private criarFormulario(): void {
    this.frmEdit = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(5)]],
      status: [TaskStatus.PENDENTE, Validators.required],
      deadline: [null]
    });
  }

  ngOnInit(): void {
  }

  get f() {
    return this.frmEdit.controls;
  }

  atualizaTask() {
    if (this.frmEdit.valid && this.task?.id) {
      let deadline = this.frmEdit.value.deadline;
      if (deadline) {
        if (typeof deadline === 'string') {
          // deadline do input: yyyy-MM-ddTHH:mm ou yyyy-MM-ddTHH:mm:ss
          // Garantir que tenha segundos
          if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(deadline)) {
            deadline += ':00';
          } else if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(deadline)) {
            deadline = deadline.substring(0, 19); // remove milissegundos/fuso se houver
          }
        } else if (deadline instanceof Date) {
          // Converte para yyyy-MM-dd'T'HH:mm:ss
          const pad = (n: number) => n.toString().padStart(2, '0');
          deadline = `${deadline.getFullYear()}-${pad(deadline.getMonth()+1)}-${pad(deadline.getDate())}T${pad(deadline.getHours())}:${pad(deadline.getMinutes())}:${pad(deadline.getSeconds())}`;
        }
      } else {
        deadline = null;
      }
      const task = {
        title: this.frmEdit.value.title,
        description: this.frmEdit.value.description,
        status: this.frmEdit.value.status,
        userId: this.task.userId,
        deadline: deadline
      };

      this.taskService.updateTask(this.task.id, task).subscribe({
        next: (updatedTask) => {
          this.modalRef?.hide();
          this.atualizaTaskEvent.emit(updatedTask);
          this.snackBar.open('Tarefa atualizada com sucesso!', 'Fechar', { duration: 3000 });
        },
        error: (error) => {
          console.error('Erro ao atualizar tarefa:', error);
          this.snackBar.open('Erro ao atualizar tarefa', 'Fechar', { duration: 3000 });
        }
      });
    }
  }
  
  abrirModal(template: TemplateRef<any>) {
    if (this.task?.status === TaskStatus.CONCLUIDO) {
      this.snackBar.open('Não é possível editar tarefas concluídas', 'Fechar', { duration: 3000 });
      return;
    }

    if (this.task) {
      let deadlineValue = null;
      if (this.task.deadline) {
        if (typeof this.task.deadline === 'string') {
          // Se vier como 'yyyy-MM-ddTHH:mm:ss' ou 'yyyy-MM-ddTHH:mm:ss.SSSZ', converter para 'yyyy-MM-ddTHH:mm'
          const match = this.task.deadline.match(/^([0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2})/);
          deadlineValue = match ? match[1] : this.task.deadline;
        } else if (this.task.deadline instanceof Date) {
          const pad = (n: number) => n.toString().padStart(2, '0');
          deadlineValue = `${this.task.deadline.getFullYear()}-${pad(this.task.deadline.getMonth()+1)}-${pad(this.task.deadline.getDate())}T${pad(this.task.deadline.getHours())}:${pad(this.task.deadline.getMinutes())}`;
        }
      }
      this.frmEdit.patchValue({
        title: this.task.title,
        description: this.task.description,
        status: this.task.status,
        deadline: deadlineValue
      });
      this.modalRef = this.modalService.show(template);
    }
  }

  getStatusLabel(status: TaskStatus): string {
    switch (status) {
      case TaskStatus.PENDENTE:
        return 'Pendente';
      case TaskStatus.EM_ANDAMENTO:
        return 'Em Andamento';
      case TaskStatus.CONCLUIDO:
        return 'Concluído';
      default:
        return '';
    }
  }
} 