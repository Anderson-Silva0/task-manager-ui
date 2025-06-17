import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import Task from '../../models/task.model';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaskStatus } from '../task-status.enum';

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
  ) {
    this.criarFormulario();
  }

  private criarFormulario(): void {
    this.frmEdit = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(5)]],
      status: [TaskStatus.PENDENTE, Validators.required]
    });
  }

  ngOnInit(): void {
  }

  get f() {
    return this.frmEdit.controls;
  }

  atualizaTask() {
    if (this.frmEdit.valid && this.task) {
      this.modalRef?.hide();
      const task = this.frmEdit.getRawValue() as Task;
      task.id = this.task.id;
      task.createdAt = this.task.createdAt;
      task.userId = this.task.userId;
      this.atualizaTaskEvent.emit(task);
    }
  }
  
  abrirModal(template: TemplateRef<any>) {
    if (this.task) {
      this.frmEdit.patchValue({
        title: this.task.title,
        description: this.task.description,
        status: this.task.status
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
      case TaskStatus.CONCLUIDA:
        return 'Concluída';
      default:
        return '';
    }
  }
} 