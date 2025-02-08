import { Component } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-user-name-dialog',
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule
  ],
  template: `
    <h2 mat-dialog-title>Bienvenido al Chat</h2>
    <mat-dialog-content>
      <p>Por favor, ingresa tu nombre para continuar:</p>
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Nombre</mat-label>
        <input matInput [(ngModel)]="userName" required>
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-raised-button color="primary" 
              [disabled]="!userName.trim()"
              (click)="onSubmit()">
        Continuar
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .full-width {
      width: 100%;
    }
  `]
})
export class UserNameDialogComponent {
  userName = '';

  constructor(private dialogRef: MatDialogRef<UserNameDialogComponent>) {}

  onSubmit(): void {
    if (this.userName.trim()) {
      this.dialogRef.close(this.userName);
    }
  }
}