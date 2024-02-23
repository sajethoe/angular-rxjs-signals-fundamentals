import { Injectable, computed, effect, signal } from "@angular/core";
import { CartItem } from "./cart";
import { Product } from "../products/product";
import { filter } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cartItems = signal<CartItem[]>([]);

  cartCount = computed(() => this.cartItems()
    .reduce((accQty, item) => accQty + item.quantity, 0)
  );

  subTotal = computed(() => this.cartItems()
    .reduce((accQty, item) => accQty + (item.quantity * item.product.price), 0));
  
  deliveryFee = computed<number>(() => this.subTotal() < 50 ? 5.99 : 0);
  tax = computed<number>(() => Math.round(this.subTotal() * 10.75) / 100);

  totalPrice = computed<number>(() => this.subTotal() + this.deliveryFee() + this.tax());

  eLength = effect(() => console.log('Cart array length:', this.cartItems().length));
  addToCart(product: Product): void {
    // read the cartitem array from the signal
    this.cartItems.update(items => [...items, { product, quantity: 1}]);
  }

  updateQuantity(cartItem: CartItem, quantity: number): void {
    this.cartItems.update(items => 
      items.map(item => item.product.id === cartItem.product.id ? 
        { ...item, quantity} : item))
  }

  removeFromCart(cartItem: CartItem): void {
    this.cartItems.update(items => 
      items.filter(item => item.product.id !== cartItem.product.id)
    )
  }
}
