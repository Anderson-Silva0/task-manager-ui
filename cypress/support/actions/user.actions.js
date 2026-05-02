import { USER_SELECTORS } from "../constants/user.selectors";
import { USER_MESSAGES } from "../constants/user.messages";

export const gerarDadosUsuario = (prefixoNome, prefixoEmail) => {
    const timestamp = Date.now();
    return {
        nome: `${prefixoNome} ${timestamp}`,
        email: `${prefixoEmail}${timestamp}@teste.com`,
    };
};

const abrirFormularioCadastroUsuario = () => {
    cy.get(USER_SELECTORS.btnNovoUsuario).should("be.visible").click();
};

const preencherFormularioUsuario = (nome, email) => {
    cy.get(USER_SELECTORS.inputNome).type(nome);
    cy.get(USER_SELECTORS.inputEmail).type(email);
};

const submeterFormulario = () => {
    cy.get(USER_SELECTORS.btnSubmit).click();
};

export const cadastrarUsuario = (nome, email) => {
    abrirFormularioCadastroUsuario();
    preencherFormularioUsuario(nome, email);
    submeterFormulario();
};

export const validarUsuarioNaTabela = (nome, email) => {
    cy.get(USER_SELECTORS.tabelaUsuarios).should("contain", nome);
    if (email) cy.get(USER_SELECTORS.tabelaUsuarios).should("contain", email);
};

export const editarPrimeiroUsuarioDaTabela = (novoNome) => {
    cy.get(USER_SELECTORS.btnEditarUsuario).first().click();
    cy.get(USER_SELECTORS.inputNome).clear().type(novoNome);
    submeterFormulario();
};

export const deletarUsuarioPorNome = (nome) => {
    cy.contains("tr", nome).find(USER_SELECTORS.btnDeletarUsuario).click();
};

export const confirmarAcaoNoDialog = () => {
    cy.get(USER_SELECTORS.dialogConfirmacao).should("be.visible");
    cy.get(USER_SELECTORS.btnConfirmarAcaoPerigosa).click();
};

export const validarMensagemEmailDuplicado = () => {
    cy.contains(USER_MESSAGES.emailDuplicado).should("be.visible");
};

export const validarBloqueioExclusaoUsuarioComTarefas = () => {
    cy.contains(USER_MESSAGES.usuarioPossuiTarefas).should("be.visible");
};