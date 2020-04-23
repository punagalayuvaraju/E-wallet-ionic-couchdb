import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController, AlertController, LoadingController,Platform } from 'ionic-angular';
import { CommonProvider } from '../../providers/common/common';

@IonicPage()
@Component({
  selector: 'page-addbeneficiary',
  templateUrl: 'addbeneficiary.html',
})
export class AddbeneficiaryPage {
  constructor(public plt:Platform,public loadingCtrl: LoadingController ,public alertCtrl:AlertController,public toastCtrl: ToastController, public newService:CommonProvider, public navCtrl: NavController, public navParams: NavParams) {
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
  loading:any
  ngOnInit(){
    this.newService.getProfile().subscribe(data => {
      const Profiledata :any=data
      if(Profiledata.message=="sessionexpired"){
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
      else{}
    });
}

  addbeneficiary = function(user) {

    // ============================
this.loading = this.loadingCtrl.create({
  spinner: 'bubbles',
});

this.loading.present();
//====================================


    console.log(user)
    if(this.newService.getUserLoggedIn())
    {
    this.newService.addbeneficiary(user.value)

    .subscribe( data => {

       //==========================

       this.loading.dismiss();
       this.loading=null;
       //==========================
      var res=data.res;
      if(res=="You Cannot Add Your own Mobile Number")
      {
        let toast = this.toastCtrl.create({
          message: 'You Cannot Add Your own Mobile Number',
          duration: 3000,
          position: 'top'
        });
        toast.present();
        user.resetForm();
      }
      else if(res=="failed"){
        let toast = this.toastCtrl.create({
          message: 'This beneficiary already exist',
          duration: 3000,
          position: 'top'
        });
        toast.present();
        user.resetForm();
      }

      else if(res=="success"){
        let toast = this.toastCtrl.create({
          message: 'Added Beneficiary successfully',
          duration: 3000,
          position: 'top'
        });
        toast.present();
        user.resetForm();
        if(localStorage.getItem('navigate')=="true")
        {
          console.log("Hiiiiiiii5")
          localStorage.setItem('navigate','false')
          this.navCtrl.pop({animation: "ios-transition"})
        }
      }
      else if(res=="Beneficiary mobilenumber not existed")
      {
        let toast = this.toastCtrl.create({
          message: 'Beneficiary mobilenumber not existed',
          duration: 3000,
          position: 'top'
        });
        toast.present();
      }
      else if(res=="blocked")
      {
        let toast = this.toastCtrl.create({
          message: 'Mobile Number is blocked',
          duration: 3000,
          position: 'top'
        });
        toast.present();

      }
    }, error => this.errorMessage = error )
  }

  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad AddbeneficiaryPage');
  }
  ionViewCanEnter() {
    if(!this.newService.getUserLoggedIn())
    {
      let toast = this.toastCtrl.create({
        message: 'You are not logged in!!',
        duration: 3000,
        position: 'top'
      });
      toast.present();
      this.navCtrl.setRoot('HomePage',null, {animation:"ios-transition"});
    }
  }

 ionViewCanLeave(){
  if(this.loading)
  {
    this.loading.dismiss();
  }
 }

}


