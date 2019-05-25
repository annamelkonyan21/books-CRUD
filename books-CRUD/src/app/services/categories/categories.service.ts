import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiService} from '../api/api.service';
import {Observable} from 'rxjs';
import {ICategory} from '../../interfaces/model';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  constructor(private _http: HttpClient,
              private _apiService: ApiService) { }


  public getAllCategories(): Observable<ICategory[]> {
    return this._http.get<ICategory[]>(`${this._apiService.api_url}/categories`);
  }
}
