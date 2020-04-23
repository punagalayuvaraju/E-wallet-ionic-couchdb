import { SplashScreen } from '@ionic-native/splash-screen';
import { CommonProvider } from './../../providers/common/common';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Platform } from 'ionic-angular';
import { RegisterPage } from '../register/register';
import { LoginPage } from '../login/login';
import { CodePush, SyncStatus } from '@ionic-native/code-push';


@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  constructor(public plt:Platform,private codePush:CodePush,public navCtrl: NavController, public navParams: NavParams,public newService:CommonProvider,public alertCtrl: AlertController,public splash:SplashScreen) {

  }

ionViewCanEnter(){



  console.log(this.newService.getUserLoggedIn())
  this.codePush.sync().subscribe((status)=>{

    if(status==SyncStatus.UPDATE_INSTALLED)
    {
      let alert = this.alertCtrl.create({
        title: 'Update Available',
        message: 'An update was just downloaded. Would you like to restart your app to use the latest features?',
        buttons: [
          {
            text: 'Not now',
            handler: () => {
              console.log('Cancel clicked');
            }
          },
          {
            text: 'Restart',
            handler: () => {
              this.splash.show();
              this.codePush.restartApplication();
              console.log('Restart clicked');
            }
          }
        ]
      });
      alert.present();
    }
  },(err)=>{console.log(err)})
  if(this.newService.getUserLoggedIn()){
    if(localStorage.getItem('user'))
    {
      this.navCtrl.push('LoginPage',null, {animation:"ios-transition"});

    }
    else{
      this.navCtrl.setRoot('MenuPage',null, {animation:"ios-transition"});
      this.newService.Connectsocket().subscribe(socket => {
        // var stockQuote = socket;
      });
    }

  }

}

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePages');
  }
  openLoginPage()
  {
    this.navCtrl.push(LoginPage,null, {animation:"ios-transition"});
  }
  openSignupPage()
  {
    this.navCtrl.push(RegisterPage,null, {animation:"ios-transition"});
  }




  // ionViewCanLeave(){
  //   if(this.loading)
  //   {
  //     this.loading.dismiss();
  //   }
  //  }
}
