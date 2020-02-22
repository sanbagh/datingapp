import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder
} from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { User } from '../_models/User';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  user: User;
  registerForm: FormGroup;
  bsConfig: Partial<BsDatepickerConfig>;
  @Output() cancelEvent = new EventEmitter();
  constructor(
    private authService: AuthService,
    private alertifyService: AlertifyService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.bsConfig = {
      containerClass: 'theme-red'
    };
    this.createRegisterForm();
  }
  createRegisterForm() {
    this.registerForm = this.fb.group(
      {
        gender: ['male'],
        username: ['', Validators.required],
        knownAs: ['', Validators.required],
        dateOfBirth: [null, Validators.required],
        city: ['', Validators.required],
        country: ['', Validators.required],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(4),
            Validators.maxLength(8)
          ]
        ],
        confirmPassword: ['', Validators.required]
      },
      { validators: this.passwordMatchValidator }
    );
  }
  passwordMatchValidator(fg: FormGroup) {
    return fg.get('password').value === fg.get('confirmPassword').value
      ? null
      : { mismatch: true };
  }
  checkErrors(controlName: string): boolean {
    return (
      this.registerForm.get(controlName).errors &&
      this.registerForm.get(controlName).touched
    );
  }
  checkSpecificError(
    controlName: string,
    errorName: string,
    level: string = 'control'
  ): boolean {
    if (level === 'form') {
      return (
        this.registerForm.hasError(errorName) &&
        this.registerForm.get(controlName).touched
      );
    }

    return (
      this.registerForm.get(controlName).hasError(errorName) &&
      this.registerForm.get(controlName).touched
    );
  }
  register() {
    if (this.registerForm.valid) {
      this.user = Object.assign({}, this.registerForm.value);
      this.authService.register(this.user).subscribe(
        next => {
          this.alertifyService.success('successfully registerd');
        },
        error => {
          this.alertifyService.error(error);
        }, () => {
          this.authService.login(this.user).subscribe( () => {
            this.router.navigate(['/members']);
          });
        });
    }
  }
  cancel() {
    this.cancelEvent.emit(false);
  }
}
