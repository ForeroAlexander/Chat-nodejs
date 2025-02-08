import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { trigger, transition, style, animate, state } from '@angular/animations';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NgIf, NgFor, NgClass, NgSwitch, NgSwitchCase, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserNameDialogComponent } from './user-name-dialog.component';
import { Message, User } from '../../models/message.model';
import { Subject, debounceTime, takeUntil } from 'rxjs';
import { map } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule,
    MatMenuModule,
    MatSlideToggleModule,
    FormsModule,
    NgIf,
    NgFor,
    NgClass,
    NgSwitch,
    NgSwitchCase,
    DatePipe
  ],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  animations: [
    trigger('messageAnimation', [
      state('void', style({
        transform: 'translateY(20px)',
        opacity: 0
      })),
      state('*', style({
        transform: 'translateY(0)',
        opacity: 1
      })),
      transition('void => *', [
        animate('300ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ])
    ])
  ]
})
export class ChatComponent implements OnInit, AfterViewChecked, OnDestroy {
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;
  @ViewChild('fileInput') private fileInput!: ElementRef;
  @ViewChild('messageInput') private messageInput!: ElementRef;
  
  messages: Message[] = [];
  newMessage = '';
  uploading = false;
  uploadProgress = 0;
  currentUser!: User;
  typingUsers: User[] = [];
  isDarkTheme = false;
  private typing$ = new Subject<void>();
  private destroy$ = new Subject<void>();
  private notificationSound: HTMLAudioElement | null = null;

  constructor(
    private chatService: ChatService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    @Inject(PLATFORM_ID) private platformId: Object // Inyecta PLATFORM_ID
  ) {
    if (isPlatformBrowser(this.platformId)) { // Verifica si es el navegador
      this.notificationSound = new Audio('assets/sounds/notification.mp3');
    }
    this.setupTypingDetection();
  }

  ngOnInit(): void {
    this.showUserNameDialog();
    this.loadThemePreference();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private async showUserNameDialog(): Promise<void> {
    const dialogRef = this.dialog.open(UserNameDialogComponent, {
      width: '300px',
      disableClose: true
    });

    const result = await dialogRef.afterClosed().toPromise();
    if (result) {
      this.currentUser = { id: crypto.randomUUID(), name: result };
      this.connectToChat();
    }
  }

  private connectToChat(): void {
    this.chatService.connectToStream().pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (message) => {
        this.messages.push({ ...message, state: 'active' });
        this.scrollToBottom();
        if (message.sender_id !== this.currentUser.id && this.notificationSound) {
          this.notificationSound.play().catch(console.error);
        }
      },
      error: (error) => {
        console.error('Error en la conexión:', error);
        this.showNotification('Error de conexión', 'error');
      }
    });

    this.chatService.getTypingUsers().pipe(
      takeUntil(this.destroy$)
    ).subscribe(users => {
      this.typingUsers = users.filter(user => user.id !== this.currentUser.id);
    });

    this.loadChatHistory();
  }

  private setupTypingDetection(): void {
    this.typing$.pipe(
      debounceTime(300),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.chatService.updateTypingStatus(this.currentUser, true);
      setTimeout(() => {
        this.chatService.updateTypingStatus(this.currentUser, false);
      }, 2000);
    });
  }

  onInput(): void {
    this.typing$.next();
  }

  private loadChatHistory(): void {
    this.chatService.getChatHistory().pipe(
      map((messages: Message[]) => messages.map((msg: Message) => ({ ...msg, state: 'active' })))
    ).subscribe({
      next: (messages) => {
        this.messages = messages;
        this.scrollToBottom();
      },
      error: (error) => {
        this.showNotification('Error al cargar el historial', 'error');
      }
    });
  }

  toggleTheme(): void {
    if (isPlatformBrowser(this.platformId)) { // Verifica si es el navegador
      this.isDarkTheme = !this.isDarkTheme;
      document.body.classList.toggle('dark-theme');
      localStorage.setItem('theme', this.isDarkTheme ? 'dark' : 'light');
    }
  }

  private loadThemePreference(): void {
    if (isPlatformBrowser(this.platformId)) { // Verifica si es el navegador
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'dark') {
        this.isDarkTheme = true;
        document.body.classList.add('dark-theme');
      }
    }
  }

  private scrollToBottom(): void {
    try {
      this.scrollContainer.nativeElement.scrollTop = 
        this.scrollContainer.nativeElement.scrollHeight;
    } catch(err) {}
  }

  sendMessage(): void {
    if (this.newMessage.trim()) {
      this.chatService.sendMessage(this.newMessage, 'text', this.currentUser).subscribe({
        next: () => {
          this.showNotification('Mensaje enviado', 'success');
        },
        error: (error) => {
          this.showNotification('Error al enviar el mensaje', 'error');
          console.error(error);
        },
      });
      this.newMessage = '';
    }
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      if (file.size > 5000000) { // 5MB limit
        this.showNotification('La imagen es demasiado grande. Máximo 5MB', 'error');
        return;
      }

      this.uploading = true;
      this.uploadProgress = 0;

      const interval = setInterval(() => {
        this.uploadProgress += 5;
        if (this.uploadProgress >= 100) {
          clearInterval(interval);
          this.uploading = false;
        }
      }, 100);

      this.chatService.uploadImage(file).subscribe({
        next: () => {
          this.showNotification('Imagen enviada', 'success');
          this.fileInput.nativeElement.value = '';
        },
        error: (error) => {
          this.showNotification('Error al subir la imagen', 'error');
          console.error(error);
          this.fileInput.nativeElement.value = '';
        },
        complete: () => {
          this.uploading = false;
          clearInterval(interval);
        },
      });
    }
  }

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  showNotification(message: string, type: 'success' | 'error'): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      panelClass: type === 'error' ? ['error-snackbar'] : ['success-snackbar'],
      horizontalPosition: 'end',
      verticalPosition: 'top',
    });
  }

  onEmojiSelected(emoji: string): void {
    this.newMessage += emoji;
    this.messageInput.nativeElement.focus();
  }

  onGifSelected(gifUrl: string): void {
    this.chatService.sendMessage(gifUrl, 'gif', this.currentUser).subscribe({
      next: () => {
        this.showNotification('GIF enviado', 'success');
      },
      error: (error) => {
        this.showNotification('Error al enviar el GIF', 'error');
        console.error(error);
      }
    });
  }
}