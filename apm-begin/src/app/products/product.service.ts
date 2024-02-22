import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of, switchMap, tap, throwError } from 'rxjs';
import { Product } from './product';
import { ProductData } from './product-data';
import { HttpErrorService } from '../utilities/http-error.service';
import { ReviewService } from '../reviews/review.service';
import { Review } from '../reviews/review';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);
  private errorService = inject(HttpErrorService);
  private reviewService = inject(ReviewService);

  private productsUrl = 'api/products';
  readonly products$ = this.http.get<Product[]>(this.productsUrl)
    .pipe(
      tap(() => console.log('In http get pipeline')),
      catchError((err) => this.handleError(err))
    );

    
  getProduct(id: number): Observable<Product> {
    const productUrl = `${this.productsUrl}/${id}`;
    return this.http.get<Product>(productUrl)
      .pipe(
        tap(() => console.log(`In http.get by id (${id}) in pipeline`)),
        switchMap(product => this.getProductWithReviews(product)),
        tap(x => console.log(x)),
        catchError((err) => this.handleError(err))
      );
  }

  private getProductWithReviews(product: Product): Observable<Product> {
    if (product.hasReviews) {
      return this.http.get<Review[]>(this.reviewService.getReviewUrl(product.id))
        .pipe(
          map((reviews) => ({ ...product, reviews} as Product))
        )
    } else {
      return of(product);
    }
  }

  private handleError(err: HttpErrorResponse): Observable<never> {
    const formattedMessage = this.errorService.formatError(err);
    // return throwError(() => formattedMessage)
    throw formattedMessage;
  }
}
