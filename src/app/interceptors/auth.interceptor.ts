import {HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpErrorResponse} from '@angular/common/http';
import {Observable, catchError, throwError} from 'rxjs';
import {inject} from '@angular/core';
import {Router} from '@angular/router';
import {UserService} from '../services/user.service';

// Define the interceptor as a function instead of a class
export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  // Functional interceptors do not need @Injectable()
  const router = inject(Router);
  const userService = inject(UserService);

  const token = localStorage.getItem('crypt-token');

  // Check if the token exists
  if (token) {
    // Clone the request to add the new header.
    const clonedReq = req.clone({
      headers: req.headers.set('Authorization', 'Bearer ' + token)
    });
    return next(clonedReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          localStorage.removeItem('crypt-token');
          userService.markUnAuthenticated();
          router.navigate(['/login']);
        } else if (error.status === 403) {
          router.navigate(['/forbidden']);
        }
        return throwError(() => error);
      })
    );
  }

  // If no token, pass the original request along
  return next(req);
};
