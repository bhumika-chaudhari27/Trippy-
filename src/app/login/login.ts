import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.html',
  styleUrls: ['./login.css'], // ✅ Make sure this is correct
  imports: [CommonModule, FormsModule, RouterModule]
})

export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  isRecoveryMode: boolean = false; // NEW

  recoveryEmail: string = '';
  recoveryMessage: string = '';
  recoveredPassword: string = '';

  constructor(private router: Router) {}

  login() {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u: any) => u.email === this.email && u.password === this.password);

    if (user) {
      this.successMessage = 'Login successful!';
      this.errorMessage = '';
      localStorage.setItem('isLoggedIn', 'true');
      setTimeout(() => {
        this.router.navigate(['/home']);
      }, 1500);
    } else {
      this.errorMessage = 'Invalid email or password';
      this.successMessage = '';
    }
  }

  toggleRecovery() {
    this.isRecoveryMode = !this.isRecoveryMode;
    this.errorMessage = '';
    this.successMessage = '';
    this.recoveryMessage = '';
    this.recoveredPassword = '';
    this.recoveryEmail = '';
  }

  recoverPassword() {
    if (!this.recoveryEmail.trim()) {
      this.recoveryMessage = 'Please enter your email.';
      return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u: any) => u.email === this.recoveryEmail.trim());

    if (user) {
      this.recoveredPassword = user.password;
      this.recoveryMessage = '';
    } else {
      this.recoveredPassword = '';
      this.recoveryMessage = 'Email not found. Please sign up first.';
    }
  }
}
