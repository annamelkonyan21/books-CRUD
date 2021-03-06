import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {ApiProvider} from "../api";

@Injectable()
export class UsersProvider {

    constructor(public http: HttpClient,
                public _api: ApiProvider) {
    }


    public getUser() {
        return this.http.get(this._api.apiUrl + `user`)
    }

    public getUsers() {
        return this.http.get(this._api.apiUrl + `users?page=1`)
    }

    public getUsersByPage(page) {
        return this.http.get(this._api.apiUrl + `users?page=${page}`)
    }

    public getUsersWithoutPage() {
        return this.http.get(this._api.apiUrl + `users`)
    }

    //getDisc
}
