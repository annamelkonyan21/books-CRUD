import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiProvider} from "../api";

@Injectable()
export class LinkProvider {

  constructor(public http: HttpClient,
              public _api: ApiProvider) {

  }

  public getLink() {
    return this.http.get(this._api.apiUrl+`links`)
  }

  public getUser() {
      return this.http.get(this._api.apiUrl+`user`)
  }

  public getUserCategories() {
      return this.http.get(this._api.apiUrl+`categories`)
  }
}
