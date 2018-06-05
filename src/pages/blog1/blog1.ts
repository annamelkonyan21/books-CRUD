import {Component, ViewChild} from '@angular/core';
import {IonicPage, MenuController, NavController, NavParams, Platform} from 'ionic-angular';
import {HomePage} from "../home/home";
import {LinkProvider} from "../../providers/link/link";

export interface myDate  {
    day: number,
    month: number,
    year: number,
    minute: number,
    hours: number
}

@IonicPage()
@Component({
    selector: 'page-blog1',
    templateUrl: 'blog1.html',
    providers: [LinkProvider]
})

export class Blog1Page {
    public links: any;
    public users: any;
    isAndroid: boolean;
    searchOpen: boolean = false;
    @ViewChild('search') search;
    create_date = [];
    create = [];
    Dat:Date = new Date();
    my_date: myDate =  {
        day: null,
        month: null,
        year: null,
        minute: null,
        hours: null
    };

    create_day:myDate = {
        day: null,
        month: null,
        year: null,
        minute: null,
        hours: null
    }

    d:any;
    ago = [];
    urles = [];
    chats = [];
    openFreind: boolean = false;
    openSearchBar: boolean = false;
    openChat: boolean = false;
    openNotificationBar: boolean = false;
    categories = [];

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public _link: LinkProvider,
                public menu: MenuController,
                public platform: Platform) {
        this.isAndroid = platform.is('android');
        console.log('blog 1');
        console.log(this.navCtrl)
    }



    doRefresh(refresher) {
        this.Links();
        setTimeout(() => {
            console.log('Async operation has ended');
            refresher.complete();
        }, 2000);
    }


    ionViewDidLoad() {

        if (localStorage.getItem('token') === null) {
            this.navCtrl.push(HomePage);
        }
        this.Links();
        this.Users();
        this.my_date['day'] = this.Dat.getDate();
        this.my_date['month'] = this.Dat.getMonth();
        this.my_date['year'] = this.Dat.getFullYear();
        this.my_date['minute'] = this.Dat.getMinutes();
        this.my_date['hours'] = this.Dat.getHours();
        this.getCategories();
    }

    Links() {
        this._link.getLink()
            .subscribe(res => {
                this.links = res['data'].links;
                this.links.forEach((value) => {
                    this.create_date.push(value['created_at'])
                })
                this.create_date.forEach((value) => {
                    this.d = new Date(value) ;
                    this.create_day['day'] = this.d.getDate();
                    this.create_day['month'] = this.d.getMonth();
                    this.create_day['year'] = this.d.getFullYear();
                    this.create_day['minute'] = this.d.getMinutes();
                    this.create_day['hours'] = this.d.getHours();
                    this.create.push(this.create_day);

                })
                this.create.forEach((value) => {
                    if(value['year']< this.my_date['year']) {
                        this.ago.push(this.my_date['year']-value['year']+' YEARS AGO');
                    } else if (value['month']< this.my_date['month']) {
                        this.ago.push(this.my_date['month']-value['month']+' MONTHS AGO');
                    } else if (value['day']< this.my_date['day']) {
                        this.ago.push(this.my_date['day']-value['day']+' DAYS AGO');
                    }  else if (value['hours']< this.my_date['hours']) {
                        this.ago.push(this.my_date['hours']-value['hours']+' HOURS AGO');
                    } else if (value['minute']< this.my_date['minute']) {
                        this.ago.push(this.my_date['minute']-value['minute']+' MINUTES AGO');
                    }
                })
                for(let i = 0; i<this.links.length; i++) {
                    this.links[i]['create_date'] = this.ago[i];
                }
                this.links.forEach((value)=> {
                    value.host = value.url;
                    value.host = value.host.slice((value.host.search('/')+2), value.host.length);
                    value.host = value.host.slice(0,value.host.search('/'))
                })
            })
    }

    Users() {
        this._link.getUser()
            .subscribe(res => {
                this.users = res['data'].user;
            })

    }

    goTo() {
        this.navCtrl.setRoot('Tab1Page')
    }

    onInput(ev) {
    }

    openFriendRequest() {
        this.openFreind = !this.openFreind;
        this.openChat = false;
        this.openSearchBar = false;
        this.openNotificationBar = false;
    }

    openSearch() {
        this.openSearchBar = !this.openSearchBar;
        this.openChat = false;
        this.openFreind = false;
        this.openNotificationBar = false;
    }

    openChatMessege() {
        this.openChat = !this.openChat;
        this.openSearchBar = false;
        this.openFreind = false;
        this.openNotificationBar = false;
    }

    openNotification() {
        this.openNotificationBar = !this.openNotificationBar;
        this.openSearchBar = false;
        this.openFreind = false;
        this.openChat = false;
    }

    getCategories() {
        this._link.getUserCategories()
            .subscribe(res => {this.categories = res['data'].categories;})
    }

    allWindowClick(ev) {
        this.openSearchBar = false;
        this.openFreind = false;
        this.openChat = false;
        this.openNotificationBar = false;
    }

    mmm(event)  {
        console.log(event);
    }

    vv(event) {
       console.log(event);
    }
}

