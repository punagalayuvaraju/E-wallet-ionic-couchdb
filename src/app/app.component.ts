import { HomePage } from './../pages/home/home';
import { LoadingController, Platform } from 'ionic-angular';
import { Component } from '@angular/core';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any=HomePage;
  constructor(public statusBar: StatusBar,public loadingCtrl:LoadingController,public platform:Platform,public splash:SplashScreen) {
    this.initializeApp();

  }
  initializeApp() {
    this.platform.ready().then(() => {
      // do whatever you need to do here.
      this.rootPage=HomePage;

      setTimeout(() => {
        this.splash.hide();

      }, 100);
    });
  }
}
