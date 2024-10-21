import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeoLocalizacaoService {

private nominatimUrl = 'https://nominatim.openstreetmap.org/search';

constructor(private http: HttpClient) { }

geocodeAddress(address: string): Observable<any> {
  const url = `${this.nominatimUrl}?q=${encodeURIComponent(address)}&format=json&addressdetails=1`;
  return this.http.get(url);
}

}
