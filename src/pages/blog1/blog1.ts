import {Component, OnInit, ViewChild} from '@angular/core';
import {
    AlertController, IonicPage, LoadingController, MenuController, NavController, NavParams,
    Platform
} from 'ionic-angular';
import {HomePage} from "../home/home";
import {LinkProvider} from "../../providers/link/link";
import {ActionSheetController} from 'ionic-angular';
import {InAppBrowser} from '@ionic-native/in-app-browser';
import {DiscussionProvider} from "../../providers/discussion/discussion";
import {FriendsProvider} from "../../providers/friends/friends";
import {UsersProvider} from "../../providers/users/users";
import {NotificationsProvider} from "../../providers/notifications/notifications";

export interface myDate {
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
    providers: [LinkProvider, InAppBrowser, FriendsProvider, DiscussionProvider],

})

export class Blog1Page implements OnInit {

    public links: any;
    public user: any;
    public isAndroid: boolean;
    public searchOpen: boolean = false;
    public create_date = [];
    public create = [];
    public Dat: Date = new Date();
    public blaka = ['fhdsjfh', 'dsd']
    public my_date: myDate = {
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
    public d: any;
    public ago = [];
    public urles = [];
    public chats = [];
    public openFreind: boolean = false;
    public openSearchBar: boolean = false;
    public openChat: boolean = false;
    public openNotificationBar: boolean = false;
    public categories = [];
    public categoryValue: any;
    public data = {
        categories: []
    };
    public openCategory: boolean = false;
    public categoryName: string = '';
    public categoryId: number;
    public categoryI: number;
    public openLinks: boolean = false;
    public likeImg: string = '';
    public commentImg: string = '';
    public viewImg: string = '';
    public pos: boolean = true;
    public nav: string = 'links'
    public discussions = [];
    public friendsRequest = [];
    public friends = [];
    public notifications = [];
    public usersList = [];
    public sendFriendRequest: boolean = false;
    private lastUserListPage: number;
    private lasrFriendsPage: number;
    private lastLinks: number;
    private lastDiscussion: number;
    public discussionUsers = [];
    private discussionUsersId: number[] = [];
    public userDisLenght:number;

    @ViewChild('search') search;
    @ViewChild('select') select;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public _link: LinkProvider,
                public _discussion: DiscussionProvider,
                public menu: MenuController,
                public platform: Platform,
                public actionSheetCtrl: ActionSheetController,
                public alertCtrl: AlertController,
                public loadingCtrl: LoadingController,
                public iab: InAppBrowser,
                public _friend: FriendsProvider,
                public _users: UsersProvider,
                public _notification: NotificationsProvider) {
        this.isAndroid = platform.is('android');
        this.likeImg = 'assets/svg/like-post-icon.svg';
        this.commentImg = 'assets/icon/icon-chat1.png';
        this.viewImg = 'assets/svg/speech-balloon-icon.svg';
    }

    ngOnInit() {
        this.Links();
    }

    doRefresh(refresher) {
        this.likeImg = 'assets/svg/like-post-icon.svg';
        this.commentImg = 'assets/icon/icon-chat1.png';
        this.viewImg = 'assets/svg/speech-balloon-icon.svg';
        this.pos = true;
        this.FriendsRequests();
        this.Notifications();
        if (this.categoryName === '' || this.categoryName === 'All Categories') {
            this.pos = true;
            this.Links();
        } else {
            this.pos = true;
            this.getLinkByCategoryName(this.categoryId);
        }
        if (this.nav === 'discussions') {
            this.getDiscussionWithoutLoading();
        } else if (this.nav === 'friends') {
            this.Friends();
        } else if (this.nav === 'users') {
            this.Users();
        }

        setTimeout(() => {
            refresher.complete();
        }, 2000);
    }


    doInfiniteUsersList(infiniteScroll) {
        this._users.getUsersWithoutPage()
            .subscribe(res => {
                infiniteScroll.complete();
                this.lastUserListPage = res['users']['last_page'];
                for (let i = 2; i <= this.lastUserListPage; i++) {
                    this._users.getUsersByPage(i)
                        .subscribe(res => {
                            res['users'].data.forEach(value => {

                                this.usersList.push(value);
                            })
                        })
                    infiniteScroll.enable(false)
                }
            })
    }

    doInfiniteFriends(infiniteScroll) {
        this._friend.getFriendsWithoutPage()
            .subscribe(res => {
                infiniteScroll.complete();
                this.lasrFriendsPage = res['users']['last_page'];
                for (let i = 2; i <= this.lasrFriendsPage; i++) {
                    this._friend.getFriendsByPage(i)
                        .subscribe(res => {
                            res['users'].data.forEach(value => {
                                value['sendFriendRequest'] = false;
                                this.friends.push(value);
                            })
                        })
                    infiniteScroll.enable(false)
                }
            })
    }

    doInfiniteDiscussion(infiniteScroll) {
        this._discussion.getUserDiscussion(1)
            .subscribe(res => {
                infiniteScroll.complete();
                console.log(res);
                this.lastDiscussion = res['data']['discussions']['last_page'];
                console.log(this.lastDiscussion);
                for (let i = 2; i <= this.lastDiscussion; i++) {
                    this._discussion.getUserDiscussion(i)
                        .subscribe(res => {

                            res['data']['discussions']['data'].forEach(el => {
                                //value['sendFriendRequest'] = false;
                                this.discussions.push(el);
                                el['headerImg'] = 'assets/imgs/logo_small.png';
                                el['friends'] = [
                                    'assets/imgs/friend-harmonic10.jpg',
                                    'assets/imgs/friend-harmonic7.jpg',
                                    'assets/imgs/friend-harmonic8.jpg',
                                    'assets/imgs/friend-harmonic2.jpg',
                                    'assets/imgs/avatar30-sm.jpg',
                                    'assets/imgs/avatar30-sm.jpg'
                                ];
                                el.addFriends = 'assets/svg/happy-face-icon.svg';
                                el.settings = 'assets/svg/settings-icon.svg';
                                el.more = 'assets/svg/three-dots-icon.svg';
                                el.openmore = false;

                            })
                        })
                    infiniteScroll.enable(false)
                }
            })
    }

    doInfiniteLinks(infiniteScroll) {
        this._link.getLink(1)
            .subscribe(res => {

                infiniteScroll.complete();
                this.lastLinks = res['data']['links']['last_page'];
                for (let i = 2; i <= this.lastLinks; i++) {

                    this._link.getLink(i)
                        .subscribe(res => {
                            res['data']['links']['data'].forEach(value => {
                                this.links.push(value);
                                this.create_date.push(value['created_at']);

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


    ionViewDidLoad() {
        if (localStorage.getItem('token') === null) {
            this.navCtrl.push(HomePage);
        }
        this.likeImg = 'assets/svg/like-post-icon.svg';
        this.commentImg = 'assets/icon/icon-chat1.png';
        this.viewImg = 'assets/svg/speech-balloon-icon.svg';
        this.Links();

        this.User();
        //this.Users();
        //  this.Friends();
        this.SendFrienadRequest();
        this.FriendsRequests();
        this.Notifications();
        this.my_date['day'] = this.Dat.getDate();
        this.my_date['month'] = this.Dat.getMonth();
        this.my_date['year'] = this.Dat.getFullYear();
        this.my_date['minute'] = this.Dat.getMinutes();
        this.my_date['hours'] = this.Dat.getHours();

    }

    setNav(nav) {
        console.log(nav)
        this.nav = nav;
        if (this.nav === 'discussions') {
            this.getDiscussion();
        }
        if (this.nav === 'links') {
            this.discussions.forEach((element) => {
                element.openmore = false;
            })
            console.log(this.discussions);
        }
    }

    Links() {
        this.likeImg = './assets/svg/like-post-icon.svg';
        this.commentImg = './assets/icon/icon-chat1.png';
        this.viewImg = './assets/svg/speech-balloon-icon.svg';
        this._link.getLink(1)
            .subscribe(res => {


                this.links = res['data']['links']['data'];
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

    User() {
        this._users.getUser()
            .subscribe(res => {
                console.log('user')
                this.user = res['data'].user;
                console.log(res);
            })
    }

    goTo() {
        this.navCtrl.setRoot('Tab1Page')
    }

    onInput(ev) {
    }

    getCategories() {
        if (this.openCategory) {
            let loading = this.loadingCtrl.create({
                content: 'Please wait...'
            });

            loading.present();
            this._link.getUserCategories()
                .subscribe(res => {
                    // console.log(res)
                    if (res) {
                        console.log(res)
                        loading.dismiss();
                    }
                    this.data.categories = res['data'].categories;
                })
        }
    }

    openFriendRequest() {
        this.openFreind = !this.openFreind;
        this.openChat = false;
        this.openSearchBar = false;
        this.openNotificationBar = false;
        this.openCategory = false;
        this.FriendsRequests();
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
        this.openLinks = false;
    }

    presentActionSheet(ev, i) {
        let actionSheet = this.actionSheetCtrl.create({
            buttons: [
                {
                    text: 'Delete',
                    role: 'destructive',
                    icon: !this.platform.is('ios') ? 'trash' : null,
                    handler: () => {
                        console.log(this.links)
                        this._link.deleteLinkFromList(this.links[i].id, this.links[i].pivot['category_id'])
                            .subscribe(res => {
                                if (res['status'] === 'successMessage') {
                                    this.Links();
                                }
                            })
                    }
                },
                {
                    text: 'Cancel',
                    role: 'cancel', // will always sort to be on the bottom
                    icon: !this.platform.is('ios') ? 'close' : null,
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                }
            ]
        });
        actionSheet.present();
    }

    linkCategory() {
        if (this.categoryValue === 'All Categories') {
            this.Links();
        } else if (this.categoryValue === 'Create category') {
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
                            this.categoryValue = 'All Categories';
                        }
                    },
                    {
                        text: 'Save',
                        handler: data => {
                            this._link.createCategory(data['Category name'])
                                .subscribe(res => {
                                    this.categoryValue = 'All Categories';
                                    this.getCategories();
                                })
                            this.categoryValue = 'All Categories';
                        }
                    }
                ]
            });
            prompt.present();
            this.categoryValue = 'All Categories';
        }
        else {
            this.getLinkByCategoryName(this.categoryValue);
        }
    }

    getLinkByCategoryName(value) {
        console.log(value);
        this.likeImg = 'assets/svg/like-post-icon.svg';
        this.commentImg = 'assets/icon/icon-chat1.png';
        this.viewImg = 'assets/svg/speech-balloon-icon.svg';
        this._link.getLinksByCategories(value)
            .subscribe(res => {
                console.log(res);
                this.links = res['data'].links['data'];
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
                    value.host = value.host.slice(0, value.host.search('/'));
                    value.likeImg = this.likeImg;
                    value.commentImg = this.commentImg;
                    value.viewImg = this.viewImg;
                })
            })
    }

    openCategories() {
        this.openCategory = !this.openCategory;
        this.getCategories();
    }

    allCategory() {
        this.likeImg = 'assets/svg/like-post-icon.svg';
        this.commentImg = 'assets/icon/icon-chat1.png';
        this.viewImg = 'assets/svg/speech-balloon-icon.svg';
        this.categoryName = "All Categories";
        setTimeout(() => {
                this.Links();
                this.openCategory = false;

            }, 500
        )
    }

    someCategory(i) {
        console.log('nno')
        this.categoryName = this.data.categories[i].name;
        this.categoryId = this.data.categories[i].id;
        this.categoryI = i;
        this.likeImg = 'assets/svg/like-post-icon.svg';
        this.commentImg = 'assets/icon/icon-chat1.png';
        this.viewImg = 'assets/svg/speech-balloon-icon.svg';
        this.getLinkByCategoryName(this.categoryId);
        setTimeout(() => {
            this.openCategory = false;
        }, 500);
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
                        this.categoryValue = 'All Categories';
                    }
                },
                {
                    text: 'Save',
                    handler: data => {
                        this._link.createCategory(data['Category name'])
                            .subscribe(res => {
                                this.categoryValue = 'All Categories';
                                this.getCategories();
                            })
                        this.categoryValue = 'All Categories';
                    }
                }
            ]
        });
        prompt.present();
    }

    cancelCategory() {
        this.openCategory = false;
    }

    openWithBrowser(i) {
        let browser = this.iab.create(this.links[i].url, '_blank');
        browser.on('loadstart').subscribe(event => {
            console.log("loadstart -->", event);
        }, err => {
            console.log("InAppBrowser loadstart Event Error: " + err);
        });
    }

    createLink() {
        this.openLinks = true;
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
                        this.openLinks = false;
                    }
                },
                {
                    text: 'Save',
                    handler: data => {
                        console.log(this.categoryName);
                        let loading = this.loadingCtrl.create({
                            content: 'Please wait...'
                        });
                        loading.present();
                        if (this.categoryName === '' || this.categoryName === 'All Categories') {
                            this.likeImg = 'assets/svg/like-post-icon.svg';
                            this.commentImg = 'assets/icon/icon-chat1.png';
                            this.viewImg = 'assets/svg/speech-balloon-icon.svg';
                            this._link.createLinks(data['Link url'])
                                .subscribe(res => {
                                    console.log(res);

                                    this.openLinks = false;
                                    this.Links();
                                    loading.dismiss()
                                })
                            this.openLinks = false;
                        } else {
                            this.likeImg = 'assets/svg/like-post-icon.svg';
                            this.commentImg = 'assets/icon/icon-chat1.png';
                            this.viewImg = 'assets/svg/speech-balloon-icon.svg';
                            this._link.createLinksWithCategory(this.categoryId, data['Link url'])
                                .subscribe(res => {
                                    console.log(res);
                                    this.getLinkByCategoryName(this.categoryId);
                                    this.openLinks = false;
                                    loading.dismiss();
                                })
                        }
                    }
                }
            ]
        });
        prompt.present();
    }


    getDiscussion() {
        let loading = this.loadingCtrl.create({
            content: 'Please wait...'
        });
        loading.present();
        this._discussion.getUserDiscussion(1)
            .subscribe(res => {
                if (res['status'] === 'success') {
                    loading.dismiss();
                    this.discussions = res['data']['discussions']['data'];
                    console.log('diss');
                    console.log(this.discussions);


                    this.discussions.forEach((value) => {

                        value['headerImg'] = 'assets/imgs/logo_small.png';

                        value.addFriends = 'assets/svg/happy-faces-icon.svg';
                        value.settings = 'assets/svg/settings-icon.svg';
                        value.more = 'assets/svg/three-dots-icon.svg';
                        value.openmore = false;
                        value.userDisLenght1 = value['users'].length;
                        if(value.userDisLenght1>5){
                            value.users.splice(5,value.userDisLenght1-1)
                        }
                        value.userDisLenght2 = value.userDisLenght1 - 5;
                    })

                    /*   this.discussions.forEach((el) => {


                           el['friends'] = [
                               'assets/imgs/friend-harmonic10.jpg',
                               'assets/imgs/friend-harmonic7.jpg',
                               'assets/imgs/friend-harmonic8.jpg',
                               'assets/imgs/friend-harmonic2.jpg',
                               'assets/imgs/avatar30-sm.jpg',
                               'assets/imgs/avatar30-sm.jpg'
                           ];

                       })*/
                }
            })
    }

    getDiscussionWithoutLoading() {
        this._discussion.getUserDiscussion(1)
            .subscribe(res => {
                if (res['status'] === 'success') {
                    this.discussions = res['data']['discussions']['data'];
                    this.discussions.forEach((el) => {
                        el['headerImg'] = 'assets/imgs/logo_small.png';
                        el['friends'] = [
                            'assets/imgs/friend-harmonic10.jpg',
                            'assets/imgs/friend-harmonic7.jpg',
                            'assets/imgs/friend-harmonic8.jpg',
                            'assets/imgs/friend-harmonic2.jpg',
                            'assets/imgs/avatar30-sm.jpg',
                            'assets/imgs/avatar30-sm.jpg'
                        ];
                        el.addFriends = 'assets/svg/happy-faces-icon.svg';
                        el.settings = 'assets/svg/settings-icon.svg';
                        el.more = 'assets/svg/three-dots-icon.svg';
                        el.openmore = false;
                    })
                }
            })

    }

    someDiscussions(i) {
        this.discussions.forEach((element) => {
            element.openmore = false;
            //console.log(element.openmore)
        })
        this.openSearchBar = false;
        this.openFreind = false;
        this.openChat = false;
        this.openNotificationBar = false;
    }

    createDiscussions() {
        this.discussions.forEach((element) => {
            element.openmore = false;
        })
        const prompt = this.alertCtrl.create({
            title: 'Add New Discussions',
            inputs: [
                {
                    name: 'Discussions',
                    placeholder: 'Discussions '
                },
            ],
            buttons: [
                {
                    text: 'Cancel',
                    handler: data => {
                    }
                },
                {
                    text: 'Save',
                    handler: data => {
                        this._discussion.createDiscussion(data['Discussions'])
                            .subscribe(res => {
                                this.getDiscussion();
                            })
                    }
                }
            ]
        });
        prompt.present();

    }

    openMore(i) {
        this.discussions[i].openmore = true;
    }

    deleteDiscussions(i) {
        let actionSheet = this.actionSheetCtrl.create({
            buttons: [
                {
                    text: 'Delete',
                    role: 'destructive',
                    icon: !this.platform.is('ios') ? 'trash' : null,
                    handler: () => {
                        //       console.log(this.discussions[i].id);
                        this._discussion.deleteDiscussion(this.discussions[i].id)
                            .subscribe(res => {
                                console.log(res);
                                if (res['status'] === 'successMessage') {
                                    this.getDiscussion();
                                }
                            })
                    }
                },
                {
                    text: 'Cancel',
                    role: 'cancel', // will always sort to be on the bottom
                    icon: !this.platform.is('ios') ? 'close' : null,
                    handler: () => {
                        //    console.log('Cancel clicked');
                    }
                }
            ]
        });
        actionSheet.present();
    }

    Users() {
        this.nav = 'users';
        let loading = this.loadingCtrl.create({
            content: 'Please wait...'
        });

        loading.present();
        this._users.getUsers()
            .subscribe(res => {

                this.usersList = res['users'].data;
                this.usersList.forEach((value) => {
                    value['sendFriendRequest'] = false;
                })
                loading.dismiss();

            })
    }

    Friends() {
        this.nav = 'friends';
        let loading = this.loadingCtrl.create({
            content: 'Please wait...'
        });

        loading.present();
        this._friend.getFriends()
            .subscribe(res => {
                this.friends = res['users']['data'];
                this.friends.forEach((value) => {
                    value.openmore = false;
                })
                loading.dismiss();
                // console.log('friends');
                //console.log(res);
            })
    }

    FriendsRequests() {
        this._friend.getFriendsRequests()
            .subscribe(res => {
                // console.log('friends requests');
                //  console.log(res);
                this.friendsRequest = res['users']['data'];
                // console.log(this.friendsRequest)
            })

    }

    SendFrienadRequest() {
        /*this._friend.sendFriendRequest(51)
             .subscribe(res => {console.log(res)})*/
    }

    AcceptFriendRequest(id) {
        // console.log('Accept Friend Request');
        // console.log(id);
        this._friend.acceptFriendRequest(id)
            .subscribe(res => {
                console.log(res);
                // this.Friends();
                this.FriendsRequests()
            })
    }

    DidntAcceptFriendRequest(i) {
        //   console.log('Did not Accept Friend Request')
    }

    Notifications() {
        this._notification.getNotifications(1)
            .subscribe(res => {
                //        console.log('notification');
                // console.log(res);
                this.notifications = res['notifications']['data'];
                //        console.log(this.notifications);
            })
    }

    readAllNotifications() {
        this._notification.readAllNotifications()
            .subscribe(res => {
                //   console.log(res);
                this.Notifications();
            })
    }

    readNotificationByID(id) {
        this._notification.readNotificationByID(id)
            .subscribe(res => {
                console.log(res);
                this.Notifications();
            })
    }

    sendRequest(i) {
        this.usersList[i]['sendFriendRequest'] = true;
        this._friend.sendFriendRequest(this.usersList[i].id)
            .subscribe(res => {
                if (res['success'] == true) {
                    this.sendFriendRequest = true;
                    //this.Users();
                }
                //        console.log(res)
            })
        console.log('send request');

    }

    denyRequest(i) {
        this._friend.denyFriendRequest(i)
            .subscribe(res => {
                console.log(res);
                if (res['success'] === true) {
                    this.FriendsRequests();
                    this.Notifications();
                }
            })
    }

    openMoreFriends(i) {
        this.friends[i]['openmore'] = true;
    }

    someFriend() {
        this.friends.forEach((element) => {
            element.openmore = false;
        })
        this.openSearchBar = false;
        this.openFreind = false;
        this.openChat = false;
        this.openNotificationBar = false;
    }

    RemoveFriend(id) {
        this._friend.removeFriend(id)
            .subscribe(res => {
                //          console.log(res);
                this.Friends();
            })
    }

    someUsers() {
        console.log('some Users');
        this.openSearchBar = false;
        this.openFreind = false;
        this.openChat = false;
        this.openNotificationBar = false;
    }

    allNotifications() {
        this.navCtrl.setRoot("NotificationPage")
    }

    bla = false;


    addUserDiscussion(id) {
//        console.log(this.discussions);
//        console.log('add user')
        this.discussionUsersId = [];
        let loading = this.loadingCtrl.create({
            content: 'Please wait...'
        });

        loading.present();
        this._discussion.getDiscussionUsers(id)
            .subscribe(res => {
                //console.log('bla');
                res['data']['users'].forEach((val) => {
                    this.discussionUsersId.push(val['id'])
                })
                //this.discussionUsersId = res['data']['users'];
            })

        this._users.getUsers()
            .subscribe(res => {

                this.usersList = res['users'].data;
                this.usersList.forEach((user) => {
                    if(this.discussionUsersId.indexOf(user['id']) === (-1) ){
                        user['checked'] = false;
                    } else {
                        user['checked'] = true;
                    }
                })
                loading.dismiss();

                let alert = this.alertCtrl.create();
                alert.setTitle('Add New Users ');
                this.usersList.forEach((val) => {
                    alert.addInput({
                        type: 'checkbox',
                        label: val.name,
                        value: val.id,
                        checked: val.checked
                    })
                })

                alert.addButton('Cancel');
                alert.addButton({
                    text: 'Okay',
                    handler: (data: any) => {
                        console.log(data)
                    }
                });

                alert.present();

            })
    }


    goToDiscussionPage(id, categoryId, discussionName, categoryName) {
        if (categoryId === undefined) {
            categoryId = null;
        }
        this.navCtrl.setRoot('DiscussionIPage', {
            discussionId: id,
            categoryId: categoryId,
            discussionName: discussionName,
            categoryName: categoryName
        })
    }

    deleteCategory(id) {

        let actionSheet = this.actionSheetCtrl.create({
            buttons: [
                {
                    text: 'Delete',
                    role: 'destructive',
                    //icon: !this.platform.is('ios') ? 'trash' : null,
                    handler: () => {


                        this._link.deleteCategory(id)
                            .subscribe((res) => {
                                console.log(res)
                                if (res['status'] === 'successMessage') {
                                    this.getCategories();
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

}


