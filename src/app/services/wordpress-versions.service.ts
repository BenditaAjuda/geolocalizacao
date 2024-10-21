import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WordpressVersionsService {

  private urlWordpress: string = "http://api.wordpress.org/core/stable-check/1.0/";
  teste: any;

  constructor(private httpClient: HttpClient) {
   }

  listarVersoesWordpress(){
    return this.httpClient.get(this.urlWordpress);
  }
}
