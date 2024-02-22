import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, of, tap, throwError } from 'rxjs';
import { Product } from './product';
import { ProductData } from './product-data';
import { HttpErrorService } from '../utilities/http-error.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);
  private errorService = inject(HttpErrorService);

  private productsUrl = 'api/products';

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.productsUrl)
    .pipe(
      tap(() => console.log('In http get pipeline')),
      catchError((err) => this.handleError(err))
    );
  }

  getProduct(id: number): Observable<Product> {
    const productUrl = `${this.productsUrl}/${id}`;
    return this.http.get<Product>(productUrl)
      .pipe(
        tap(() => console.log(`In http.get by id (${id}) in pipeline`)),
        catchError((err) => this.handleError(err))
      );
  }

  private handleError(err: HttpErrorResponse): Observable<never> {
    const formattedMessage = this.errorService.formatError(err);
    // return throwError(() => formattedMessage)
    throw formattedMessage;
  }
}
