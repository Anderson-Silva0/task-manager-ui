import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import Task from '../task.model';
import { TaskService } from '../task.service';
import { TaskStatus } from '../task-status.enum';

interface TaskRequest {
  title: string;
  description: string;
  userId: number;
}

@Component({
  selector: 'app-lista-task',
  templateUrl: './lista-task.component.html',
  styleUrls: ['./lista-task.component.css']
})
export class ListaTaskComponent implements OnInit {
  tasks: Task[] = [];
  error: boolean = false;

  constructor(
    private taskService: TaskService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadTasks();
  }

  private showErrorMessage(error: any, defaultMessage: string): void {
    console.error(defaultMessage, error);
    let errorMessage = defaultMessage;
    
    if (error.error?.messages && error.error.messages.length > 0) {
      errorMessage = error.error.messages[0];
    }
    
    this.snackBar.open(errorMessage, 'Fechar', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['error-snackbar']
    });
  }

  private showSuccessMessage(message: string): void {
    this.snackBar.open(message, 'Fechar', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.error = false;
      },
      error: (error) => {
        this.error = true;
        this.showErrorMessage(error, 'Erro ao carregar tarefas');
      }
    });
  }

  criarTask(taskData: TaskRequest): void {
    this.taskService.createTask(taskData).subscribe({
      next: () => {
        this.loadTasks();
        this.showSuccessMessage('Tarefa criada com sucesso!');
      },
      error: (error) => {
        this.showErrorMessage(error, 'Erro ao criar tarefa');
      }
    });
  }

  atualizarTask(task: Task): void {
    if (task.id) {
      const taskData = {
        title: task.title,
        description: task.description,
        status: task.status
      };
      this.taskService.updateTask(task.id, taskData).subscribe({
        next: () => {
          this.loadTasks();
          this.showSuccessMessage('Tarefa atualizada com sucesso!');
        },
        error: (error) => {
          this.showErrorMessage(error, 'Erro ao atualizar tarefa');
        }
      });
    }
  }

  atualizarStatus(event: {indice: number, status: TaskStatus}): void {
    const task = this.tasks[event.indice];
    if (task && task.id) {
      const taskData = {
        status: event.status
      };
      this.taskService.updateTask(task.id, taskData).subscribe({
        next: () => {
          this.loadTasks();
          this.showSuccessMessage('Status atualizado com sucesso!');
        },
        error: (error) => {
          this.showErrorMessage(error, 'Erro ao atualizar status');
        }
      });
    }
  }

  removerTask(indice: number): void {
    const task = this.tasks[indice];
    if (task && task.id) {
      this.taskService.deleteTask(task.id).subscribe({
        next: () => {
          this.loadTasks();
          this.showSuccessMessage('Tarefa removida com sucesso!');
        },
        error: (error) => {
          this.showErrorMessage(error, 'Erro ao remover tarefa');
        }
      });
    }
  }
} 