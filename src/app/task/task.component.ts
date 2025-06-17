import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import Task from '../models/task.model';
import { TaskStatus } from './task-status.enum';
import { UserService } from '../services/user.service';
import { UserResponse } from '../models/user.model';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {
  @Input() task!: Task;
  @Input() taskIndex: number = 0;
  @Output() notificaTaskExcluidaEvent = new EventEmitter<number>();
  @Output() atualizaStatusEvent = new EventEmitter<{indice: number, status: TaskStatus}>();
  TaskStatus = TaskStatus;
  userName: string = '';

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.loadUserName();
  }

  private loadUserName(): void {
    if (this.task?.userId) {
      this.userService.getUserById(this.task.userId).subscribe({
        next: (user: UserResponse) => {
          this.userName = user.name;
        },
        error: (error) => {
          console.error('Erro ao carregar nome do usuário:', error);
          this.userName = 'Usuário não encontrado';
        }
      });
    }
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
      this.loadUserName();
    }
  }

  removeTask(indice: number) {
    this.notificaTaskExcluidaEvent.emit(indice);
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
