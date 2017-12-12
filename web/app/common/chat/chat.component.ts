import { Component, OnInit, AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import { ChatService } from './chat.service';
import { AuthService } from '../../auth/auth.service';
import * as io from "socket.io-client";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, AfterViewChecked {

  @ViewChild('scrollMe') private myScrollContainer: ElementRef;

  chats: any;
  joinned: boolean = false;
  newUser = { nickname: '', room: '' };
  msgData = { room: '', nickname: '', message: '' };
  socket = io('http://localhost:4000');

  constructor(private chatService: ChatService,
              private authentication: AuthService) {}

  ngOnInit() {
    var user = JSON.parse(localStorage.getItem("user"));
    this.chats = [];
    
    if(user) {
      //this.getChatByRoom(user.room);
      this.msgData = { room: user.room, nickname: user.nickname, message: '' }
      this.joinned = true;
      this.scrollToBottom();
    }// end if a user is already signed into chat
    
    if(this.authentication.loggedIn()) {
       let authUser = this.authentication.getUser();
       this.newUser = { room: '', nickname: authUser.username };
    }// end if we have a valid user in local storage

    this.socket.on('new-message', function (data) {
      var user = JSON.parse(localStorage.getItem("user"));
      if(user && data.message.room === user.room) {
        this.chats.push(data.message);
        this.msgData = { room: user.room, nickname: user.nickname, message: '' }
        this.scrollToBottom();
      }// end if we have a user and the rooms match
    }.bind(this));
  }// end function ngOnInit

  ngAfterViewChecked() {
    this.scrollToBottom();
  }// end function ngAfterViewChecked

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }// end function scrollToBottom

  getChatByRoom(room) {
    this.chatService.getChatByRoom(room).then((res) => {
      this.chats = res;
    }, (err) => {
      console.log(err);
    });
  }// end function getChatByRoom

  joinRoom() {
    var date = new Date();
    localStorage.setItem("user", JSON.stringify(this.newUser));
    //this.getChatByRoom(this.newUser.room);
    this.msgData = { room: this.newUser.room, nickname: this.newUser.nickname, message: '' };
    this.joinned = true;
    this.socket.emit('save-message', { room: this.newUser.room, nickname: this.newUser.nickname, message: 'Join this room', updated_at: date });
  }// end function joinRoom

  sendMessage() {
    this.chatService.saveChat(this.msgData).then((result) => {
      this.socket.emit('save-message', result);
    }, (err) => {
      console.log(err);
    });
  }// end function sendMessage

  logout() {
    var date = new Date();
    var user = JSON.parse(localStorage.getItem("user"));
    this.socket.emit('save-message', { room: user.room, nickname: user.nickname, message: 'Left this room', updated_at: date });
    localStorage.removeItem("user");
    this.joinned = false;
  }// end function logout

}// end class ChatComponent