describe("Testes de Tarefas", () => {
  let nomeUsuario;
  let emailUsuario;

  beforeEach(() => {
    cy.visit("/users");
    const timestamp = Date.now();
    nomeUsuario = `Usuário Teste ${timestamp}`;
    emailUsuario = `usuario${timestamp}@teste.com`;

    cy.get("button.btn-success").should("be.visible").click();
    cy.get('input[formControlName="name"]').type(nomeUsuario);
    cy.get('input[formControlName="email"]').type(emailUsuario);
    cy.get('button[type="submit"]').click();
    cy.get("table").should("contain", nomeUsuario);

    cy.visit("/tasks");

    cy.get(".fa-spinner").should("not.exist");
  });

  it("deve cadastrar uma nova tarefa", () => {
    const timestamp = Date.now();
    const titulo = `Tarefa Teste ${timestamp}`;
    const descricao = `Descrição da tarefa ${timestamp}`;

    cy.get("button.btn-success").should("be.visible").click();
    cy.get('input[formControlName="title"]').type(titulo);
    cy.get('textarea[formControlName="description"]').type(descricao);
    cy.get('select[formControlName="userId"]').select(
      `${nomeUsuario} (${emailUsuario})`
    );
    cy.get('button[type="submit"]').click();
    cy.get(".card-title").should("contain", titulo);
    cy.get(".card-text").should("contain", descricao);
  });

  it("deve listar as tarefas cadastradas", () => {
    cy.get(".card").should("be.visible");
    cy.get(".card").should("have.length.greaterThan", 0);
  });

  it("Update - deve editar uma tarefa existente e marcar como concluída", () => {
    const timestamp = Date.now();
    const novoTitulo = `Título Editado ${timestamp}`;

    cy.get('.task-status .badge')
      .not(':contains("Concluído")')
      .first()
      .parents('.card')
      .within(() => {
        cy.get('button.btn-outline-primary').click();
      });

    cy.get('input[formControlName="title"]').clear().type(novoTitulo);
    cy.get('select[formControlName="status"]').select("CONCLUIDO");

    cy.get('button[type="submit"]').click();

    cy.get(".card-title").should("contain", novoTitulo);

    cy.get(".badge.bg-success").should("contain", "Concluído");
  });


  it("não deve permitir edição de tarefa com status concluído", () => {
    cy.get('.task-status .badge')
      .contains("Concluído")
      .first()
      .parents('.card')
      .within(() => {
        cy.get("button.btn-outline-primary").click();
      });

    cy.contains("Não é possível editar tarefas concluídas").should("be.visible");
  });

  it("Delete - deve excluir uma tarefa", () => {
    cy.get("button.btn-danger").first().click();
    cy.get("mat-dialog-container").should("be.visible");
    cy.get('mat-dialog-actions button[color="warn"]').click();
    cy.contains("Tarefa excluída com sucesso").should("be.visible");
  });
});
