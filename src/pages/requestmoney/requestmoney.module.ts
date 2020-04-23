import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RequestmoneyPage } from './requestmoney';

@NgModule({
  declarations: [
    RequestmoneyPage,
  ],
  imports: [
    IonicPageModule.forChild(RequestmoneyPage),
  ],
})
export class RequestmoneyPageModule {}
