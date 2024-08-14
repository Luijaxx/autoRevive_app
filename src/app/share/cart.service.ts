import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
// Definir clase con las propiedades que es necesario que gestione el carrito
export class ItemCart {
  idItem: number;
  idItemService: number;
  name: string;
  product: any;
  service: any;
  quantity: number;
  price: number;
  subtotal: number;
  total: number;
  id: number;
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
    this.cart = new BehaviorSubject<any>(
      JSON.parse(localStorage.getItem('cart'))
    );
    this.currentCart$ = this.cart.asObservable();
  }
  saveCart(): void {
    localStorage.setItem('cart', JSON.stringify(this.cart.value));
  }

  deleteItem(item: any) {
    let listCart = this.cart.getValue();
    let objIndex = -1;

    if (item.hasOwnProperty('idItem')) {
      objIndex = listCart.findIndex(
        (obj) => obj.idItem === item.idItem && obj.hasOwnProperty('idItem')
      );
    } else if (item.hasOwnProperty('idItemService')) {
      objIndex = listCart.findIndex(
        (obj) =>
          obj.idItemService === item.idItemService &&
          obj.hasOwnProperty('idItemService')
      );
    }
    listCart[objIndex].quantity -= 1;
    this.cart.next(listCart);
    this.qtyItems.next(this.quantityItems());
    this.totalCart.next(this.calculateNetTotal());
    listCart[objIndex].subtotal = item.price * item.quantity;

    this.saveCart();
  }

  addToCart(item: any) {
    const newItem = new ItemCart();
    if (item.hasOwnProperty('category')) {
      newItem.idItem = item.id;
      newItem.name = item.name;
      newItem.price = item.price;
      newItem.quantity = 1;
      newItem.subtotal = newItem.price * newItem.quantity;
      newItem.product = item;
    } else {
      newItem.idItemService = item.id;
      newItem.name = item.name;
      newItem.price = item.priceRate;
      newItem.quantity = 1;
      newItem.subtotal = newItem.price * newItem.quantity;
      newItem.service = item;
    }

    newItem.total = this.calculateTotal();
    let listCart = this.cart.getValue();
    if (listCart) {
      let objIndex = -1;

      if (newItem.hasOwnProperty('idItem')) {
        objIndex = listCart.findIndex(
          (obj) => obj.idItem === newItem.idItem && obj.hasOwnProperty('idItem')
        );
      } else if (newItem.hasOwnProperty('idItemService')) {
        objIndex = listCart.findIndex(
          (obj) =>
            obj.idItemService === newItem.idItemService &&
            obj.hasOwnProperty('idItemService')
        );
      }
      if (objIndex != -1) {
        if (item.hasOwnProperty('quantity')) {
          if (item.quantity <= 0) {
            this.removeFromCart(newItem);
            return;
          } else {
            listCart[objIndex].quantity = item.quantity;
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
    this.totalCart.next(this.calculateNetTotal());
    this.saveCart();
  }

  public calculateTotal(): number {
    let totalCalc = 0;
    let listCart = this.cart.getValue();
    if (listCart != null) {
      listCart.forEach((item: ItemCart) => {
        totalCalc += item.subtotal;
      });
    }
    return totalCalc;
  }

  public calculateTotalTax(): number {
    let totalCalc = 0;
    let listCart = this.cart.getValue();
    if (listCart != null) {
      listCart.forEach((item: ItemCart) => {
        totalCalc += item.subtotal * 0.13;
      });
    }
    return totalCalc;
  }

  public calculateNetTotal(): number {
    let totalCalc = 0;

    totalCalc = this.calculateTotal() + this.calculateTotalTax();

    return totalCalc;
  }

  public removeFromCart(newData: ItemCart) {
    let listCart = this.cart.getValue();
    let objIndex = -1;
    if (listCart) {
      if (newData.hasOwnProperty('idItem')) {
        objIndex = listCart.findIndex(
          (obj) => obj.idItem === newData.idItem && obj.hasOwnProperty('idItem')
        );
      } else if (newData.hasOwnProperty('idItemService')) {
        objIndex = listCart.findIndex(
          (obj) =>
            obj.idItemService === newData.idItemService &&
            obj.hasOwnProperty('idItemService')
        );
      }
      if (objIndex != -1) {
        listCart.splice(objIndex, 1);
        this.cart.next(listCart);
        this.qtyItems.next(this.quantityItems());
        this.totalCart.next(this.calculateNetTotal());
        this.saveCart();
      }
    }
  }

  get countItems(): Observable<number> {
    this.qtyItems.next(this.quantityItems());
    return this.qtyItems.asObservable();
  }

  quantityItems() {
    let listCart = this.cart.getValue();
    let sum = 0;
    if (listCart != null) {
      listCart.forEach((item: ItemCart) => {
        sum += item.quantity;
      });
    }
    return sum;
  }

  get getItems() {
    return this.cart.getValue();
  }

  public deleteCart() {
    this.cart.next(null);
    this.qtyItems.next(0);
    this.totalCart.next(0);
    this.saveCart();
  }

  public loadCart(items: any) {
    this.cart.next(null);
    let newCart = [];
    let invoiceId = (items.id) ? items.id : items.invoiceDetails[0].id;
    items.invoiceDetails.forEach((item) => {
      const newItem = new ItemCart();
      if (item.product !== null) {
        newItem.id = invoiceId;
        newItem.idItem = item.product.id;
        newItem.name = item.product.name;
        newItem.price = item.product.price;
        newItem.quantity = item.quantity;
        newItem.subtotal = newItem.price * newItem.quantity;
        newItem.product = item.product;
      } else {
        newItem.id = invoiceId;
        newItem.idItemService = item.service.id;
        newItem.name = item.service.name;
        newItem.price = item.service.priceRate;
        newItem.quantity = item.quantity;
        newItem.subtotal = newItem.price * newItem.quantity;
        newItem.service = item.service;
      }
      newCart.push(newItem);
    });
    this.cart.next(newCart);
    this.qtyItems.next(this.quantityItems());
    this.totalCart.next(this.calculateNetTotal());
    this.saveCart();
  }

  autoDelete(item: any){
      if(item.quantity <= 0 ){
        this.removeFromCart(item)
      }
  }
}
