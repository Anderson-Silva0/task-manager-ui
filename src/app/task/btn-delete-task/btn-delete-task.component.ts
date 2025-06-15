import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-btn-excluir-task',
  templateUrl: './btn-delete-task.component.html',
  styleUrls: ['./btn-delete-task.component.css']
})
export class BtnExcluirTaskComponent implements OnInit {

  @Input() estilo: string = '';
  @Input() texto: string = '';
  @Input() icone: string = '';
  @Input() nomeTask: string = '';
  @Input() indiceTask: number = 0;
  @Output() removeTaskEvent = new EventEmitter<number>();

  modalRef?: BsModalRef;

  constructor(
    private modalService: BsModalService,
  ) {}

  ngOnInit(): void {
  }
  
  abrirModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  confirma() {
    this.modalRef?.hide();
    this.removeTaskEvent.emit(this.indiceTask);
  }

  cancela() {
    this.modalRef?.hide();
  }
} 