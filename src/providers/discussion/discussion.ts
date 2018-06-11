import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiProvider } from "../api";

@Injectable()
export class DiscussionProvider {

  constructor(public http: HttpClient,
              public _api: ApiProvider) {

  }

  public getUserDiscussion() {
    return this.http.get(this._api.apiUrl+`discussions`)
  }

  public createDiscussion(discussion) {
    return this.http.post(this._api.apiUrl+`discussions`, {discussion: discussion})
  }

  public  changeDiscussionOrder(ids) {
    return this.http.post(this._api.apiUrl+`discussions/order`,{ids: ids})
  }

  public deleteDiscussion(discussion_id){
    return this.http.delete(this._api.apiUrl+`discussions/${discussion_id}`)
  }

}
