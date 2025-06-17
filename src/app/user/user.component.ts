import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { User, UserRequest, UserResponse } from '../models/user.model';
import { UserService } from '../services/user.service';
import { UserFormComponent } from './user-form/user-form.component';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  dataSource = new MatTableDataSource<UserResponse>([]);
  error: boolean = false;
  loading: boolean = false;
  displayedColumns: string[] = ['name', 'email', 'createdAt', 'actions'];
  titulo: string = 'Gerenciamento de Usuários';

  constructor(
    private userService: UserService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  private showErrorMessage(error: any, defaultMessage: string): void {
    console.error(defaultMessage, error);
    let errorMessage = defaultMessage;
    
    if (error.error?.messages && error.error.messages.length > 0) {
      errorMessage = error.error.messages[0];
    }
    
    this.snackBar.open(errorMessage, 'Fechar', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['error-snackbar']
    });
  }

  private showSuccessMessage(message: string): void {
    this.snackBar.open(message, 'Fechar', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }

  loadUsers(): void {
    this.loading = true;
    this.error = false;
    
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.dataSource.data = users;
        this.error = false;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Erro ao carregar usuários:', error);
        this.error = true;
        this.dataSource.data = [];
        this.showErrorMessage(error, 'Erro ao carregar usuários');
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  openUserForm(user?: UserResponse): void {
    const dialogRef = this.dialog.open(UserFormComponent, {
      width: '400px',
      data: user || {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;

        const request$ = user 
          ? this.userService.updateUser(user.id, result)
          : this.userService.createUser(result);

        request$.subscribe({
          next: () => {
            this.loadUsers();
            this.showSuccessMessage(
              user ? 'Usuário atualizado com sucesso!' : 'Usuário criado com sucesso!'
            );
          },
          error: (error) => {
            this.loading = false;
            this.showErrorMessage(
              error,
              user ? 'Erro ao atualizar usuário' : 'Erro ao criar usuário'
            );
            this.cdr.detectChanges();
          }
        });
      }
    });
  }

  confirmDelete(user: UserResponse): void {
    if (confirm(`Tem certeza que deseja excluir o usuário ${user.name}?`)) {
      this.loading = true;

      this.userService.deleteUser(user.id).subscribe({
        next: () => {
          this.showSuccessMessage('Usuário excluído com sucesso!');
          this.loadUsers();
        },
        error: (error) => {
          this.loading = false;
          this.showErrorMessage(error, 'Erro ao excluir usuário');
          this.cdr.detectChanges();
        }
      });
    }
  }
} 