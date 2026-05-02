import { ROTAS } from "../support/constants/routes";
import { USER_SELECTORS } from "../support/constants/user.selectors";
import {
  gerarDadosUsuario,
  cadastrarUsuario,
  validarUsuarioNaTabela,
  editarPrimeiroUsuarioDaTabela,
  deletarUsuarioPorNome,
  confirmarAcaoNoDialog,
  validarMensagemEmailDuplicado,
  validarBloqueioExclusaoUsuarioComTarefas,
} from "../support/actions/user.actions";
import { cadastrarTarefaVinculadaAoUsuario } from "../support/actions/task.actions";

describe("CRUD de Usuários", () => {
  let emailCriado;
  let nomeUsuario;

  beforeEach(() => {
    cy.visit(ROTAS.usuarios);
  });

  it("deve cadastrar um novo usuário", () => {
    const { nome, email } = gerarDadosUsuario("Usuário Teste", "usuario");
    nomeUsuario = nome;
    emailCriado = email;

    cadastrarUsuario(nomeUsuario, emailCriado);
    validarUsuarioNaTabela(nomeUsuario, emailCriado);
  });

  it("deve listar os usuários cadastrados", () => {
    cy.get(USER_SELECTORS.tabelaUsuarios).should("be.visible");
    cy.get(USER_SELECTORS.tabelaUsuarios).find("tr").should("have.length.greaterThan", 1);
  });

  it("deve editar um usuário existente", () => {
    const { nome: nomeEditado } = gerarDadosUsuario("Nome Editado", "editado");

    editarPrimeiroUsuarioDaTabela(nomeEditado);
    cy.get(USER_SELECTORS.tabelaUsuarios).should("contain", nomeEditado);
  });

  it("não deve permitir cadastro de usuário com email duplicado", () => {
    cadastrarUsuario("Usuário Duplicado", emailCriado);
    validarMensagemEmailDuplicado();
  });

  it("deve excluir um usuário sem tarefas", () => {
    const { nome, email } = gerarDadosUsuario("Delete Test", "delete");

    cadastrarUsuario(nome, email);
    cy.contains(USER_SELECTORS.tabelaUsuarios, nome).should("exist");

    cy.contains(nome)
      .parent()
      .find(USER_SELECTORS.btnDeletarUsuario)
      .click();

    confirmarAcaoNoDialog();

    cy.contains(USER_SELECTORS.tabelaUsuarios, nome).should("not.exist");
  });

  it("não deve permitir exclusão de usuário com tarefas cadastradas", () => {
    const { nome: nomeUsuarioComTarefa, email: emailUsuarioComTarefa } =
      gerarDadosUsuario("Usuário Com Tarefa", "comtarefa");
    const { titulo, descricao } = { titulo: `Tarefa Teste ${Date.now()}`, descricao: `Descrição ${Date.now()}` };

    cy.visit(ROTAS.usuarios);
    cadastrarUsuario(nomeUsuarioComTarefa, emailUsuarioComTarefa);
    validarUsuarioNaTabela(nomeUsuarioComTarefa);

    cy.visit(ROTAS.tarefas);
    cadastrarTarefaVinculadaAoUsuario(titulo, descricao, nomeUsuarioComTarefa, emailUsuarioComTarefa);

    cy.visit(ROTAS.usuarios);
    cy.contains(nomeUsuarioComTarefa).parent().find(USER_SELECTORS.btnDeletarUsuario).click();
    confirmarAcaoNoDialog();
    validarBloqueioExclusaoUsuarioComTarefas();
  });
});