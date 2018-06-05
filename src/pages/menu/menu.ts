import {Component, ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams, Nav } from 'ionic-angular';
import {HomePage} from "../home/home";
import {LinkProvider} from "../../providers/link/link";
import { Events } from 'ionic-angular';

export interface PageInterface  {
  title: string,
  pageName: string,
  icon: string
}

export interface  User {
    avatar: string,
    name: string
    last_name: string,
    username: string
}

@IonicPage()
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage {
  us:any;
  user: User = {
      avatar: undefined,
      name: undefined,
      last_name: undefined,
      username: undefined
  };

  rootPage= 'Blog1Page';

  @ViewChild(Nav) nav: Nav;

  pages: PageInterface[] = [
      {
          title: 'Blog',
          pageName: 'Blog1Page',
          icon: 'star'
      },
      {
          title: 'Tab 1',
          pageName: 'Tab1Page',
          icon: 'star'
      },
      {
          title: 'Tab 2',
          pageName: 'Tab2Page',
          icon: 'star'
      }
  ];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public link: LinkProvider,
              public events: Events) {
      if (localStorage.getItem('token') === null) {
          this.navCtrl.setRoot(HomePage);
      }
      console.log('menu page')
      console.log(this.navCtrl)

  }

  ionViewDidLoad() {
      this.getUser();
  }

  openPage(page: PageInterface) {

  }

  isActive(page: PageInterface) {

  }

  getUser() {
      this.link.getUser()
          .subscribe(res => {
              this.us = res['data']['user'];
              this.user.avatar = this.us['avatar'];
              this.user.name = this.us['name'];
              this.user.last_name = this.us['last_name'];
              this.user.username = this.us['username'];
          })
  }

  logout(){
    localStorage.removeItem('token');
    this.navCtrl.setRoot(HomePage)
  }

  menuOpened() {

      this.events.publish('menu:closed', '');
      console.log(this.events)
  }

  menuClosed() {
      this.events.publish('menu:opened', '');
      console.log(this.events)
  }
}
