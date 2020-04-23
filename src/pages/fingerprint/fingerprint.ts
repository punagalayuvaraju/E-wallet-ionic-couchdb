import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform ,ToastController} from 'ionic-angular';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio';
import { SplashScreen } from '@ionic-native/splash-screen';
import { App } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-fingerprint',
  templateUrl: 'fingerprint.html',
})
export class FingerprintPage {

  username:any;
  password:any;
  constructor( public toastCtrl: ToastController, public  app: App,public platform:Platform,public splash:SplashScreen,public navCtrl: NavController, public navParams: NavParams,private faio: FingerprintAIO) {
    this.splash.hide();
    this.username=localStorage.getItem('username');
    this.password=localStorage.getItem('password');
    this.faio.show({
      clientId: 'Fingerprint',
      clientSecret: 'password', // Only Android
      localizedFallbackTitle: 'Use Pin', // Only iOS
      localizedReason: 'Please authenticate' // Only iOS
    })
      .then((result: any) => {
        if(this.username&&this.password)
        {

        }
        this.navCtrl.setRoot('HomePage');
      })
      .catch((error: any) => {
        if(error=="Cancelled")
        {
          this.platform.exitApp();
        }

      });
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad FingerprintPage');
  }





  // ionViewCanLeave(){
  //   if(this.loading)
  //   {
  //     this.loading.dismiss();
  //   }
  //  }
}
