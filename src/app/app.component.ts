import { Component } from '@angular/core';
import { WordpressVersionsService } from './services/wordpress-versions.service';
import { Versao } from './models/versao';
import { ViaCepService } from './services/via-cep.service';
import { GeoLocalizacaoService } from './services/geo-localizacao.service';
import { DistanceCalculator } from '../app/utils/distance-calculator';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  logradouro: string = '';
  estado: string = '';
  cidade: string | undefined;
  coordenadas: string = '';
  error: string = '';

  latitude: number | null = null;
  longitude: number | null = null;
  error2: string = '';

  lat1: number | undefined;
  lon1: number | undefined;
  lat2: number | undefined;
  lon2: number | undefined;
  distance: number | undefined;

  constructor(private geocodingService: GeoLocalizacaoService) { }

  buscarCoordenadas() {

    const enderecoCompleto = `${this.logradouro}, ${this.cidade}, ${this.estado}`;

    this.geocodingService.geocodeAddress(enderecoCompleto).subscribe(
      (response) => {
        if (response.length > 0) {
          const location = response[0];
          this.coordenadas = `Latitude: ${location.lat}, Longitude: ${location.lon}`;
          this.error = '';
        } else {
          this.coordenadas = '';
          this.error = 'Endereço não encontrado';
        }
      },
      (error) => {
        console.error('Erro ao buscar coordenadas:', error);
        this.coordenadas = '';
        this.error = 'Erro ao buscar coordenadas';
      }
    );
  }



  obterLocalizacao(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
          this.error = '';
        },
        (error) => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              this.error2 = 'Permissão negada para acessar a localização.';
              break;
            case error.POSITION_UNAVAILABLE:
              this.error = 'A posição não está disponível.';
              break;
            case error.TIMEOUT:
              this.error2 = 'O pedido de localização expirou.';
              break;
            default:
              this.error2 = 'Ocorreu um erro desconhecido.';
              break;
          }
        }
      );
    } else {
      this.error2 = 'Geolocalização não é suportada por este navegador.';
    }
  }

  calculateDistance(): void {
    if (this.lat1 && this.lon1 && this.lat2 && this.lon2) {
      this.distance = this.getDistanceFromLatLonInKm(this.lat1, this.lon1, this.lat2, this.lon2);
    } else {
      alert('Por favor, insira todas as coordenadas');
    }
  }

  // Implementação da fórmula de Haversine diretamente no componente
  getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Raio da Terra em km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distância em km
    return distance;
  }

  // Função auxiliar para converter graus em radianos
  deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

}



