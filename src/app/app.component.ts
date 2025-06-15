import { Component, OnInit } from '@angular/core';
import Task from './task/task.model';
import { TaskStatus } from './task/task-status.enum';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  tarefas = [
    {
      id: 1,
      title: 'Implementar Login',
      description: 'Criar tela de login com autenticação JWT',
      status: TaskStatus.EM_ANDAMENTO,
      createdAt: new Date('2024-03-15T10:00:00'),
      userId: 1
    },
    {
      id: 2,
      title: 'Criar Dashboard',
      description: 'Desenvolver dashboard com gráficos e métricas',
      status: TaskStatus.PENDENTE,
      createdAt: new Date('2024-03-15T11:30:00'),
      userId: 1
    },
    {
      id: 3,
      title: 'Configurar CI/CD',
      description: 'Implementar pipeline de integração contínua',
      status: TaskStatus.CONCLUIDA,
      createdAt: new Date('2024-03-14T15:45:00'),
      userId: 1
    }
  ];

  tasks: Task[] = [];

  ngOnInit() {
    this.tarefas.forEach(tarefa => {
      const task = new Task();
      task.id = tarefa.id;
      task.title = tarefa.title;
      task.description = tarefa.description;
      task.status = tarefa.status;
      task.createdAt = tarefa.createdAt;
      task.userId = tarefa.userId;
      this.tasks.push(task);
    });
  }
}
