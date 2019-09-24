import { Injectable } from '@angular/core';
import { AuthService } from './auth.service'
import { HttpClient } from '@angular/common/http'
import { environment } from '../../../environments/environment';
import { Product } from '../models/product.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private baseURL = environment.apiUrl + 'cart';

  constructor(
    private authService: AuthService,
    private http: HttpClient
  ) { }


  getCartItems(): Observable<Product[]>{
    let headers = this.authService.setHeaders();
    return this.http.get<Product[]>(`${this.baseURL}/products`, {headers: headers })
      .pipe(map( data => {

        data['items'].map( d => {
          d.imgUrl = d.images.url+"-500-auto?width=500&height=auto&aspect=true";
          delete d.images;
          delete d.description;
          delete d.created_at;
          delete d.updated_at;
        })
        
        return data['items'];
      }));
  }

  removeCartItem(idProduct){
    let headers = this.authService.setHeaders();
    return this.http.delete(`${this.baseURL}/remove/${idProduct}`, {headers: headers })
  }

  addItemToCart(idProduct, quantityPurchase){
    let headers = this.authService.setHeaders();
    return this.http.post(`${this.baseURL}/add/${idProduct}`, {"quantityPurchase": quantityPurchase}, {headers: headers })
  }

  modifyQuantityPurchaseItem(idProduct, quantityPurchase){
    let headers = this.authService.setHeaders();
    return this.http.put(`${this.baseURL}/quantity/${idProduct}`, {"quantityPurchase": quantityPurchase}, {headers: headers })
  }

}
