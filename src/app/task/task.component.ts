import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import Task from './task.model';
import { TaskStatus } from './task-status.enum';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {
  TaskStatus = TaskStatus; // Para usar no template

  @Input() task: Task = new Task();
  @Input() taskIndex: number = 0;
  @Output() notificaTaskExcluidaEvent = new EventEmitter<number>();
  @Output() atualizaStatusEvent = new EventEmitter<{indice: number, status: TaskStatus}>();

  constructor() { }

  ngOnInit(): void {
  }

  atualizarStatus(status: TaskStatus) {
    if (this.task) {
      this.task.status = status;
      this.atualizaStatusEvent.emit({indice: this.taskIndex, status: status});
    }
  }

  atualizaTask(task: Task) {
    if (task) {
      this.task = task;
    }
  }

  removeTask(indice: number) {
    this.notificaTaskExcluidaEvent.emit(indice);
  }
}
