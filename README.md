# Task Manager UI 🎨

Bem-vindo ao Task Manager UI! 🚀

**Aplicação frontend em Angular para o sistema Task Manager, com Cypress para testes E2E e containerização via Docker.**

Este projeto precisa ser clonado dentro do repositório backend `task-manager-system`. **O README do backend** contém instruções de execução via Docker Compose.

🚀 **Visão Geral**

- **Repositório Frontend**: https://github.com/Anderson-Silva0/task-manager-ui
- **Repositório Backend**: https://github.com/Anderson-Silva0/task-manager-system

------

## 📁 Estrutura após clone

Após clonar ambos os repositórios e posicionar o frontend dentro do backend:

```plain
task-manager-system/
├── user-service/        # Microservice de usuários
├── task-service/        # Microservice de tarefas
└── task-manager-ui/     # Aplicação frontend Angular
```

A pasta `task-manager-ui` conterá o projeto frontend.

------

## 🚀 Execução

Consulte o **README do backend** (`task-manager-system/README.md`) para ver como executar todo o sistema via Docker Compose.

Durante a inicialização, o container do frontend exibirá nos logs os resultados dos testes E2E com Cypress. Se algum teste falhar, será capturada automaticamente uma screenshot e salva conforme configuração do Cypress, dentro do projeto **task-manager-ui**. Não se preocupe com falhas esporádicas nos testes E2E: a aplicação continuará funcionando (por exemplo, um teste pode falhar se o backend demorar a responder ou o frontend não estiver pronto ainda, mas é muito difícil acontecer).

------

## 🚀 Acessar Frontend

Após iniciar os containers via Docker Compose, abra no navegador:

- **Frontend Angular**: [http://localhost:4200](http://localhost:4200/)

------

## 📬 Contato

- Anderson Silva ([LinkedIn](https://www.linkedin.com/in/anderson-da-silva-004a0320b/))

------

✨ Explore o código em `task-manager-ui` e utilize as instruções do backend para ver o sistema completo em funcionamento. 😊