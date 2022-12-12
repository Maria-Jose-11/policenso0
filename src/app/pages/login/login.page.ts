import { Component, OnInit } from '@angular/core';
import{AuthService} from "../../servicios/auth.service"
import{Router} from "@angular/router"
import {NavController} from "@ionic/angular"
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  email:string;
  password:string;

  constructor(
    private authservice:AuthService, 
    public router:Router,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController
    ) { }

  ngOnInit() {
  }

  async onSubmitLogin(){

    const loading = await this.loadingCtrl.create();
    await loading.present();

    this.authservice.login(this.email,this.password).then(res =>{
      loading.dismiss();
      this.router.navigateByUrl('/home',{replaceUrl : true});
    },async (err)=>{
      loading.dismiss();
      const alert = await this.alertCtrl.create({
        header: 'Inicio Sesión Invalido',
        message: err.message,
        buttons: ['OK'],
      });
      await alert.present();
    }
    ).catch(err=>alert('Los datos son incorrectos o usuario no existe'));
  }

  async onSubmitSingUp(){
    const loading = await this.loadingCtrl.create();
    await loading.present();

    this.authservice.singUp(this.email,this.password).then(user => {

      loading.dismiss();
      this.router.navigateByUrl('/home',{replaceUrl : true});
    },async err =>{
      loading.dismiss();
      const alert = await this.alertCtrl.create({
        header: 'Registro fallo',
        message: err.message,
        buttons: ['OK'],
      });
      await alert.present();
    });
  }

  goToRegisterPage() {
    // this.navCtrl.navigateForward('/register');
    this.router.navigateByUrl('/register',{replaceUrl : true});
  }
  


}
