import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ChannelService {
  constructor(private http: HttpClient) { }

  getChannelsByUserId(userId: string | null) {
    let backendUrl = `http://localhost:3000/api/channels/connected/${userId}`;

    return this.http.get<any[]>(backendUrl);
  }
}
