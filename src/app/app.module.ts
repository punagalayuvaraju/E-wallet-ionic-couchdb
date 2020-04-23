import { HomePage } from './../pages/home/home';
 import { FingerprintPage } from './../pages/fingerprint/fingerprint';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule, NavControllerBase } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MyApp } from './app.component';
import { ProfilePageModule } from '../pages/profile/profile.module';
import { HomePageModule } from '../pages/home/home.module';
import { LoginPageModule } from '../pages/login/login.module';
import { RegisterPageModule } from '../pages/register/register.module';
import { MenuPageModule } from '../pages/menu/menu.module';
import { AddmoneyPageModule } from '../pages/addmoney/addmoney.module';
import { SendmoneyPageModule } from '../pages/sendmoney/sendmoney.module';
import { RequestmoneyPageModule } from '../pages/requestmoney/requestmoney.module';
import { TransactionsPageModule } from '../pages/transactions/transactions.module';
import { ChangepasswordPageModule } from '../pages/changepassword/changepassword.module';
import { AddbeneficiaryPageModule } from '../pages/addbeneficiary/addbeneficiary.module';
import { ViewbeneficiaryPageModule } from '../pages/viewbeneficiary/viewbeneficiary.module';
import { WelcomePageModule } from '../pages/welcome/welcome.module';
import { CommonProvider } from '../providers/common/common';
import {HttpClientModule } from '@angular/common/http';
import { NgxQRCodeModule } from 'ngx-qrcode2';
import { ForgetpasswordPageModule } from '../pages/forgetpassword/forgetpassword.module';
import { LocalNotifications } from '@ionic-native/local-notifications';
import {BarcodeScanner}from '@ionic-native/barcode-scanner';
import { QrscannerPageModule } from '../pages/qrscanner/qrscanner.module'
import { MovetoPageModule } from '../pages/moveto/moveto.module'
import { CodePush } from '@ionic-native/code-push';
import { Network } from '@ionic-native/network';
import { CodepushPageModule }from '../pages/codepush/codepush.module';
import {FingerprintAIO}from'@ionic-native/fingerprint-aio';
@NgModule({
  declarations: [FingerprintPage,
    MyApp
  ],
  imports: [

    HomePageModule,
    RegisterPageModule,
    LoginPageModule,
    ForgetpasswordPageModule,
    MenuPageModule,
    WelcomePageModule,
    ProfilePageModule,
    SendmoneyPageModule,
    RequestmoneyPageModule,
    AddmoneyPageModule,
    AddbeneficiaryPageModule,
    ViewbeneficiaryPageModule,
    TransactionsPageModule,
    ChangepasswordPageModule,
    QrscannerPageModule,
    MovetoPageModule,
    CodepushPageModule,

    ReactiveFormsModule,
    NgxQRCodeModule,
    BrowserModule,
    HttpClientModule,
    FormsModule,
    // SocketIoModule.forRoot(config),
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [FingerprintPage,
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    LocalNotifications,
    BarcodeScanner,
    CodePush,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    CommonProvider,FingerprintAIO,
 Network
  ]
})
export class AppModule {}
