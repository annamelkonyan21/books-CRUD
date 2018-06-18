import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {FriendsProvider} from "../../providers/friends/friends";
import {UsersProvider} from "../../providers/users/users";
import {NotificationsProvider} from "../../providers/notifications/notifications";
import { LinkProvider } from "../../providers/link/link";
import {myDate} from "../blog1/blog1";

@IonicPage()
@Component({
  selector: 'page-discussion-i',
  templateUrl: 'discussion-i.html',
})
export class DiscussionIPage {

    public openFreind:boolean = false;
    public openChat:boolean = false;
    public openSearchBar:boolean = false;
    public openNotificationBar:boolean = false;
    public friendsRequest = [];
    public notifications = [];
    public user = [];
    public links = [];
    private lastLinks:number;
    public create_date = [];
    public d: any;
    public create = [];
    public ago = [];

    public create_day: myDate = {
        day: null,
        month: null,
        year: null,
        minute: null,
        hours: null
    };
    public my_date: myDate = {
        day: null,
        month: null,
        year: null,
        minute: null,
        hours: null
    };


    public  discussionId;
    public categoryId;
    public likeImg:string = 'assets/svg/like-post-icon.svg';
    public commentImg:string = 'assets/icon/icon-chat1.png';
    public viewImg:string = 'assets/svg/speech-balloon-icon.svg';

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private _friend: FriendsProvider,
                private _notification: NotificationsProvider,
                private _users: UsersProvider,
                public _link: LinkProvider,
                public alertCtrl: AlertController) {
      this.discussionId = this.navParams.data['discussionId'];
      this.categoryId = this.navParams.data['categoryId'];
      this.getDiscussionLink();
    }


    doRefresh(refresher) {
        this.FriendsRequests();
        this.Notifications();
        setTimeout(() => {
            refresher.complete();
        }, 2000);
        this.getDiscussionLink();
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad UserSettingsPage');
        this.User();
        this.Notifications();
        this.FriendsRequests();
    }

    User() {
        this._users.getUser()
            .subscribe(res => {
                this.user = res['data'].user;
            })
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

        this.Notifications();
    }

    allWindowClick() {
        this.openSearchBar = false;
        this.openFreind = false;
        this.openChat = false;
        this.openNotificationBar = false;

    }

    FriendsRequests() {
        this._friend.getFriendsRequests()
            .subscribe(res => {
                this.friendsRequest = res['users']['data'];
            })
    }

    Notifications() {
        this._notification.getNotifications(1)
            .subscribe(res => {
                this.notifications = res['notifications']['data'];
            })
    }

    goToNotifications(s) {
      this.navCtrl.setRoot('NotificationPage')
    }

    doInfiniteLinks(infiniteScroll) {
        this._link.getLink(1)
            .subscribe(res=> {
                infiniteScroll.complete();
                this.lastLinks = res['data']['links']['last_page'];
                console.log(this.lastLinks)
                for (let i = 2; i <= this.lastLinks; i++) {

                    this._link.getLink(i)
                        .subscribe(res => {
                            res['data']['links']['data'].forEach(value => {
                                this.links.push(value);
                                this.create_date.push(value['created_at']);
                                // this.create_date.push(value['created_at'])

                                this.create_date.forEach((value) => {
                                    this.d = new Date(value);
                                    this.create_day['day'] = this.d.getDate();
                                    this.create_day['month'] = this.d.getMonth();
                                    this.create_day['year'] = this.d.getFullYear();
                                    this.create_day['minute'] = this.d.getMinutes();
                                    this.create_day['hours'] = this.d.getHours();
                                    this.create.push(this.create_day);

                                })
                                this.create.forEach((value) => {
                                    if (value['year'] < this.my_date['year']) {
                                        this.ago.push(this.my_date['year'] - value['year'] + ' YEARS AGO');
                                    } else if (value['month'] < this.my_date['month']) {
                                        this.ago.push(this.my_date['month'] - value['month'] + ' MONTHS AGO');
                                    } else if (value['day'] < this.my_date['day']) {
                                        this.ago.push(this.my_date['day'] - value['day'] + ' DAYS AGO');
                                    } else if (value['hours'] < this.my_date['hours']) {
                                        this.ago.push(this.my_date['hours'] - value['hours'] + ' HOURS AGO');
                                    } else if (value['minute'] < this.my_date['minute']) {
                                        this.ago.push(this.my_date['minute'] - value['minute'] + ' MINUTES AGO');
                                    }
                                })
                                value.host = value.url;
                                value.host = value.host.slice((value.host.search('/') + 2), value.host.length);
                                value.host = value.host.slice(0, value.host.search('/'))
                                value.likeImg = this.likeImg;
                                value.commentImg = this.commentImg;
                                value.viewImg = this.viewImg;
                            })
                            for (let i = 0; i < this.links.length; i++) {
                                this.links[i]['create_date'] = this.ago[i];
                            }
                            console.log('links');
                            console.log(this.links)
                        })

                    infiniteScroll.enable(false)
                }
            })
    }


    getDiscussionLink() {
        this._link.getLinksByDiscussion(this.categoryId, this.discussionId)
            .subscribe(res => {
                this.links = res['data'].links['data']
                this.links.forEach((value) => {
                    this.create_date.push(value['created_at'])
                })
                this.create_date.forEach((value) => {
                    this.d = new Date(value);
                    this.create_day['day'] = this.d.getDate();
                    this.create_day['month'] = this.d.getMonth();
                    this.create_day['year'] = this.d.getFullYear();
                    this.create_day['minute'] = this.d.getMinutes();
                    this.create_day['hours'] = this.d.getHours();
                    this.create.push(this.create_day);

                })
                this.create.forEach((value) => {
                    if (value['year'] < this.my_date['year']) {
                        this.ago.push(this.my_date['year'] - value['year'] + ' YEARS AGO');
                    } else if (value['month'] < this.my_date['month']) {
                        this.ago.push(this.my_date['month'] - value['month'] + ' MONTHS AGO');
                    } else if (value['day'] < this.my_date['day']) {
                        this.ago.push(this.my_date['day'] - value['day'] + ' DAYS AGO');
                    } else if (value['hours'] < this.my_date['hours']) {
                        this.ago.push(this.my_date['hours'] - value['hours'] + ' HOURS AGO');
                    } else if (value['minute'] < this.my_date['minute']) {
                        this.ago.push(this.my_date['minute'] - value['minute'] + ' MINUTES AGO');
                    }
                })
                for (let i = 0; i < this.links.length; i++) {
                    this.links[i]['create_date'] = this.ago[i];
                }
                this.links.forEach((value) => {
                    value.host = value.url;
                    value.host = value.host.slice((value.host.search('/') + 2), value.host.length);
                    value.host = value.host.slice(0, value.host.search('/'))
                    value.likeImg = this.likeImg;
                    value.commentImg = this.commentImg;
                    value.viewImg = this.viewImg;
                })
                console.log('links');
                console.log(this.links)



            })
    }


    createLink() {
        // this.openLinks = true;
        const prompt = this.alertCtrl.create({
            title: 'Add New Link',
            inputs: [
                {
                    name: 'Link url',
                    placeholder: 'Link Url'
                },
            ],
            buttons: [
                {
                    text: 'Cancel',
                    handler: data => {
                        // this.openLinks = false;
                    }
                },
                {
                    text: 'Save',
                    handler: data => {
                        // console.log(this.categoryName);
                        this._link.createLinkByDiscussion(this.categoryId, this.discussionId, data['Link url'])
                            .subscribe(res => {
                                console.log(res);
                            this.getDiscussionLink();})
                    }
                }
            ]
        });
        prompt.present();
    }
}
