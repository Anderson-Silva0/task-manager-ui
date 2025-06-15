import { Component, Input, OnInit } from '@angular/core';
import Task from '../task/task.model';
import { TaskStatus } from '../task/task-status.enum';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.css']
})
export class ListaComponent implements OnInit {

  @Input() titulo: string = '';
  @Input() tasks: Task[] = [];

  constructor() { }

  ngOnInit(): void {
  }

  novaTask(task: Task) {
    if (task) {
      this.tasks.push(task);
    }
  }

  removeTask(indice: number) {
    if (indice >= 0 && indice < this.tasks.length) {
      this.tasks.splice(indice, 1);
    }
  }

  atualizarStatus(evento: {indice: number, status: TaskStatus}) {
    if (evento.indice >= 0 && evento.indice < this.tasks.length) {
      this.tasks[evento.indice].status = evento.status;
    }
  }
}