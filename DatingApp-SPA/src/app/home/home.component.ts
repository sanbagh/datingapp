import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  registerToggle = false;
  constructor() {}

  ngOnInit() {}
  registerButtonToggle() {
    this.registerToggle = !this.registerToggle;
  }
  cancelEventHandler($event: boolean) {
    this.registerToggle = $event;
  }
}
