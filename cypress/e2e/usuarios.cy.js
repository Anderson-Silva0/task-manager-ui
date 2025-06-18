describe("CRUD de Usuários", () => {
  let emailCriado;
  let nomeUsuario;

  beforeEach(() => {
    cy.visit("/users");
  });

  it("deve cadastrar um novo usuário", () => {
    const timestamp = Date.now();
    nomeUsuario = `Usuário Teste ${timestamp}`;
    emailCriado = `usuario${timestamp}@teste.com`;

    cy.get("button.btn-success").should("be.visible").click();
    cy.get('input[formControlName="name"]').type(nomeUsuario);
    cy.get('input[formControlName="email"]').type(emailCriado);
    cy.get('button[type="submit"]').click();
    cy.get("table").should("contain", nomeUsuario);
    cy.get("table").should("contain", emailCriado);
  });

  it("deve listar os usuários cadastrados", () => {
    cy.get("table").should("be.visible");
    cy.get("table").find("tr").should("have.length.greaterThan", 1);
  });

  it("Update - deve editar um usuário existente", () => {
    const timestamp = Date.now();
    const novoNome = `Nome Editado ${timestamp}`;

    cy.get("button.btn-outline-primary").first().click();
    cy.get('input[formControlName="name"]').clear().type(novoNome);
    cy.get('button[type="submit"]').click();
    cy.get("table").should("contain", novoNome);
  });

  it("não deve permitir cadastro de usuário com email duplicado", () => {
    cy.get("button.btn-success").should("be.visible").click();
    cy.get('input[formControlName="name"]').type("Usuário Duplicado");
    cy.get('input[formControlName="email"]').type(emailCriado);
    cy.get('button[type="submit"]').click();
    cy.contains("Email já cadastrado").should("be.visible");
  });

  it("Delete - deve excluir um usuário sem tarefas", () => {
    cy.get("button.btn-danger").last().click();
    cy.get("mat-dialog-container").should("be.visible");
    cy.get('mat-dialog-actions button[color="warn"]').click();
    cy.contains("Usuário excluído com sucesso").should("be.visible");
  });

  it("não deve permitir exclusão de usuário com tarefas cadastradas", () => {
    const timestamp = Date.now();
    const nomeUsuarioComTarefa = `Usuário Com Tarefa ${timestamp}`;
    const emailUsuarioComTarefa = `comtarefa${timestamp}@teste.com`;

    cy.visit("/users");
    cy.get("button.btn-success").should("be.visible").click();
    cy.get('input[formControlName="name"]').type(nomeUsuarioComTarefa);
    cy.get('input[formControlName="email"]').type(emailUsuarioComTarefa);
    cy.get('button[type="submit"]').click();
    cy.get("table").should("contain", nomeUsuarioComTarefa);

    cy.visit("/tasks");
    const titulo = `Tarefa Teste ${timestamp}`;
    const descricao = `Descrição da tarefa ${timestamp}`;

    cy.get("button.btn-success").should("be.visible");

    cy.get("button.btn-success").click();

    cy.get('select[formControlName="userId"]').should("be.visible");
    cy.get('select[formControlName="userId"] option').should(
      "have.length.greaterThan", 1);

    cy.get('input[formControlName="title"]').type(titulo);
    cy.get('textarea[formControlName="description"]').type(descricao);

    cy.get('select[formControlName="userId"]').select(
      `${nomeUsuarioComTarefa} (${emailUsuarioComTarefa})`
    );

    cy.get('button[type="submit"]').click();

    cy.get(".card-title").should("contain", titulo);

    cy.visit("/users");
    cy.contains(nomeUsuarioComTarefa)
      .parent()
      .find("button.btn-danger")
      .click();
    cy.get("mat-dialog-container").should("be.visible");
    cy.get('mat-dialog-actions button[color="warn"]').click();

    cy.contains("Usuário possui tarefas associadas e não pode ser deletado.").should("be.visible");
  });
});
