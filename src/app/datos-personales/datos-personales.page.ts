import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService, Message } from '../servicios/auth.service';
import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import { AngularFireStorage } from '@angular/fire/storage';
import { AlertController, IonContent, LoadingController } from '@ionic/angular';
import { Observable } from 'rxjs';
import {Validators, FormGroup, FormBuilder} from "@angular/forms";
import { Capacitor } from '@capacitor/core';
import {Geolocation} from '@capacitor/geolocation';

@Component({
  selector: 'app-datos-personales',
  templateUrl: './datos-personales.page.html',
  styleUrls: ['./datos-personales.page.scss'],
})
export class DatosPersonalesPage implements OnInit {

  @ViewChild(IonContent) content: IonContent;

  datos: Observable<Message[]>
  user='';
  nombre = '';
  apellido = '';
  cedula = '';
  numfamilia = '';
  uid= '';
  coordinate: any;
  imagen = '';

  constructor(
    private autservice:AuthService,
    private router:Router,
    public loadingCtrl: LoadingController,
    private afStorage: AngularFireStorage,
    public alertCtrl: AlertController) {}

  ngOnInit() {
    this.user = this.autservice.currentUser.email;
    this.uid = this.autservice.currentUser.uid;
  }
  
  //ENVIAR DATOS A FIREBASE 
  async enviarDatos(){
    const loading = await this.loadingCtrl.create();
    this.autservice.addDatosPersonales(
      this.user = this.autservice.currentUser.email, 
      this.nombre,
      this.apellido, 
      this.cedula, 
      this.numfamilia,
      this.coordinate.latitude,
      this.coordinate.longitude
      ).then(()=>{
        this.user = '';
        this.nombre= '';
        this.apellido= ''; 
        this.cedula= '';
        this.numfamilia= '';
        this.uid='';
        this.coordinate.latitude = "";
        this.coordinate.longitude = "";
        this.content.scrollToBottom();
        loading.dismiss();
        alert('Datos guardados correctamente');
        this.router.navigateByUrl('/home', {replaceUrl:true});
      }),async (err)=>{
        loading.dismiss();
        const alert = await this.alertCtrl.create({
          header: 'Invalido',
          message: err.message,
          buttons: ['OK'],
        });
        await alert.present();
      }
  }

  //OBTENER INFORMACIÓN DE LA UBICACIÓN 
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

  //CERRAR SESIÓN
  logout(){
    this.autservice.logout().then(()=>{
      this.router.navigateByUrl('/',{replaceUrl:true});
    })
  }

  //REGRESAR A PÁGINA PRINCIPAL
  regresar(){
      this.router.navigateByUrl('/home',{replaceUrl:true});
  }

}
