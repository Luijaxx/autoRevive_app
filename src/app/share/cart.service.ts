import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
// Definir clase con las propiedades que es necesario que gestione el carrito
export class ItemCart {
  idItem: number;
  idService: number;
  product: any;
  service: any;
  quantity: number;
  price : number;
  subtotal: number;
  total: number;

}
@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cart = new BehaviorSubject<ItemCart[]>(null);
  public currentCart$ = this.cart.asObservable();
  public qtyItems = new Subject<number>();
  public totalCart = new Subject<number>();

  constructor() {
    this.cart= new BehaviorSubject<any>(
      JSON.parse(localStorage.getItem('cart')));   
      this.currentCart$ = this.cart.asObservable();
  }
  saveCart(): void {
    localStorage.setItem('cart', JSON.stringify(this.cart.value));
  }

  addToCart(product: any, service: any){
    const newItem = new ItemCart();
    newItem.idItem = product.idItem | product.id;
    newItem.idService = service.idService | service.id;
    newItem.price = service.price | product.price;
    newItem.quantity = 1;
    newItem.subtotal = newItem.price * newItem.quantity;
    newItem.product = product;
    newItem.service = service;
    newItem.total = this.calculateTotal();
    let listCart = this.cart.getValue();
    if(listCart){
      let objIndex = listCart.findIndex((obj => obj.idItem == newItem.idItem || obj.idService == newItem.idService));
      if(objIndex != -1){
        if(product.hasOwnProperty('quantity') || service.hasOwnProperty('quantity')){
          if(product.quantity <= 0  || service.quantity <= 0){
            this.removeFromCart(newItem);
            return;           
          } else {
            listCart[objIndex].quantity = product.quantity | service.quantity;
          }
        } else {
          listCart[objIndex].quantity += 1;
        }
        newItem.quantity = listCart[objIndex].quantity;
        listCart[objIndex].subtotal = newItem.price * newItem.quantity;
      } else {
        listCart.push(newItem);
      }
    } else {
      listCart = [];
      listCart.push(newItem);
    }
    this.cart.next(listCart);
    this.qtyItems.next(this.quantityItems());
    this.totalCart.next(this.calculateTotal());
    this.saveCart();
  }

  public calculateTotal(): number{
    let totalCalc = 0;
    let listCart = this.cart.getValue();
    if(listCart != null){
      listCart.forEach((item: ItemCart) => {
        totalCalc += item.subtotal;
      });
    }
    return totalCalc;
  }

  public removeFromCart(newData: ItemCart){
    let listCart = this.cart.getValue();
    if(listCart){
      let objIndex = listCart.findIndex((obj => obj.idItem == newData.idItem || obj.idService == newData.idService));
      if(objIndex != -1){
        listCart.splice(objIndex, 1);
        this.cart.next(listCart);
        this.qtyItems.next(this.quantityItems());
        this.totalCart.next(this.calculateTotal());
        this.saveCart();
      }
    }
  }

  get countItems(): Observable<number>{
    this.qtyItems.next(this.quantityItems());
    return this.qtyItems.asObservable();
  }

  quantityItems(){
    let listCart = this.cart.getValue();
    let sum = 0;
    if(listCart != null){
      listCart.forEach((item: ItemCart) => {
        sum += item.quantity;
      });
    }
    return sum;
  }


  public deleteCart(){
    this.cart.next(null);
    this.qtyItems.next(0);
    this.totalCart.next(0);
    this.saveCart();
  }
}
