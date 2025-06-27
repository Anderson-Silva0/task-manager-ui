import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import Task from '../models/task.model';
import { TaskStatus } from './task-status.enum';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {
  @Input() task!: Task;
  @Input() taskIndex: number = 0;
  @Output() notificaTaskExcluidaEvent = new EventEmitter<number>();
  TaskStatus = TaskStatus;
  userName: string = '';

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.loadUserName();
  }

  private loadUserName(): void {
    if (this.task?.userId) {
      this.userService.getUserById(this.task.userId).subscribe({
        next: (user: User) => {
          this.userName = user.name;
        },
        error: (error) => {
          console.error('Erro ao carregar nome do usuário:', error);
          this.userName = 'Usuário não encontrado';
        }
      });
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

  formatDeadline(deadline: string | Date): string {
    if (!deadline) return '';
    let dateObj: Date;
    if (typeof deadline === 'string') {
      const match = deadline.match(/^(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2}):(\d{2})$/);
      if (match) {
        const [_, day, month, year, hour, minute, second] = match;
        dateObj = new Date(
          Number(year),
          Number(month) - 1,
          Number(day),
          Number(hour),
          Number(minute),
          Number(second)
        );
      } else {
        dateObj = new Date(deadline);
      }
    } else {
      dateObj = deadline;
    }
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(dateObj.getDate())}/${pad(dateObj.getMonth()+1)}/${dateObj.getFullYear()} ${pad(dateObj.getHours())}:${pad(dateObj.getMinutes())}`;
  }
}
