import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SendmoneyPage } from './sendmoney';

@NgModule({
  declarations: [
    SendmoneyPage,
  ],
  imports: [
    IonicPageModule.forChild(SendmoneyPage),
  ],
})
export class SendmoneyPageModule {}
