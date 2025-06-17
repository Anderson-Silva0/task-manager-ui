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
  TaskStatus = TaskStatus; // Para usar no template
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
      const task = {
        title: this.frmEdit.value.title,
        description: this.frmEdit.value.description,
        status: this.frmEdit.value.status,
        userId: this.task.userId
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
      this.frmEdit.patchValue({
        title: this.task.title,
        description: this.task.description,
        status: this.task.status,
        deadline: this.task.deadline ? new Date(this.task.deadline) : null
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