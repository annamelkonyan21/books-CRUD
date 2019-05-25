import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  public api_url = "http://localhost:3000";
  constructor() { }
}
