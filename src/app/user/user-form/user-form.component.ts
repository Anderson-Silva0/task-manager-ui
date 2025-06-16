import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserRequest, UserResponse } from '../../models/user.model';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {
  userForm: FormGroup;
  isEditMode: boolean = false;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<UserFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UserResponse
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

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.userForm.valid) {
      const userData: UserRequest = {
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