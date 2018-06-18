import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DiscussionIPage } from './discussion-i';
import {LinksPageModule} from "../links/links.module";

@NgModule({
  declarations: [
    DiscussionIPage,
  ],
  imports: [
    IonicPageModule.forChild(DiscussionIPage),
    LinksPageModule
  ],
})
export class DiscussionIPageModule {}
