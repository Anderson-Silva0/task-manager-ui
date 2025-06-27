import { Component, OnInit } from '@angular/core';
import Task from '../models/task.model';
import { TaskStatus } from '../task/task-status.enum';
import { TaskService } from '../services/task.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.css']
})
export class ListaComponent implements OnInit {
  titulo: string = 'Gerenciamento de Tarefas';
  tasks: Task[] = [];
  users: User[] = [];
  selectedStatus: TaskStatus | null = null;
  selectedUserId: number | null = null;
  loading = false;
  error = false;
  TaskStatus = TaskStatus;

  constructor(
    private taskService: TaskService,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    this.buscar();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: users => this.users = users,
      error: () => this.snackBar.open('Erro ao carregar usuários', 'Fechar', { duration: 3000 })
    });
  }

  buscar(): void {
    this.loading = true;
    this.error = false;
    this.taskService.getTasks(
      this.selectedStatus || undefined,
      this.selectedUserId || undefined
    ).subscribe({
      next: tasks => {
        this.tasks = tasks;
        this.loading = false;
      },
      error: () => {
        this.error = true;
        this.loading = false;
        this.snackBar.open('Erro ao carregar tarefas', 'Fechar', { duration: 3000 });
      }
    });
  }

  limparFiltros(): void {
    this.selectedStatus = null;
    this.selectedUserId = null;
    this.buscar();
  }

  novaTask(task: Task) {
    if (task) {
      this.taskService.createTask(task).subscribe({
        next: (newTask) => {
          this.tasks.push(newTask);
          this.snackBar.open('Tarefa criada com sucesso!', 'Fechar', { duration: 3000 });
        },
        error: (error) => {
          this.snackBar.open('Erro ao criar tarefa', 'Fechar', { duration: 3000 });
          console.error('Erro ao criar tarefa:', error);
        }
      });
    }
  }

  removeTask(indice: number) {
    if (indice >= 0 && indice < this.tasks.length) {
      const task = this.tasks[indice];
      if (task.id) {
        this.taskService.deleteTask(task.id).subscribe({
          next: () => {
            this.tasks.splice(indice, 1);
            this.snackBar.open('Tarefa excluída com sucesso!', 'Fechar', { duration: 3000 });
          },
          error: (error) => {
            this.snackBar.open('Erro ao excluir tarefa', 'Fechar', { duration: 3000 });
            console.error('Erro ao excluir tarefa:', error);
          }
        });
      }
    }
  }

  atualizarStatus(evento: {indice: number, status: TaskStatus}) {
    if (evento.indice >= 0 && evento.indice < this.tasks.length) {
      const task = this.tasks[evento.indice];
      if (task.id) {
        this.taskService.updateTask(task.id, { status: evento.status }).subscribe({
          next: (updatedTask) => {
            this.tasks[evento.indice] = updatedTask;
            this.snackBar.open('Status atualizado com sucesso!', 'Fechar', { duration: 3000 });
          },
          error: (error) => {
            this.snackBar.open('Erro ao atualizar status', 'Fechar', { duration: 3000 });
            console.error('Erro ao atualizar status:', error);
          }
        });
      }
    }
  }
}