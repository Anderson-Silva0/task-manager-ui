import { TASK_SELECTORS } from "../constants/task.selectors";
import { TASK_MESSAGES } from "../constants/task.messages";

export const gerarDadosTarefa = (prefixo) => {
    const timestamp = Date.now();
    return {
        titulo: `${prefixo} ${timestamp}`,
        descricao: `Descrição ${prefixo} ${timestamp}`,
    };
};

export const aguardarPaginaTarefasCarregada = () => {
    cy.get(TASK_SELECTORS.spinnerCarregamento).should("not.exist");
};

export const cadastrarTarefaVinculadaAoUsuario = (titulo, descricao, nomeUsuario, emailUsuario) => {
    cy.get(TASK_SELECTORS.btnNovaTarefa).should("be.visible").click();
    cy.get(TASK_SELECTORS.selectUsuario).should("be.visible");
    cy.get(`${TASK_SELECTORS.selectUsuario} option`).should("have.length.greaterThan", 1);
    cy.get(TASK_SELECTORS.inputTitulo).type(titulo);
    cy.get(TASK_SELECTORS.textareaDescricao).type(descricao);
    cy.get(TASK_SELECTORS.selectUsuario).select(`${nomeUsuario} (${emailUsuario})`);
    cy.get(TASK_SELECTORS.btnSubmit).click();
};

export const validarTarefaNosCards = (titulo, descricao) => {
    cy.get(TASK_SELECTORS.cardTitulo).should("contain", titulo);
    cy.get(TASK_SELECTORS.cardDescricao).should("contain", descricao);
};

export const abrirEdicaoDaPrimeiraTarefaNaoConcluida = () => {
    cy.get(TASK_SELECTORS.badgeStatus)
        .not(':contains("Concluído")')
        .first()
        .parents(TASK_SELECTORS.card)
        .within(() => {
            cy.get(TASK_SELECTORS.btnEditarTarefa).click();
        });
};

export const editarTituloETornarConcluida = (novoTitulo) => {
    cy.get(TASK_SELECTORS.inputTitulo).clear().type(novoTitulo);
    cy.get(TASK_SELECTORS.selectStatus).select("CONCLUIDO");
    cy.get(TASK_SELECTORS.btnSubmit).click();
};

export const validarTarefaEditadaComoConcluida = (novoTitulo) => {
    cy.get(TASK_SELECTORS.cardTitulo).should("contain", novoTitulo);
    cy.get(TASK_SELECTORS.badgeConcluido).should("contain", "Concluído");
};

export const tentarEditarTarefaConcluida = () => {
    cy.get(TASK_SELECTORS.badgeStatus)
        .contains("Concluído")
        .first()
        .parents(TASK_SELECTORS.card)
        .within(() => {
            cy.get(TASK_SELECTORS.btnEditarTarefa).click();
        });
};

export const validarBloqueioEdicaoTarefaConcluida = () => {
    cy.contains(TASK_MESSAGES.edicaoTarefaConcluidaBloqueada).should("be.visible");
};

export const excluirPrimeiraTarefa = () => {
    cy.get(TASK_SELECTORS.btnDeletarTarefa).first().click();
    cy.get(TASK_SELECTORS.dialogConfirmacao).should("be.visible");
    cy.get(TASK_SELECTORS.btnConfirmarAcaoPerigosa).click();
};

export const validarExclusaoTarefaComSucesso = () => {
    cy.contains(TASK_MESSAGES.tarefaExcluidaSucesso).should("be.visible");
};