import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController, AlertController, LoadingController,Platform } from 'ionic-angular';
import { CommonProvider } from '../../providers/common/common';


@IonicPage()
@Component({
  selector: 'page-forgetpassword',
  templateUrl: 'forgetpassword.html',
})
export class ForgetpasswordPage {

  check=true;
  OTPCheck=false;
  changepassword=false;

  clicked50=false;
  type="password";
  type1="password";
    clicked51=false;
    show1=true;
    show=true;
    loading:any;



  constructor(public plt:Platform,public loadingCtrl: LoadingController ,public newService :CommonProvider,public navCtrl:NavController,public toastCtrl:ToastController,public alertCtrl:AlertController) {
    let backAction =  this.plt.registerBackButtonAction(() => {
      if (this.navCtrl.canGoBack()) {
        this.navCtrl.pop({animation:"ios-transition"});
      }
      else{
        this.plt.exitApp();
      }

      backAction();
    },1)
  }



    forgotpassword=function(user)
    {
 //==========================

 this.loading = this.loadingCtrl.create({
  //  dismissOnPageChange: true,
  spinner: 'bubbles',

});
this.loading.present();
    //==========================
      console.log(user.value);

      this.newService.changeforgotpassword(user.value)

      .subscribe( data => {
//===========================


  //===========================
        console.log(data)
        if(data.res=="success"){
          console.log("bye")


          this.newService.getforgetpass(user.value).subscribe(data => {
            this.Menudata=data;
            let toast = this.toastCtrl.create({
              message: 'Password Updated',
              duration: 3000,
              position: 'top'
            });
            toast.present();
            localStorage.setItem('user',this.Menudata.mydata.mobileno);
            localStorage.setItem('pass',this.Menudata.mydata.password);
            console.log(this.Menudata);
            this.loading.dismiss();
            this.loading=null;


            this.navCtrl.setRoot('HomePage',null, {animation:"ios-transition"})
          });

        }
        else if(data.res=="failed")
        {
          this.loading.dismiss();
          this.loading=null;

          let toast = this.toastCtrl.create({
            message: 'Not updated',
            duration: 3000,
            position: 'top'
          });
          toast.present();

        }
        else
        {
          this.loading.dismiss();
          this.loading=null;

          let toast = this.toastCtrl.create({
            message: 'Error occured when sending mail',
            duration: 3000,
            position: 'top'
          });
          toast.present();


        }

    }, error => this.errorMessage = error )

    }

    sendOtp=function(user)
    {
    // ============================
    this.loading = this.loadingCtrl.create({
      spinner: 'bubbles',
    });

    this.loading.present();
    //====================================



      console.log(user.value);

      this.newService.sendOtp(user.value)

      .subscribe( data => {



        //==========================

        this.loading.dismiss();
        this.loading=null;

        //==========================
        console.log(data)
        if(data.res=="success"){
          this.check=false;
          this.OTPCheck=true;
          let toast = this.toastCtrl.create({
            message: 'Check your E-Mail inbox for OTP',
            duration: 3000,
            position: 'top'
          });
          toast.present();


        }
        else if (data.res == "failed") {
          let toast = this.toastCtrl.create({
            message: 'Not updated',
            duration: 3000,
            position: 'top'
          });
          toast.present();
         }

else if (data.res == "Blocked User") {
  let toast = this.toastCtrl.create({
    message: 'This is a Blocked Account',
    duration: 3000,
    position: 'top'
  });
  toast.present();
 }
        else if(data.res=="nomail")
        {
          let toast = this.toastCtrl.create({
            message: 'Mail ID does not exist',
            duration: 3000,
            position: 'top'
          });
          toast.present();


        }
        else
        {
          let toast = this.toastCtrl.create({
            message: 'Error occured when sending mail',
            duration: 3000,
            position: 'top'
          });
          toast.present();


        }

    }, error => this.errorMessage = error )


      }



    verifyOTP=function(user)
    {
    // ============================
     this.loading = this.loadingCtrl.create({
      spinner: 'bubbles',
    });

    this.loading.present();
    //====================================

      console.log(user.value);
      this.newService.verifyOTPforforgotpassword(user.value)

      .subscribe( data => {
             //==========================

             this.loading.dismiss();
             this.loading=null;

             //==========================
        console.log(data)
        if(data.res=="success"){
          this.OTPCheck=false;
          this.changepassword=true;


        }
        else if(data.res=="wrong")
        {

          let toast = this.toastCtrl.create({
            message: 'Enter correct OTP',
            duration: 3000,
            position: 'top'
          });
          toast.present();

        }
        else if(data.res=="OTPWRONG")
        {
          let toast = this.toastCtrl.create({
            message: 'OTP expired',
            duration: 3000,
            position: 'top'
          });
          toast.present();
         this.check = true;
          this.OTPCheck = false;
          user.resetForm();

        }
        else if(data.res== "block")
        {

          let toast = this.toastCtrl.create({
            message: 'Your account is blocked',
            duration: 3000,
            position: 'top'
          });
          toast.present();

          this.newService.logout().subscribe(data => {
            console.log(data)
            if(data.res=="loggedout")
            {
              this.newService.setUserLogout();
              this.navCtrl.setRoot('HomePage',null, {animation:"ios-transition"});
            }

          });


        }
        else if(data.res=="failed"){
          let toast = this.toastCtrl.create({
            message: 'Error while updating of forgotpassword',
            duration: 3000,
            position: 'top'
          });
          toast.present();
        }

    }, error => this.errorMessage = error )


    }
    cancelbut()
    {
      this.navCtrl.setRoot('HomePage',null, {animation:"ios-transition"})
    }

    myFunction1()
    {
      this.clicked50=!this.clicked50;
      this.show1=!this.show1;
      if(this.clicked50)
      {
        this.type1="text";
      }
      else if(!this.clicked50)
      {
        this.type1="password";
      }
    }
    myFunction()
    {
      this.clicked51=!this.clicked51;
      this.show=!this.show;
      if(this.clicked51)
      {
        this.type="text";
      }
      else if(!this.clicked51)
      {
        this.type="password";
      }
    }
    ionViewCanLeave(){
      if(this.loading)
      {
        this.loading.dismiss();
      }
     }


}
