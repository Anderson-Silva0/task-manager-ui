import { Component, Inject } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { User } from '../../models/user.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ]
})
export class UserFormComponent {
  userForm: UntypedFormGroup;
  isEditMode: boolean = false;

  constructor(
    private fb: UntypedFormBuilder,
    public dialogRef: MatDialogRef<UserFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User
  ) {
    this.isEditMode = !!data?.id;
    this.userForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]]
    });

    if (this.isEditMode) {
      this.userForm.patchValue({
        name: data.name,
        email: data.email
      });
    }
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const userData: User = {
        name: this.userForm.value.name,
        email: this.userForm.value.email
      };
      this.dialogRef.close(userData);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  getErrorMessage(field: string): string {
    if (this.userForm.get(field)?.hasError('required')) {
      return 'Campo obrigatório';
    }
    if (field === 'email' && this.userForm.get(field)?.hasError('email')) {
      return 'Email inválido';
    }
    return '';
  }
} 