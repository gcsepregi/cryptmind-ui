import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

// Define the interceptor as a function instead of a class
export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  // Functional interceptors do not need @Injectable()

  const token = localStorage.getItem('crypt-token');

  // Check if the token exists
  if (token) {
    // Clone the request to add the new header.
    const clonedReq = req.clone({
      headers: req.headers.set('Authorization', 'Bearer ' + token)
    });
    console.log('Request intercepted, token added:', clonedReq);
    return next(clonedReq);
  }

  // If no token, pass the original request along
  console.log('Request intercepted, no token found.');
  return next(req);
};
