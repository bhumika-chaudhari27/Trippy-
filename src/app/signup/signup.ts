import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterModule],
  templateUrl: './signup.html',
  styleUrls: ['./signup.css']
})
export class SignupComponent {
  name: string = '';
  email: string = '';
  password: string = '';
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private router: Router) {}

  signup() {
    if (!this.name || !this.email || this.password.length < 6) {
      this.errorMessage = 'Please fill all fields correctly.';
      this.successMessage = '';
      return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userExists = users.find((u: any) => u.email === this.email);
    if (userExists) {
      this.errorMessage = 'Email already registered.';
      this.successMessage = '';
      return;
    }

    users.push({ name: this.name, email: this.email, password: this.password });
    localStorage.setItem('users', JSON.stringify(users));
    this.successMessage = 'Account created! Redirecting...';
    this.errorMessage = '';

    setTimeout(() => this.router.navigate(['/login']), 1500);
  }
}
