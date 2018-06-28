import {Component, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams, Nav} from 'ionic-angular';
import {HomePage} from "../home/home";

import {Events} from 'ionic-angular';
import {UsersProvider} from "../../providers/users/users";

export interface PageInterface {
    title: string,
    pageName: string,
    icon: string,
    index: number
}

export interface User {
    avatar: string,
    name: string
    last_name: string,
    username: string,

}

@IonicPage()
@Component({
    selector: 'page-menu',
    templateUrl: 'menu.html',
})
export class MenuPage {
    us: any;
    user: User = {
        avatar: undefined,
        name: undefined,
        last_name: undefined,
        username: undefined,

    };

    rootPage = '';

    @ViewChild(Nav) nav: Nav;

    pages: PageInterface[] = [
        {
            title: 'Settings',
            pageName: 'UserSettingsPage',
            icon: 'star',
            index: 0
        },
        {
            title: 'Links',
            pageName: 'Blog1Page',
            icon: 'star',
            index: 1
        },
        {
            title: 'Tab 1',
            pageName: 'Tab1Page',
            icon: 'star',
            index: 2
        },
        {
            title: 'Tab 2',
            pageName: 'Tab2Page',
            icon: 'star',
            index: 3
        },

    ];

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public _user: UsersProvider,
                public events: Events) {
        if (localStorage.getItem('token') === null) {
            this.navCtrl.setRoot(HomePage);
        }
        this.rootPage = 'Blog1Page'
    }

    ionViewDidLoad() {
        console.log('menu page');
        console.log(this.rootPage)
        this.getUser();
    }

    openPage(page: PageInterface) {
        let params = {};

        if (page.index) {
            params = {tabIndex: page.index}
        }

        if (this.nav.getActiveChildNav() && page.index != undefined) {
            this.nav.getActiveChildNav().select(page.index);
        } else {
            this.nav.setRoot(page.pageName, params)
        }
    }

    isActive(page: PageInterface) {

    }

    getUser() {
        this._user.getUser()
            .subscribe(res => {
                this.us = res['data']['user'];
                this.user.avatar = this.us['avatar'];
                this.user.name = this.us['name'];
                this.user.last_name = this.us['last_name'];
                this.user.username = this.us['username'];
            })
    }

    logout() {
        localStorage.removeItem('token');
        this.navCtrl.setRoot(HomePage);
    }

    goToPersonPage() {

        //this.rootPage = 'UserSettingsPage';
        this.navCtrl.setRoot(this.pages[this.pages.length-1].pageName)
        //this.navCtrl.setRoot('UserSettingsPage');
        //console.log(this.rootPage);
    }

}
