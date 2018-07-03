import {Component} from '@angular/core';
import {
    ActionSheetController,
    AlertController,
    IonicPage,
    LoadingController,
    NavController,
    NavParams
} from 'ionic-angular';
import {FriendsProvider} from "../../providers/friends/friends";
import {UsersProvider} from "../../providers/users/users";
import {NotificationsProvider} from "../../providers/notifications/notifications";
import {LinkProvider} from "../../providers/link/link";
import {myDate} from "../blog1/blog1";
import {DiscussionProvider} from "../../providers/discussion/discussion";

@IonicPage()
@Component({
    selector: 'page-discussion-i',
    templateUrl: 'discussion-i.html',
})
export class DiscussionIPage {

    public openFreind: boolean = false;
    public openChat: boolean = false;
    public openSearchBar: boolean = false;
    public openNotificationBar: boolean = false;
    public friendsRequest = [];
    public notifications = [];
    public user = [];
    public links = [];
    private lastLinks: number;
    public d: any;
    public create;
    public ago = [];
    private useLink;

    public discussionId;
    public categoryId;
    public categoryName;
    public discussionName;

    public likeImg: string = 'assets/svg/like-post-icon.svg';
    public commentImg: string = 'assets/icon/icon-chat1.png';
    public viewImg: string = 'assets/svg/speech-balloon-icon.svg';

    public changeCategory:boolean = false;
    public openCategory:boolean = false;
    public categories = [];
    public categoryI:number;
    public linkID:number = 0;

    public create_date: myDate = {
        day: null,
        month: null,
        year: null,
        minute: null,
        hours: null
    };
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

    //public changeCategory:boolean = false;


    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private _friend: FriendsProvider,
                private _notification: NotificationsProvider,
                private _users: UsersProvider,
                public _link: LinkProvider,
                public alertCtrl: AlertController,
                private loadingCtrl: LoadingController,
                private actionSheetCtrl: ActionSheetController,
                private _discussion: DiscussionProvider) {

        this.discussionId = this.navParams.data['discussionId'];
        this.categoryId = this.navParams.data['categoryId'];
        this.discussionName = this.navParams.data['discussionName']
        if (this.navParams.data['discussionName'] !== '') {
            this.discussionName = this.navParams.data['discussionName'];
        } else {
            this.discussionName = 'All Categories';
        }
        this.categoryName = 'All Categories';
    /*    if (this.navParams.data['categoryName'] !== '') {
            this.categoryName = this.navParams.data['categoryName'];
        } else {
            this.categoryName = 'All Categories';
        }
**/
        this.getDiscussionLink(this.categoryId, this.discussionId);
    }

    getLinkId() {

        console.log('get link')
        console.log(this.linkID);
    }
    doRefresh(refresher) {
        this.FriendsRequests();
        this.Notifications();
        setTimeout(() => {
            refresher.complete();
        }, 2000);
        this.getDiscussionLink(this.categoryId, this.discussionId);
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad UserSettingsPage');
        this.categoryName = 'All Categories';
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
        this.openCategory = false;
    }

    openSearch() {
        this.openSearchBar = !this.openSearchBar;
        this.openChat = false;
        this.openFreind = false;
        this.openNotificationBar = false;
        this.openCategory = false;
    }

    openChatMessege() {
        this.openChat = !this.openChat;
        this.openSearchBar = false;
        this.openFreind = false;
        this.openNotificationBar = false;
        this.openCategory = false;
    }

    openNotification() {
        this.openNotificationBar = !this.openNotificationBar;
        this.openSearchBar = false;
        this.openFreind = false;
        this.openChat = false;
        this.openCategory = false;
        this.Notifications();
    }

    allWindowClick() {
        this.openSearchBar = false;
        this.openFreind = false;
        this.openChat = false;
        this.openNotificationBar = false;
        this.openCategory = false;
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
            .subscribe(res => {
                infiniteScroll.complete();
                this.lastLinks = res['data']['links']['last_page'];
                console.log(this.lastLinks)
                for (let i = 2; i <= this.lastLinks; i++) {

                    this._link.getLink(i)
                        .subscribe(res => {
                            console.log(res)
                        })

                    infiniteScroll.enable(false)
                }
            })
    }

    getDiscussionLink(categoryId, discussionId) {
        this._link.getLinksByDiscussion(categoryId, discussionId)
            .subscribe(res => {
                console.log(res['data']['links']['data']);
                this.links = res['data']['links']['data'];
                this.links.forEach((value) => {

                    value['host'] = value['url'];
                    value['host'] = value['host'].slice((value['host'].search('/') + 2), value['host'].length);
                    value['host'] = value['host'].slice(0, value['host'].search('/'));
                    value['likeImg'] = this.likeImg;
                    value['commentImg'] = this.commentImg;
                    value['viewImg'] = this.viewImg;
                    if(value['tags'] !== null) {
                        value['tags'] = JSON.stringify(value['tags']).replace(/\\\"/g,'');
                        value['tags'] = value['tags'].replace(/\"/g,'');
                        value['tags'] = value['tags'].replace('[','')
                    }
                })
            })
    }

    createLink() {
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
                        /*
                        let loading = this.loadingCtrl.create({
                            content: 'Please wait...'
                        });
                        loading.present();*/
                        this.likeImg = 'assets/svg/like-post-icon.svg';
                        this.commentImg = 'assets/icon/icon-chat1.png';
                        this.viewImg = 'assets/svg/speech-balloon-icon.svg';
                        this._link.createLinkByDiscussion(this.categoryId, this.discussionId, data['Link url'])
                            .subscribe(res => {
                                console.log('create ');
                                console.log(res)
                                //loading.dismiss();
                                this.useLink = res['data']['link'];
                                console.log(this.useLink);
                                this.create_date = this.useLink['created_at'];
                                //  this.create_date.forEach((value) => {
                                this.d = new Date(this.useLink['created_at']);
                                this.create_day['day'] = this.d.getDate();
                                this.create_day['month'] = this.d.getMonth();
                                this.create_day['year'] = this.d.getFullYear();
                                this.create_day['minute'] = this.d.getMinutes();
                                this.create_day['hours'] = this.d.getHours();
                                //this.create.push(this.create_day);
                                this.create = this.create_date;
                                //   })
                                //this.create.forEach((value) => {
                                if (this.create['year'] < this.my_date['year']) {
                                    this.ago.push(this.my_date['year'] - this.create['year'] + ' YEARS AGO');
                                } else if (this.create['month'] < this.my_date['month']) {
                                    this.ago.push(this.my_date['month'] - this.create['month'] + ' MONTHS AGO');
                                } else if (this.create['day'] < this.my_date['day']) {
                                    this.ago.push(this.my_date['day'] - this.create['day'] + ' DAYS AGO');
                                } else if (this.create['hours'] < this.my_date['hours']) {
                                    this.ago.push(this.my_date['hours'] - this.create['hours'] + ' HOURS AGO');
                                } else if (this.create['minute'] < this.my_date['minute']) {
                                    this.ago.push(this.my_date['minute'] - this.create['minute'] + ' MINUTES AGO');
                                }
                                //})
                                /*for (let i = 0; i < this.useLink.length; i++) {
                                    this.links[i]['create_date'] = this.ago[i];
                                }*/
                                this.useLink['create_date'] = this.ago;

                                this.useLink['host'] = this.useLink['url'];
                                this.useLink['host'] = this.useLink['host'].slice((this.useLink['host'].search('/') + 2), this.useLink['host'].length);
                                this.useLink['host'] = this.useLink['host'].slice(0, this.useLink['host'].search('/'))
                                this.useLink['likeImg'] = this.likeImg;
                                this.useLink['commentImg'] = this.commentImg;
                                this.useLink['viewImg'] = this.viewImg;


                                this.links.push(this.useLink)
                                console.log('links after push');
                                console.log(this.links)


                            })
                        this.getDiscussionLink(this.categoryId, this.discussionId);

                    }
                }
            ]
        });
        prompt.present();
    }

    catchAndRelease(e, i) {
        let actionSheet = this.actionSheetCtrl.create({
            buttons: [
                {
                    text: 'Delete',
                    role: 'destructive',
                    //icon: !this.platform.is('ios') ? 'trash' : null,
                    handler: () => {
                        this._link.deleteLinkFromDiscussionList(this.links[0]['id'], this.discussionId, this.categoryId)
                            .subscribe((res) => {
                                console.log(res)
                                if (res['status'] === 'successMessage') {

                                }
                            })

                    }
                },
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                }
            ]
        });
        actionSheet.present();

    }

    openCategories() {

        this.changeCategory = false;
        this.openCategory = !this.openCategory;
        this.getCategories();
    }

    getCategories() {
        if (this.openCategory) {
            let loading = this.loadingCtrl.create({
                content: 'Please wait...'
            });

            loading.present();
            this._discussion.getDiscussionCategories(this.discussionId)
                .subscribe(res => {
                    // console.log(res)
                    if (res) {
                        console.log(res)
                        loading.dismiss();
                    }
                    this.categories = res['data'].categories;
                })
        }
    }


    allCategory() {
        this.likeImg = 'assets/svg/like-post-icon.svg';
        this.commentImg = 'assets/icon/icon-chat1.png';
        this.viewImg = 'assets/svg/speech-balloon-icon.svg';
        this.categoryName = "All Categories";

        setTimeout(() => {
                this.getDiscussionLink(null, this.discussionId  )
                this.openCategory = false;

            }, 500
        )
    }




    someCategory(i) {
        if(this.changeCategory ) {
            console.log('link id is here ' + this.linkID)
            console.log('change category is work');
            console.log('prew category name' + this.categoryName);
            console.log('new category name'+ this.categories[i].name);
            console.log('prew category id'+this.categoryId)
            console.log('new category id'+ this.categories[i].id);
            console.log(this.links);

        } else {
            console.log(' change categories does not work');

        }
        this.categoryName = this.categories[i].name;
        this.categoryId = this.categories[i].id;
        this.categoryI = i;
        this.likeImg = 'assets/svg/like-post-icon.svg';
        this.commentImg = 'assets/icon/icon-chat1.png';
        this.viewImg = 'assets/svg/speech-balloon-icon.svg';
        this.getDiscussionLink(this.categoryId, this.discussionId);
        setTimeout(() => {
            this.openCategory = false;
        }, 500);
    }
    change(){

        this.changeCategory = true;
        console.log(this.categoryName);
        console.log(this.linkID)

    }
    createCategory() {
        const prompt = this.alertCtrl.create({
            title: 'Add New Category',
            inputs: [
                {
                    name: 'Category name',
                    placeholder: 'Category name'
                },
            ],
            buttons: [
                {
                    text: 'Cancel',
                    handler: data => {
                      //  this.categoryValue = 'All Categories';
                    }
                },
                {
                    text: 'Save',
                    handler: data => {
                        this._discussion.createDiscussionCategories(this.discussionId,data['Category name'])
                            .subscribe(res => {
                              //  this.categoryValue = 'All Categories';
                                this.getCategories();
                            })
                      //  this.categoryValue = 'All Categories';
                    }
                }
            ]
        });
        prompt.present();
    }

    cancelCategory() {
        this.openCategory = false;
    }

    getLinkByCategoryName(value) {
        this.likeImg = 'assets/svg/like-post-icon.svg';
        this.commentImg = 'assets/icon/icon-chat1.png';
        this.viewImg = 'assets/svg/speech-balloon-icon.svg';
        this._link.getLinksByCategories(value)
            .subscribe(res => {
                this.links = res['data'].links['data'];
               /* this.links.forEach((value) => {
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
                }*/
                this.links.forEach((value) => {
                    value.host = value.url;
                    value.host = value.host.slice((value.host.search('/') + 2), value.host.length);
                    value.host = value.host.slice(0, value.host.search('/'));
                    value.likeImg = this.likeImg;
                    value.commentImg = this.commentImg;
                    value.viewImg = this.viewImg;
                })
            })
    }

    deleteCategory(i) {
        let actionSheet = this.actionSheetCtrl.create({
            buttons: [
                {
                    text: 'Delete',
                    role: 'destructive',
                    //icon: !this.platform.is('ios') ? 'trash' : null,
                    handler: () => {
                        // console.log(this.links);
                        // console.log(this.discussionId);
                        // console.log(this.categoryId);
/*
                        this._link.deleteLinkFromDiscussionList(this.links[0]['id'], this.discussionId, this.categoryId)
                            .subscribe((res) => {
                                console.log(res)
                                if (res['status'] === 'successMessage') {

                                }
                            })
*/
                    }
                },
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                }
            ]
        });
        actionSheet.present();

    }
}
