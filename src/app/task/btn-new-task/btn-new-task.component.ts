import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import Task from '../task.model';
import { TaskStatus } from '../task-status.enum';

@Component({
  selector: 'app-btn-novo-task',
  templateUrl: './btn-new-task.component.html',
  styleUrls: ['./btn-new-task.component.css']
})
export class BtnNovoTaskComponent implements OnInit {

  @Input() estilo: string = '';
  @Input() texto: string = '';
  @Output() novoTaskEvent = new EventEmitter<Task>();

  modalRef?: BsModalRef;
  frmNew!: FormGroup;

  constructor(
    private modalService: BsModalService,
    private formBuilder: FormBuilder
  ) {
    this.criarFormulario();
  }

  private criarFormulario(): void {
    this.frmNew = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  ngOnInit(): void {
  }

  abrirModal(template: TemplateRef<any>) {
    this.frmNew.reset();
    this.modalRef = this.modalService.show(template);
  }

  salvar() {
    if (this.frmNew.valid) {
      this.modalRef?.hide();
      const task = this.frmNew.getRawValue() as Task;
      task.status = TaskStatus.PENDENTE;
      task.createdAt = new Date();
      task.userId = 1; // TODO: Implementar autenticação
      this.novoTaskEvent.emit(task);
    }
  }
} 