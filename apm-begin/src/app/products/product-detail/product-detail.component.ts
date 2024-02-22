import { Component, Input, OnChanges, OnDestroy, SimpleChanges, inject } from '@angular/core';

import { NgIf, NgFor, CurrencyPipe } from '@angular/common';
import { Product } from '../product';
import { ProductService } from '../product.service';
import { EMPTY, Subscription, catchError, tap } from 'rxjs';

@Component({
    selector: 'pm-product-detail',
    templateUrl: './product-detail.component.html',
    standalone: true,
    imports: [NgIf, NgFor, CurrencyPipe]
})
export class ProductDetailComponent implements OnChanges, OnDestroy {
  private productService = inject(ProductService);
  sub!: Subscription;
  
  @Input() productId: number = 0;
  errorMessage = '';
  
  // Product to display
  product: Product | null = null;
  
  // Set the page title
  pageTitle = this.product ? `Product Detail for: ${this.product.productName}` : 'Product Detail';
  
  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    const id = changes['productId'].currentValue;
    if (id) {
      this.sub = this.productService.getProduct(id)
        .pipe(
          tap((product) => console.log('product', product)),
          catchError((err) => {
            this.errorMessage = err;
            return EMPTY;
          }),
        ).subscribe((p) => {
          this.product = p;
        });
      }
    }
    
  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  addToCart(product: Product) {
  }
}
