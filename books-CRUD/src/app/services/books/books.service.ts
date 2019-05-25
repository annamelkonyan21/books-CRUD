import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {IBook} from '../../interfaces/model';
import {ApiService} from '../api/api.service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BooksService {

  constructor(private _http: HttpClient,
              private _apiService: ApiService) { }


  public getAllBooks():  Observable<IBook[]> {
    return this._http.get<IBook[]>(`${this._apiService.api_url}/books`);
  }

  public createBook(data: IBook): Observable<IBook> {
    return this._http.post<IBook>(`${this._apiService.api_url}/books`, data);
  }

  public updateBook(id: number, data: IBook): Observable<IBook>  {
    return this._http.put<IBook>(`${this._apiService.api_url}/books/${id}`, data);
  }

  public deleteBook(id: number) {
    return this._http.delete(`${this._apiService.api_url}/books/${id}`);
  }

}
