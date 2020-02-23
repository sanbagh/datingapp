import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/_models/User';
import { AuthService } from 'src/app/_services/auth.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css']
})
export class MemberCardComponent implements OnInit {
  @Input() user: User;

  constructor(
    private authService: AuthService,
    private alertifyService: AlertifyService,
    private userService: UserService
  ) {}

  ngOnInit() {}
  sendLike(recipientId: number) {
    this.userService
      .sendLike(this.authService.decodedToken.nameid, recipientId)
      .subscribe(
        next => this.alertifyService.success('You liked ' + this.user.knownAs),
        err => this.alertifyService.error(err)
      );
  }
}
