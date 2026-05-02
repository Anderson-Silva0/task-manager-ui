import { ComponentFixture, TestBed } from "@angular/core/testing";
import { UserFormComponent } from "./user-form.component";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { User } from "../../models/user.model";

type SetupReturn = {
    fixture: ComponentFixture<UserFormComponent>;
    component: UserFormComponent;
    html: HTMLElement;
    dialogRefMock: jest.Mocked<Pick<MatDialogRef<UserFormComponent>, 'close'>>;
};

describe('UserFormComponent', () => {

    function setup(data: Partial<User> = {}): SetupReturn {
        const dialogRefMock: SetupReturn['dialogRefMock'] = {
            close: jest.fn()
        };

        TestBed.configureTestingModule({
            imports: [UserFormComponent],
            providers: [
                { provide: MatDialogRef, useValue: dialogRefMock },
                { provide: MAT_DIALOG_DATA, useValue: data }
            ]
        });

        const fixture = TestBed.createComponent(UserFormComponent);
        const component = fixture.componentInstance;

        fixture.detectChanges();

        const html = fixture.nativeElement as HTMLElement;

        return { fixture, component, html, dialogRefMock };
    }

    it('deve criar o componente', () => {
        const { component } = setup();
        expect(component).toBeTruthy();
    });

    it('deve renderizar título "Novo Usuário" quando for criação', () => {
        const { html } = setup({});

        const h2 = html.querySelector('h2')!;
        expect(h2.textContent).toContain('Novo Usuário');
    });

    it('deve renderizar título "Editar Usuário" quando for edição', () => {
        const { html } = setup({ id: 1 });

        const h2 = html.querySelector('h2')!;
        expect(h2.textContent).toContain('Editar Usuário');
    });

    it('deve chamar close com os dados do formulário ao submeter', () => {
        const { component, dialogRefMock } = setup();

        component.userForm.setValue({
            name: 'Anderson',
            email: 'teste@email.com'
        });

        component.onSubmit();

        expect(dialogRefMock.close).toHaveBeenCalledWith({
            name: 'Anderson',
            email: 'teste@email.com'
        });
    });

    it('', () => {
        
    })
});