import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { QrscannerPage } from './qrscanner';

@NgModule({
  declarations: [
    QrscannerPage,
  ],
  imports: [
    IonicPageModule.forChild(QrscannerPage),
  ],
})
export class QrscannerPageModule {}
