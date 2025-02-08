import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Message, User } from '../models/message.model';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private streamUrl = 'http://localhost:3000/chat/stream';
  private messageUrl = 'http://localhost:3000/chat/message';
  private imageUrl = 'http://localhost:3000/chat/image';
  private typingUsers$ = new Subject<User[]>();

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  connectToStream(): Observable<Message> {
    return new Observable(observer => {
      if (isPlatformBrowser(this.platformId)) {
        const eventSource = new EventSource(this.streamUrl);

        eventSource.onmessage = (event: MessageEvent) => {
          try {
            const data = JSON.parse(event.data);
            observer.next(data);
          } catch (error) {
            console.error('Error al parsear el mensaje:', error);
          }
        };

        eventSource.onerror = () => {
          observer.complete();
        };
      }
    });
  }

  sendMessage(content: string, type: 'text' | 'image' | 'gif', sender: User): Observable<any> {
    const message = { content, type, sender_id: sender.id, sender_name: sender.name };
    return this.http.post(this.messageUrl, message);
  }

  uploadImage(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('image', file);
    return this.http.post(this.imageUrl, formData);
  }

  getChatHistory(): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.messageUrl}/history`);
  }

  updateTypingStatus(user: User, isTyping: boolean): void {
    // Lógica para actualizar el estado de escritura del usuario
  }

  getTypingUsers(): Observable<User[]> {
    return this.typingUsers$.asObservable();
  }
}