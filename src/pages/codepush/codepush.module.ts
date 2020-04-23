import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CodepushPage } from './codepush';

@NgModule({
  declarations: [
    CodepushPage,
  ],
  imports: [
    IonicPageModule.forChild(CodepushPage),
  ],
})
export class CodepushPageModule {}
