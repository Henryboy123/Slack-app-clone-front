import { Component, OnInit } from '@angular/core';
import { ChannelService } from '../channel.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { SocketioService } from '../socketio.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  channels: any[] = [];
  channelUsers: any[] = [];
  messages: any[] = [];
  newMessageContent: string = '';
  selectedChannel: any = null;
  channelBackendUrl = 'http://localhost:3000/api/channels/';

  constructor(
    private channelService: ChannelService,
    private http: HttpClient,
    private router: Router,
    private socketioService: SocketioService
  ) {}

  ngOnInit() {
    this.fetchChannels();
    this.setupSocketListener();
  }

  fetchChannels() {
    const userId = localStorage.getItem('responseId');

    this.channelService.getChannelsByUserId(userId).subscribe(
      (channels) => {
        this.channels = channels;
      },
      (error) => {
        console.error('Error fetching channels:', error);
      }
    );
  }

  logout() {
    const backendUrl = 'http://localhost:3000/api/users/signout';

    this.http.post<any>(backendUrl, '').subscribe(
      (response) => {
        console.log('Response from the server:', response);

        if (response.message.includes('signed out!')) {
          this.router.navigate(['/login']);
        } else {
          console.log('Unable to logout');
        }
      },
      (error) => {
        console.error('Error sending the request:', error);
      }
    );
  }

  setupSocketListener() {
    this.socketioService.getSocket().on('message', (newMessage) => {
      this.messages.push(newMessage);
    });
  }

  getChannelData(channelId: string) {
    const backendUrl = `${this.channelBackendUrl}${channelId}/messages`;
    const getChannelMembersUrl = `${this.channelBackendUrl}${channelId}/users`;

    this.http.get<any[]>(backendUrl).subscribe(
      (messages) => {
        this.selectedChannel = channelId;
        this.messages = messages;
      },
      (error) => {
        console.error('Error fetching messages:', error);
      }
    );

    this.http.get<any[]>(getChannelMembersUrl).subscribe(
      (users) => {
        this.channelUsers = users;
      },
      (error) => {
        console.error('Error fetching users for the channel:', error);
      }
    );
  }

  getChannelName(channelId: string): string {
    const channel = this.channels.find((channel) => channel._id === channelId);
    return channel ? channel.name : '';
  }

  sendMessage() {
    if (!this.newMessageContent.trim()) {
      return;
    }

    const backendUrl = `${this.channelBackendUrl}${this.selectedChannel}/messages`;

    const newMessage = {
      user: localStorage.getItem('responseId'),
      userName: localStorage.getItem('name'),
      content: this.newMessageContent.trim(),
    };

    this.http.post<any>(backendUrl, newMessage).subscribe(
      (response) => {
        this.newMessageContent = '';
        this.socketioService.getSocket().emit('message', newMessage);
      },
      (error) => {
        console.error('Error sending message:', error);
      }
    );
  }

  async getUserById(userId: string): Promise<any> {
    const getUserUrl = `http://localhost:3000/api/users/${userId}`;

    try {
      return await this.http.get<any>(getUserUrl).toPromise();
    } catch (error) {
      console.error('Error fetching user:', error);
      return null;
    }
  }
}
