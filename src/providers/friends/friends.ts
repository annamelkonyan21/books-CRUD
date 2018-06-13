import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {ApiProvider} from "../api";

@Injectable()
export class FriendsProvider {

    constructor(public http: HttpClient,
                public _api: ApiProvider) {
    }

    public getFriends() {
        return this.http.get(this._api.apiUrl + `users/friends?page=1`)
    }

    public getFriendsByPage(page) {
        return this.http.get(this._api.apiUrl + `friends?page=${page}`)
    }

    public getFriendsWithoutPage() {
        return this.http.get(this._api.apiUrl + `friends`)
    }

    public sendFriendRequest(user_id) {
        return this.http.get(this._api.apiUrl + `users/friend-request/${user_id}`)
    }

    public getFriendsRequests() {
        return this.http.get(this._api.apiUrl + `users/friendRequests?page=1`)
    }

    public acceptFriendRequest(user_id) {
        return this.http.get(this._api.apiUrl + `users/accept-request/${user_id}`)
    }

    public denyFriendRequest(user_id) {
        return this.http.get(this._api.apiUrl + `users/deny-request/${user_id}`)
    }

    public removeFriend(user_id) {
        return this.http.get(this._api.apiUrl + `users/unfriend/${user_id}`)
    }


}
