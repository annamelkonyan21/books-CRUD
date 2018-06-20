import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiProvider } from "../api";

@Injectable()
export class DiscussionProvider {

  constructor(public http: HttpClient,
              public _api: ApiProvider) {

  }

  public getUserDiscussion(page) {
    return this.http.get(this._api.apiUrl+`discussions?page=${page}`)
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

  public addUsersToDiscussion(discussion_id, users ) {
    return this.http.post(this._api.apiUrl+`discussions/${discussion_id}/add-users`,{users: users})
  }

  public  getDiscussionUsers(discussion_id) {
      return this.http.get(this._api.apiUrl+`discussions/${discussion_id}/users`)
  }

  public getDiscussionCategories(discussion_id) {
      return this.http.get(this._api.apiUrl+`discussions/${discussion_id}/categories`)
  }

  public createDiscussionCategories(discussion_id, category) {
    return this.http.post(this._api.apiUrl+`discussions/${discussion_id}/categories`,{category: category})
  }



}
