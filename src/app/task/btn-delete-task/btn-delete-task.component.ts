import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';

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

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
  }
  
  abrirModal(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirmar Exclusão',
        message: `Tem certeza que deseja excluir a tarefa "${this.nomeTask}"?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.removeTaskEvent.emit(this.indiceTask);
      }
    });
  }
} 