import { CommonProvider } from './../../providers/common/common';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController, LoadingController,Platform } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-moveto',
  templateUrl: 'moveto.html',
})
export class MovetoPage {


  Repdata: any;
  Benedata: any;
  myData: any;
  mydata: any;
  scannedData: any
  loading: any;

  // clicked24=false;

  constructor(public plt:Platform,public loadingCtrl: LoadingController, public alertCtrl: AlertController, public toastCtrl: ToastController, private newService: CommonProvider, public navCtrl: NavController, public navParams: NavParams) {
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


  ngOnInit() {
    this.newService.getProfile().subscribe(data => {
      const Profiledata: any = data
      if (Profiledata.message == "sessionexpired") {
        this.newService.setUserLogout();
        // alert("Your session is expired... please login again to continue.")
        let toast = this.toastCtrl.create({
          message: 'Your session is expired... please login again to continue',
          duration: 3000,
          position: 'top'
        });
        toast.present();
        this.navCtrl.setRoot('HomePage', null, { animation: "ios-transition" });
      }
      else { }
    });
  }


  ionViewDidLoad() {

    console.log('ionViewDidLoad MovetoPage');
  }
  openpage(pager: any) {
    // this.clicked24=true;
    // ============================
    this.loading = this.loadingCtrl.create({
      spinner: 'bubbles',
    });

    this.loading.present();
    //====================================

    console.log("Server response " + this.Repdata.res)

    if (this.Repdata.res == "ownmobile") {
      let toast = this.toastCtrl.create({
        message: 'You cannot Send/Request money to your own account',
        duration: 3000,
        position: 'top'
      });
      toast.present();
      // this.clicked24=false;
      this.loading.dismiss();
      this.loading = null;


    }
    else if (this.Repdata.res == "blocked") {
      let toast = this.toastCtrl.create({
        message: 'This account is blocked',
        duration: 3000,
        position: 'top'
      });
      toast.present();
      // this.clicked24=false;
      this.loading.dismiss();
      this.loading = null;



    }
    else if ((this.Repdata.res == "success") || (this.Repdata.res == "failed")) {
      let currentIndex = this.navCtrl.getActive().index;
      this.navCtrl.push(pager, { id: this.Repdata.id.id, name: this.Repdata.id.name, mobile: this.Repdata.id.mobileno }, { animation: "ios-transition" }).then(() => {
        this.navCtrl.remove(currentIndex);
      });
      //  this.clicked24=false;
      this.loading.dismiss();
      this.loading = null;



    }
  }

  ionViewCanEnter() {
    this.Repdata = this.navParams.get('id');
    // var mydata = "bcgt_0987654321";
    // const transactiondata = {
    //   data: mydata.substr(5,15)
    // }
    // this.newService.qrscan(transactiondata).subscribe(data => {
    //   this.Repdata = data
    //   console.log(this.Repdata)

    // });

    // this.scannedData=localStorage.getItem('mobile');

    //  this.scannedData=this.scannedData.substr(5, 15);

  }


  ionViewCanLeave() {
    if (this.loading) {
      this.loading.dismiss();
    }
  }


}
