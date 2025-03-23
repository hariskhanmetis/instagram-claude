import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isSubmitting: boolean = false;
  hidePassword: boolean = true;

  // Backend API URL (update after deployment)
  private apiUrl = '/login'; // Relative path to backend

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isSubmitting = true;
      const formData = this.loginForm.value;

      this.http.post(this.apiUrl, formData).subscribe({
        next: (response) => {
          console.log('Data saved:', response);
          this.isSubmitting = false;
          this.router.navigate(['/survey']);
        },
        error: (error) => {
          console.error('Error:', error);
          this.isSubmitting = false;
        }
      });
    }
  }
}