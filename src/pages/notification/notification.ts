import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {UsersProvider} from "../../providers/users/users";
import {FriendsProvider} from "../../providers/friends/friends";
import {NotificationsProvider} from "../../providers/notifications/notifications";


@IonicPage()
@Component({
  selector: 'page-notification',
  templateUrl: 'notification.html',
})
export class NotificationPage {

    public openFreind:boolean = false;
    public openChat:boolean = false;
    public openSearchBar:boolean = false;
    public openNotificationBar:boolean = false;
    public friendsRequest = [];
    public notifications = [];
    public user = [];

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private _friend: FriendsProvider,
                private _notification: NotificationsProvider,
                private _users: UsersProvider) {
    }

    doRefresh(refresher) {
        this.FriendsRequests();
        this.Notifications();
        setTimeout(() => {
            refresher.complete();
        }, 2000);
    }

    ionViewDidLoad() {
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

    vv(e) {
        this.user['birthday'] = e['day']+'/'+e['month']+'/'+e['year'];
    }

    save() {
        console.log('save')
    }

    back() {
        this.navCtrl.setRoot('MenuPage')
    }

    lastNotificationPage:any;

    doInfiniteNotification(infiniteScroll) {
       this._notification.getNotifications(1)
            .subscribe(res => {
                infiniteScroll.complete();
                console.log(res);
                this.lastNotificationPage = res['notifications']['data'];
                for (let i = 2; i <= this.lastNotificationPage; i++) {
                    this._users.getUsersByPage(i)
                        .subscribe(res => {
                            res['notifications']['data'].data.forEach(value => {

                                this.notifications.push(value);
                            })
                        })
                    infiniteScroll.enable(false)
                }
            })
    }

    closeNote() {
        this.openNotificationBar = false;
    }

}
