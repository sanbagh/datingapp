import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  model: any = {};
  @Output() cancelEvent = new EventEmitter();
  constructor(private authService: AuthService) {}

  ngOnInit() {}
  register() {
    this.authService.register(this.model).subscribe(
      next => {
        console.log('Registered successfully');
      },
      error => {
        console.log(error);
      }
    );
  }
  cancel() {
    this.cancelEvent.emit(false);
  }
}
