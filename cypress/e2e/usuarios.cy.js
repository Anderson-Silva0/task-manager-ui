describe('CRUD de Usuários', () => {
  beforeEach(() => {
    cy.visit('/users');
  });

  it('deve cadastrar um novo usuário', () => {
    const timestamp = Date.now();
    const nome = `Usuário Teste ${timestamp}`;
    const email = `usuario${timestamp}@teste.com`;

    cy.get('button.btn-success').should('be.visible').click();
    cy.get('input[formControlName="name"]').type(nome);
    cy.get('input[formControlName="email"]').type(email);
    cy.get('button[type="submit"]').click();
    cy.get('table').should('contain', nome);
    cy.get('table').should('contain', email);
  });

  it('deve listar os usuários cadastrados', () => {
    cy.get('table').should('be.visible');
    cy.get('table').find('tr').should('have.length.greaterThan', 1);
  });

  it('Update - deve editar um usuário existente', () => {
    const timestamp = Date.now();
    const novoNome = `Nome Editado ${timestamp}`;
    
    cy.get('button.btn-outline-primary').first().click();
    cy.get('input[formControlName="name"]').clear().type(novoNome);
    cy.get('button[type="submit"]').click();
    cy.get('table').should('contain', novoNome);
  });

  it('Delete - deve excluir um usuário sem tarefas', () => {
    cy.get('button.btn-danger').last().click();
    cy.get('mat-dialog-container').should('be.visible');
    cy.get('mat-dialog-actions button[color="warn"]').click();
    cy.contains('Usuário excluído com sucesso').should('be.visible');
  });
}); 