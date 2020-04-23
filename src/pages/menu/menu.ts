import { Component, ViewChild, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, Nav, ToastController, AlertController, LoadingController, Platform,MenuController } from 'ionic-angular';
import { CommonProvider } from '../../providers/common/common';

export interface PageInterface
{
  title:string;
  pageName:string;
  tabComponent?:any;
  index?:number;
  icon:string;
}
@IonicPage()
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage implements OnInit{

  rootPage = 'WelcomePage';
  clicked:boolean=false;
  Profiledata:any=null;
  myval:any;
  loading:any;
  message:any;
  count:any=0;
  a:any=0;
  Menudata:any=null;
  @ViewChild(Nav) nav:Nav;

  // pages: PageInterface[]= [

  //   {title: 'Home', pageName: 'WelcomePage',icon: ''},
  //   {title: 'Wallet', pageName: 'WelcomePage',icon: ''},
  //   {title: 'Profile', pageName: 'WelcomePage',icon: ''},
  //   {title: 'SavedCards', pageName: 'WelcomePage',icon: ''},
  //   {title: 'Transactions', pageName: 'WelcomePage',icon: ''},
  //   {title: 'Settings', pageName: 'WelcomePage',icon: ''},
  //   {title: 'Logout', pageName: 'HomePage', icon: ''}
  // ]
  constructor(public menuCtrl: MenuController,public plt:Platform,public loadingCtrl:LoadingController,public alertCtrl:AlertController,public navCtrl: NavController, public navParams: NavParams,private newService:CommonProvider,public toastCtrl:ToastController) {
    let backAction =  this.plt.registerBackButtonAction(() => {
      if (localStorage.getItem('menuopen')=="true") {
        this.menuCtrl.close();
      }
      backAction();
    },1)
    this.newService.newMessageReceived()
    .subscribe(data => {
  console.log("newmessage")


      this.newService.getmessage().subscribe(data =>{
        this.message = data
        console.log(this.message)

        this.newService.getProfile().subscribe(data => {
          const Profiledata: any = data

          if(this.message.length==0)
        {
          console.log("No messsages");
        }
        else
        {
          this.count=0;
         for(let i=0;i<this.message.length;i++)
         {
          // if(this.message[i].value.trans_status=='pending')
          if((this.message[i].value.trans_status=='pending' &&Profiledata.mobilenumber==this.message[i].value.to &&this.message[i].value.type=='sending' )||
          (this.message[i].value.trans_status=='pending' && Profiledata.mobilenumber==this.message[i].value.to  && this.message[i].value.type=='moneyrequest'))

          {
            this.count++;
          console.log("pradiiiiiiii");
          }
         }




        }

        });
        // ===================================
        // ====================================


      });


  })








    if(this.newService.getfinger())
  {
    this.myval=true;
  }
  else{
    this.myval=false;
  }
  }
  setfinger()
  {
    this.myval=!this.myval;
    console.log("Myval "+this.myval)
    if(!this.myval)
    {
     this.newService.removefinger()
    }
    else
    {
      this.newService.getuserpass().subscribe(data => {
        this.Menudata=data;
        localStorage.setItem('user',this.Menudata.mydata.mobileno);
        localStorage.setItem('pass',this.Menudata.mydata.password)



      });

    }
  }
  ngOnInit(){
    console.log("called menu ngoninit")
    this.loading = this.loadingCtrl.create({
      // dismissOnPageChange: true,
      spinner: 'bubbles',

    });
    this.newService.getProfile().subscribe(data => {

      this.Profiledata=data;
      this.loading.dismiss();
      this.loading=null;
      console.log(this.Profiledata)
      if(this.Profiledata.message=="sessionexpired"){
        this.newService.setUserLogout();
        // alert("Your session is expired... please login again to continue.")
        // let toast = this.toastCtrl.create({
        //   message: 'Your session is expired... please login again to continue',
        //   duration: 3000,
        //   position: 'top'
        // });
        // toast.present();
        this.navCtrl.setRoot('HomePage',null, {animation:"ios-transition"});
      }

      else{
        this.newService.getmessage().subscribe(data =>{
          this.message = data

    // console.log("pradimsg");
        if(this.message.length==0)
        {
          console.log("No messsages");
        }
        else
        {
          this.count=0;
         for(let i=0;i<this.message.length;i++)
         {
          // if(this.message[i].value.trans_status=='pending')


 if((this.message[i].value.trans_status=='pending' && this.Profiledata.mobilenumber==this.message[i].value.to &&this.message[i].value.type=='sending' )||
         (this.message[i].value.trans_status=='pending' && this.Profiledata.mobilenumber==this.message[i].value.to  && this.message[i].value.type=='moneyrequest'))


          // if((this.message[i].value.trans_status=="pending" && this.message[i].value.to==Profiledata.mobilenumber && this.message[i].from!=Profiledata.mobilenumber && this.message[i].value.type=='moneyrequest')||
          // (this.message[i].value.trans_status=="pending" && this.message[i].value.to==Profiledata.mobilenumber&& this.message[i].value.type=='sending') )
          {
            this.count++;
            // console.log(this.count);
          // console.log(this.a);
          }



         }

        //  console.log(this.count);
        //  console.log(this.a);

        }

        });
      }
    });
}

  // ngOnInit() {
  //   if(this.newService.getUserLoggedIn())
  //   {
  //   this.newService.getProfile().subscribe(data => {
  //     this.Menudata=data;

  // console.log(this.Menudata.name)
  // console.log(this.Menudata.email)
  //   });
  // }
  //   console.log("***********************")
  // }

  // openPage(page: PageInterface)
  // {
  //   // if(page.title=='LogoutPage')
  //   // {
  //   //   this.navCtrl.push('LoginPage')
  //   // }
  //   this.nav.setRoot(page.pageName)
  // }
  openPage(pager: any)
  {
    if(pager=='HomePage')
    {
      if(this.newService.getUserLoggedIn())
      {
        this.newService.setUserLogout();
        this.navCtrl.setRoot('HomePage',null, {animation:"ios-transition"})
      this.newService.logout().subscribe(data => {
        const res=data
        console.log(res)

      });
    }


    }
    else
    {
      this.navCtrl.push(pager,null, {animation:"ios-transition"})
    }

  }

  change()
  {
    this.clicked = !this.clicked;
  }

  push()
  {
    this.navCtrl.pop({animation: "ios-transition"});
  }
  ionViewDidLoad(){
   console.log("In menupage")
  }
  ionViewCanEnter() {
    if(!this.newService.getUserLoggedIn())
    {
      // let toast = this.toastCtrl.create({
      //   message: 'You are not logged in!!',
      //   duration: 3000,
      //   position: 'top'
      // });
      // toast.present();
      this.navCtrl.setRoot('HomePage',null, {animation:"ios-transition"});
    }
  }
  menuOpened()
  {
    console.log("MenuOpened")
    localStorage.setItem('menuopen','true')
  }
  menuClosed()
  {
    localStorage.setItem('menuopen','false')
    console.log("MenuClosed")
  }
  ionViewCanLeave(){
    if(this.loading)
    {
      this.loading.dismiss();
    }
   }


}
