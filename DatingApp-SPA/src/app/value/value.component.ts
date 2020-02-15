import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-value',
  templateUrl: './value.component.html',
  styleUrls: ['./value.component.css']
})
export class ValueComponent implements OnInit {
  constructor(private httpService: HttpClient) {}
  values: any;
  ngOnInit() {
    this.getValues();
  }
  getValues() {
    this.httpService.get('http://localhost:5000/api/values').subscribe(
      response => (this.values = response),
      error => {
        console.log('error');
      }
    );
  }
}
