import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TwitterService {
    private apiUrl = environment.apiUrl;
    private API = 'twitter';
  
  constructor(private http: HttpClient) {}

  postTweet(message: string) {
    return this.http.post(`${this.apiUrl}/${this.API}`, { message });
  }
}