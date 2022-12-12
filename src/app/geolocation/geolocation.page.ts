import { Component, OnInit, NgZone } from '@angular/core';
import {Capacitor} from "@capacitor/core";
import {Geolocation} from '@capacitor/geolocation';

@Component({
  selector: 'app-geolocation',
  templateUrl: './geolocation.page.html',
  styleUrls: ['./geolocation.page.scss'],
})
export class GeolocationPage implements OnInit {

  coordinate: any;
  watchCoordinate: any;
  watchId: any;

  constructor(private zone:NgZone) { }

  async requestPermissions() {
    const permResult = await Geolocation.requestPermissions();
    console.log('Perm request result: ', permResult);
  }

  ngOnInit() {
  }

  getCurrentCoordinate() {
    if (!Capacitor.isPluginAvailable('Geolocation')) {
      console.log('Plugin geolocation not available');
      return;
    }
    Geolocation.getCurrentPosition().then(data => {
      this.coordinate = {
        latitude: data.coords.latitude,
        longitude: data.coords.longitude,
        accuracy: data.coords.accuracy
      };
    }).catch(err => {
      console.error(err);
    });
  }

  watchPosition() {
    try {
      this.watchId = Geolocation.watchPosition({}, (position, err) => {
        console.log('Watch', position);
        this.zone.run(() => {
          this.watchCoordinate = {
            //latitude: position.coords.latitude,
            //longitude: position.coords.longitude,
          };
        });
      });
    } catch (e) {
      console.error(e);
    }
  }

  clearWatch() {
    if (this.watchId != null) {
      Geolocation.clearWatch({ id: this.watchId });
    }
  }

}
