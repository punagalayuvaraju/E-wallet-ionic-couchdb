import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { CommonProvider } from '../../providers/common/common';


@IonicPage()
@Component({
  selector: 'page-emailc',
  templateUrl: 'emailc.html',
})
export class EmailcPage {


  constructor(public toastCtrl: ToastController,public newService: CommonProvider,public navCtrl: NavController, public navParams: NavParams) {
  }

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
        this.navCtrl.setRoot('HomePage');
      }
      else{}
    });
}

  sendmoney = function(user) {
    console.log('user')
    user.mode = this.valbutton;
    this.newService.sendmoney(user.value)

  .subscribe( data => {
    console.log(data)
    var res=data.res;
    console.log(res);
    if(res=="insufficient funds"){

      let toast = this.toastCtrl.create({
        message: 'Insufficient Funds',
        duration: 3000,
        position: 'top'
      });
      toast.present();

      user.resetForm();
    }

    else{
      let toast = this.toastCtrl.create({
        message: 'Amount has sent',
        duration: 3000,
        position: 'top'
      });
      toast.present();

      user.resetForm();
    }
  }, error => this.errorMessage = error )
}
  ionViewDidLoad() {
    console.log('ionViewDidLoad EmailcPage');
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
      this.navCtrl.setRoot('HomePage');
    }
  }




  // ionViewCanLeave(){
  //   if(this.loading)
  //   {
  //     this.loading.dismiss();
  //   }
  //  }
}
