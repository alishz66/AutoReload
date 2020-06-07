import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private messages = new Subject<string[]>();

  constructor() { }

  public addMessages = (messages: string[]): void =>
      this.messages.next(messages);

  public getMessages = () =>
      this.messages.asObservable();
}
