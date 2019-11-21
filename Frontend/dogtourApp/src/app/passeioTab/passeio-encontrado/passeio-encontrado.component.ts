import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { HttpClient } from '@angular/common/http';

declare var google;

@Component({
  selector: 'app-passeio-encontrado',
  templateUrl: './passeio-encontrado.component.html',
  styleUrls: ['./passeio-encontrado.component.scss'],
})
export class PasseioEncontradoComponent implements OnInit {
  // directionsService = new google.maps.DirectionsService();
  // directionsDisplay = new google.maps.DirectionsRenderer();
  // map: any;
  // startPosition: any;
  // originPosition: string;
  // destinationPosition: string;
  map: any;


  constructor(public authService: AuthService, private geolocation: Geolocation, 
    private http: HttpClient) { }

  ngOnInit() {
   // this.initializeMap();
   this.geolocation.getCurrentPosition()
   .then((resp) => {
     const position = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);

     const mapOptions = {
       zoom: 18,
       center: position
     }

     this.map = new google.maps.Map(document.getElementById('map'), mapOptions);

     const marker = new google.maps.Marker({
       position: position,
       map: this.map
     });

   }).catch((error) => {
     console.log('Erro ao recuperar sua posição', error);
   });
  }

  // initializeMap() {
  //   this.startPosition = new google.maps.LatLng(-21.763409, -43.349034);

  //   const mapOptions = {
  //     zoom: 18,
  //     center: this.startPosition,
  //     disableDefaultUI: true
  //   }

  //   this.map = new google.maps.Map(document.getElementById('map'), mapOptions);
  //   this.directionsDisplay.setMap(this.map);

  //   const marker = new google.maps.Marker({
  //     position: this.startPosition,
  //     map: this.map,
  //   });
  // }

  // calculateRoute() {
  //   if (this.destinationPosition && this.originPosition) {
  //     const request = {
  //       // Pode ser uma coordenada (LatLng), uma string ou um lugar
  //       origin: this.originPosition,
  //       destination: this.destinationPosition,
  //       travelMode: 'DRIVING'
  //     };

  //     this.traceRoute(this.directionsService, this.directionsDisplay, request);
  //   }
  // }

  // traceRoute(service: any, display: any, request: any) {
  //   service.route(request, function (result, status) {
  //     if (status == 'OK') {
  //       display.setDirections(result);
  //     }
  //   });
  // }



  public cancelar() {

  }

}

