import { Injectable } from '@angular/core';
import * as alertify from 'alertifyjs';
@Injectable({
  providedIn: 'root'
})
export class AlertifyService {
  constructor() {}

  confirm(message: string, callback: () => any) {
    alertify.confirm(message, (e: any) => {
      if (e) {
        callback();
      }
    });
  }
  success(message: string) {
    alertify.success(message);
  }
  warning(message: string) {
    alertify.warning(message);
  }
  error(message: string) {
    alertify.error(message);
  }
  message(message: string) {
    alertify.message(message);
  }
}
