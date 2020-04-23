import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController,Platform } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { CommonProvider } from '../../providers/common/common';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

    type="password";
    clicked456=false;
    show=true;
    loading:any;
    user:any;
    pass:any;
    mydata:any;
    myval:any;
  constructor(public plt:Platform,public faio: FingerprintAIO,public loadingCtrl: LoadingController ,private alertCtrl: AlertController,public newService:CommonProvider, public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController) {
    let backAction =  this.plt.registerBackButtonAction(() => {
      if (this.navCtrl.canGoBack()) {
        this.navCtrl.pop({animation:"ios-transition"});
      }
      else{
        this.plt.exitApp();
      }

      backAction();
    },1)
    this.mydata=localStorage.getItem('user')
    if(localStorage.getItem('user') && localStorage.getItem('loggedIn')=="true")
    {
      this.fingerscan();
    }
  }
  ngOnInit() {


  }

  fingerscan = function()
  {


      this.faio.show({
        clientId: 'Fingerprint',
        clientSecret: 'password', // Only Android
        localizedFallbackTitle: 'Use Pin', // Only iOS
        localizedReason: 'Please authenticate' // Only iOS
      })
        .then((result: any) => {
          this.loading = this.loadingCtrl.create({
            // dismissOnPageChange: true,
            spinner: 'bubbles',

          });
          this.loading.present();
          const user={
            username:localStorage.getItem('user'),
            password:localStorage.getItem('pass')

          }

          this.newService.checkLogin(user).subscribe(data => {
            //===========================
            this.loading.dismiss();
            this.loading=null;


            //===========================

            this.Repdata = data
            if (this.Repdata.message == "incorrectpassword") {
              console.log("Login.ts")
              let toast = this.toastCtrl.create({
                message: 'Please enter correct password',
                duration: 3000,
                position: 'top'
            });
            toast.present();
              console.log("entered incorrect password...")
            }
            else if (this.Repdata.message == "Unknownuser") {
              let toast = this.toastCtrl.create({
                message: 'There is no Account with this Mobile Number',
                duration: 3000,
                position: 'top'
            });
            toast.present();
              console.log("entered Invalid credentials...")
            }
            else if (this.Repdata.message == "block")
            {

            let toast = this.toastCtrl.create({
              message: 'Your account is blocked please consult Admin',
              duration: 3000,
              position: 'top'
          });
          toast.present();


            }

            else if (this.Repdata.message == "success"){
              console.log("login success...")
              this.newService.setUserLoggedIn();
              this.newService.Connectsocket().subscribe(socket => {
                // var stockQuote = socket;
              });
              console.log("called")
              this.navCtrl.setRoot('MenuPage',null, {animation:"ios-transition"});
            }
            else
            {
              // alert("Server Error... Try after some time");

            let toast = this.toastCtrl.create({
              message: 'Server Error... Try after some time',
              duration: 3000,
              position: 'top'
             });
            toast.present();
            }




          });
        })
        .catch((error: any) => {
          if(error=="Cancelled")
          {
            this.plt.exitApp();
          }


        });


  }
  Repdata;
  login = function (user) {

                //==========================

                this.loading = this.loadingCtrl.create({
                  // dismissOnPageChange: true,
                  spinner: 'bubbles',

                });
                this.loading.present();
                    //==========================

    if(this.newService.getUserLoggedIn()){
      this.newService.setUserLogout();
      this.newService.logout().subscribe(data=> {
        //===========================
        this.loading.dismiss();
        this.loading=null;


  //===========================

        let toast = this.toastCtrl.create({
          message: 'Previous session is not closed properly...close your application and please sign in again...',
          duration: 5000,
          position: 'top'
      });
      toast.present();
      this.navCtrl.setRoot('HomePage',null, {animation:"ios-transition"})
    });
      }
      else  if (user.value.uniquefield == 0)
      {


    this.newService.checkLogin(user.value).subscribe(data => {
      //===========================
      this.loading.dismiss();
      this.loading=null;


      //===========================

      this.Repdata = data
      if (this.Repdata.message == "incorrectpassword") {
        console.log("Login.ts")
        let toast = this.toastCtrl.create({
          message: 'Please enter correct password',
          duration: 3000,
          position: 'top'
      });
      toast.present();
        console.log("entered incorrect password...")
      }
      else if (this.Repdata.message == "Unknownuser") {
        let toast = this.toastCtrl.create({
          message: 'There is no Account with this Mobile Number',
          duration: 3000,
          position: 'top'
      });
      toast.present();
        console.log("entered Invalid credentials...")
      }
      else if (this.Repdata.message == "block")
      {

      let toast = this.toastCtrl.create({
        message: 'Your account is blocked please consult Admin',
        duration: 3000,
        position: 'top'
    });
    toast.present();


      }

      else if (this.Repdata.message == "success"){
        console.log("login success...")
        this.newService.setUserLoggedIn();
        this.newService.Connectsocket().subscribe(socket => {
          // var stockQuote = socket;
        });
        console.log("called")
        this.navCtrl.setRoot('MenuPage',null, {animation:"ios-transition"});
      }
      else
      {
        // alert("Server Error... Try after some time");

      let toast = this.toastCtrl.create({
        message: 'Server Error... Try after some time',
        duration: 3000,
        position: 'top'
       });
      toast.present();
      }




    });
  }
  else if (user.value.uniquefield == 1){
    this.newService.getmobilenumber(user.value).subscribe(data => {



        if(data.status=="found")
        {
          user.value.username = data.mobilenumber;
          user.value.uniquefield=0;
          this.newService.checkLogin(user.value).subscribe(data => {

            //===========================



        //===========================
            this.Repdata = data
            console.log(this.Repdata)
            if (this.Repdata.message == "incorrectpassword") {
              this.loading.dismiss();
              this.loading=null;
              // alert("Enter correct password");
              let toast = this.toastCtrl.create({
                message: 'Enter correct password',
                duration: 3000,
                position: 'top'
            });
            toast.present();
              console.log("entered incorrect password...")
            }
            else if (this.Repdata.message == "Unknownuser") {
              // alert("Invalid credentials");
              this.loading.dismiss();
              this.loading=null;
              let toast = this.toastCtrl.create({
                message: 'There is no Account with this Email Id',
                duration: 3000,
                position: 'top'
            });
            toast.present();

              console.log("entered Invalid credentials...")
            }
            else if (this.Repdata.message == "block")
            {
              this.loading.dismiss();
        this.loading=null;
              // alert("Your account is blocked please consult Admin");
              let toast = this.toastCtrl.create({
                message: 'Your Account is blocked please consult Admin',
                duration: 3000,
                position: 'top'
            });
            toast.present();
            }
            else if (this.Repdata.message == "success") {
              this.loading.dismiss();
        this.loading=null;
              console.log("login success...")
              this.newService.setUserLoggedIn();
              this.newService.Connectsocket().subscribe(socket => {
                // var stockQuote = socket;
              });
              console.log("called")
              this.navCtrl.setRoot('MenuPage',null, {animation:"ios-transition"});

            }
            else
            {
              this.loading.dismiss();
        this.loading=null;
              // alert("Server Error... Try after some time");
              let toast = this.toastCtrl.create({
                message: 'Server Error... Try after some time',
                duration: 3000,
                position: 'top'
               });
              toast.present();
            }
          });
        }
        else if(data.status=="notfound")
        {
          this.loading.dismiss();
        this.loading=null;
            let toast = this.toastCtrl.create({
              message: 'There is no account with this Email id.',
              duration: 3000,
              position: 'top'
          });
          toast.present();

        }

      });
    }



  }





   forgetpassword()
   {
     this.navCtrl.push('ForgetpasswordPage',null, {animation:"ios-transition"});
   }


 myFunction()
   {
     this.clicked456=!this.clicked456;
     this.show=!this.show;
     if(this.clicked456)
     {
       this.type="text";
     }
     else if(!this.clicked456)
     {
       this.type="password";
     }
   }


   ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }



  ionViewCanLeave(){
    if(this.loading)
    {
      this.loading.dismiss();
    }
   }
}
