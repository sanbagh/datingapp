import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
  HTTP_INTERCEPTORS
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError(errorReponse => {
        if (errorReponse.status === 401) {
          return throwError(errorReponse.statusText);
        }
        if (errorReponse instanceof HttpErrorResponse) {
          const applicationError = errorReponse.headers.get(
            'Application-Error'
          );
          if (applicationError) {
            return throwError(applicationError);
          }
        }
        const serverErrors = errorReponse.error;
        let modelStateErrors = '';
        if (serverErrors && typeof serverErrors.errors === 'object') {
          for (const key in serverErrors.errors) {
            if (serverErrors.errors[key]) {
              modelStateErrors += serverErrors.errors[key] + '\n';
            }
          }
        }
        console.log(errorReponse);
        return throwError(modelStateErrors || serverErrors || 'Server Error');
      })
    );
  }
}
export const ErrorInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: ErrorInterceptor,
  multi: true
};
