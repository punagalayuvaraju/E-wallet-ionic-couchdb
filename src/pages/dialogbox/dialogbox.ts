import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { CommonProvider } from '../../providers/common/common';


@IonicPage()
@Component({
  selector: 'page-dialogbox',
  templateUrl: 'dialogbox.html',
})
export class DialogboxPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,private newService:CommonProvider, public toastCtrl:ToastController) {
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

  ionViewDidLoad() {
    console.log('ionViewDidLoad DialogboxPage');
  }


  // ionViewCanLeave(){
  //   if(this.loading)
  //   {
  //     this.loading.dismiss();
  //   }
  //  }


}
