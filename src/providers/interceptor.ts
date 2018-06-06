import {HttpClient, HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';

@Injectable()
export class InterceptorProvider implements HttpInterceptor {

    constructor(public http: HttpClient) { }

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        if (localStorage.getItem('token') !== null) {
            req = req.clone({
                setHeaders: {
                    Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`
                }
            });
        }
        return next.handle(req)
           .catch(err => {
                if (err instanceof  HttpErrorResponse) {
                    if (err.status === 401) {
                        localStorage.removeItem('token');
                    }
                }
                return  next.handle(req);
            });

    }
}
