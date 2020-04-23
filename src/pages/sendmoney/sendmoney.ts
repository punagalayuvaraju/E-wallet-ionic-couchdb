import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController, LoadingController,Platform } from 'ionic-angular';
import { CommonProvider } from '../../providers/common/common';


@IonicPage()
@Component({
  selector: 'page-sendmoney',
  templateUrl: 'sendmoney.html',
})
export class SendmoneyPage {

  loading:any;

  constructor(public plt:Platform,public loadingCtrl: LoadingController,public alertCtrl:AlertController,public toastCtrl:ToastController, private newService:CommonProvider, public navCtrl: NavController, public navParams: NavParams) {
    let backAction =  this.plt.registerBackButtonAction(() => {
      if (this.navCtrl.canGoBack()) {
        this.navCtrl.pop({animation:"ios-transition"});
      }
      else{
        this.plt.exitApp();
      }

      backAction();
    },1)
    console.log("Uniqueid"+Math.random())
  }
  valbutton ="save";
  accounts:any;
  funds=true;
  formhide=true;
  show=false;
  Profiledata :any
  id:any;
  myid:any
  mysess:any
  name:any;
  mobile:any;
  beneficiaryac:any;

  ngOnInit(){
// ============================


}

// ngOnInit(){

//   this.newService.getProfile().subscribe(data => {
//     this.Profiledata =data

//     {
//   this.newService.getbeneficiary().subscribe(
//       data => {
//         console.log("data")
//         console.log(data);
//         this.accounts=data;
//       })
//     }
// });

// }

addbeneficiary(){
  localStorage.setItem('navigate','true');
  this.navCtrl.push('AddbeneficiaryPage', null, { animation: "ios-transition" });

}



otpfun = function(user)
{

    // ============================
    this.loading = this.loadingCtrl.create({
      spinner: 'bubbles',
    });

    this.loading.present();
    //====================================

console.log('user')


    user.mode = this.valbutton;

  this.newService.otp(user.value)
  .subscribe( data => {

    //======================
    this.loading.dismiss();
    this.loading=null;

    //================================

    if(data.res=="success"){

      this.show=true;
    this.formhide=false;
     let toast = this.toastCtrl.create({
      message: 'Check your E-Mail inbox for OTP',
      duration: 3000,
      position: 'top'
  });
  toast.present();

  }

    else if(data.res=="blocked user"){
      this.show = false;
      this.formhide = true;
      user.resetForm();
      let toast = this.toastCtrl.create({
        message: 'blocked user',
        duration: 3000,
        position: 'top'
    });
    toast.present();


    }
    else{
      this.show = false;
      this.formhide = true;
      let toast = this.toastCtrl.create({
        message: 'Enter correct E-Mail address',
        duration: 3000,
        position: 'top'
    });
    toast.present();

    }

  }, error => this.errorMessage = error )

}


sendmoney = function(user) {
    // ============================
    this.loading = this.loadingCtrl.create({
      spinner: 'bubbles',
    });

    this.loading.present();
    //====================================



  console.log('user')

  if(this.newService.getUserLoggedIn())
{
  this.newService.sendmoney(user.value)

.subscribe( data => {

     //======================
     this.loading.dismiss();
     this.loading=null;

     //================================

  console.log(data)
  var res=data.res;

  if(res=="insufficient funds"){

    let toast = this.toastCtrl.create({
      message: 'Insufficient Funds',
      duration: 3000,
      position: 'top'
  });
  toast.present();

    user.resetForm();
    this.show = false;
    this.formhide = true;
  }

 else if(res=="OTPWRONG"){

  let toast = this.toastCtrl.create({
    message: 'Incorrect OTP',
    duration: 3000,
    position: 'top'
});
toast.present();

 }
  else if(res=="send"){
    let toast = this.toastCtrl.create({
      message: 'Amount sent successfully',
      duration: 3000,
      position: 'top'
  });
  toast.present();

//------------------------
if(this.id)
{
  user.controls['amount1'].reset();
  user.controls['comment1'].reset();
}
else{
     user.resetForm();

}
//------------------------------
    this.show = false;
    this.formhide = true;
  }


  else if(res=="OTP-expired")
  {
    // alert("OTP expired");
    let toast = this.toastCtrl.create({
      message: 'OTP expired',
      duration: 3000,
      position: 'top'
  });
  toast.present();
    user.resetForm();
    this.show = false;
    this.formhide = true;
  }

  else if(res=="block"){
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


}, error => this.errorMessage = error )
}
}


  ionViewDidLoad() {
    console.log('ionViewDidLoad SendmoneyPage');
  }

  ionViewCanEnter() {
    if(!this.newService.getUserLoggedIn())
    {
      console.log("Not logged")
      let toast = this.toastCtrl.create({
        message: 'You are not logged in!!',
        duration: 3000,
        position: 'top'
      });
      toast.present();
      this.navCtrl.setRoot('HomePage',null, {animation:"ios-transition"});
    }
    else
    {
      this.loading = this.loadingCtrl.create({
        //  dismissOnPageChange: true,
        spinner: 'bubbles',

      });
      this.loading.present();
      //====================================


          this.newService.getProfile().subscribe(data => {

            const Profiledata :any=data
            if(Profiledata.message=="sessionexpired"){
              this.loading.dismiss();
              this.loading=null;


              this.newService.setUserLogout();
              // alert("Your session is expired... please login again to continue.")
              let toast = this.toastCtrl.create({
                message: 'Your session is expired... please login again to continue',
                duration: 3000,
                position: 'top'
              });
              toast.present();
              this.navCtrl.setRoot('HomePage',null, {animation:"ios-transition"});
            }
            else{

              this.newService.getProfile().subscribe(data => {
                this.Profiledata =data

                {
              this.newService.getbeneficiary().subscribe(
                  data => {
                    //===========================
              this.loading.dismiss();
              this.loading=null;


              //===========================
                    console.log("data")
                    console.log(data);
                    this.accounts=data;
                  })
                }
            });

            }
          });
    }
    this.id=this.navParams.get('id')
    this.name=this.navParams.get('name')
    this.mobile=this.navParams.get('mobile')
    this.beneficiaryac=this.id;


  }
  ionViewCanLeave(){
    if(this.loading)
    {
      this.loading.dismiss();
    }
   }
}
