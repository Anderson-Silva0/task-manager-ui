import { ROTAS } from "../support/constants/routes";
import { TASK_SELECTORS } from "../support/constants/task.selectors";
import {
  gerarDadosUsuario,
  cadastrarUsuario,
  validarUsuarioNaTabela,
} from "../support/actions/user.actions";
import {
  gerarDadosTarefa,
  aguardarPaginaTarefasCarregada,
  cadastrarTarefaVinculadaAoUsuario,
  validarTarefaNosCards,
  abrirEdicaoDaPrimeiraTarefaNaoConcluida,
  editarTituloETornarConcluida,
  validarTarefaEditadaComoConcluida,
  tentarEditarTarefaConcluida,
  validarBloqueioEdicaoTarefaConcluida,
  excluirPrimeiraTarefa,
  validarExclusaoTarefaComSucesso,
} from "../support/actions/task.actions";

describe("CRUD de Tarefas", () => {
  let nomeUsuario;
  let emailUsuario;

  beforeEach(() => {
    const { nome, email } = gerarDadosUsuario("Usuário Teste", "usuario");
    nomeUsuario = nome;
    emailUsuario = email;

    cy.visit(ROTAS.usuarios);
    cadastrarUsuario(nomeUsuario, emailUsuario);
    validarUsuarioNaTabela(nomeUsuario);

    cy.visit(ROTAS.tarefas);
    aguardarPaginaTarefasCarregada();
  });

  it("deve cadastrar uma nova tarefa", () => {
    const { titulo, descricao } = gerarDadosTarefa("Tarefa Teste");

    cadastrarTarefaVinculadaAoUsuario(titulo, descricao, nomeUsuario, emailUsuario);
    validarTarefaNosCards(titulo, descricao);
  });

  it("deve listar as tarefas cadastradas", () => {
    cy.get(TASK_SELECTORS.card).should("be.visible");
    cy.get(TASK_SELECTORS.card).should("have.length.greaterThan", 0);
  });

  it("deve editar uma tarefa existente e marcar como concluída", () => {
    const { titulo: novoTitulo } = gerarDadosTarefa("Título Editado");

    abrirEdicaoDaPrimeiraTarefaNaoConcluida();
    editarTituloETornarConcluida(novoTitulo);
    validarTarefaEditadaComoConcluida(novoTitulo);
  });

  it("não deve permitir edição de tarefa com status concluído", () => {
    tentarEditarTarefaConcluida();
    validarBloqueioEdicaoTarefaConcluida();
  });

  it("deve excluir uma tarefa", () => {
    excluirPrimeiraTarefa();
    validarExclusaoTarefaComSucesso();
  });
});