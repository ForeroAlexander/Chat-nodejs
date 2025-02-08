export interface Message {
    id?: string;
    content: string;
    type: 'text' | 'image' | 'gif';
    sender_id: string;
    sender_name: string;
    created_at?: string;
    state?: string;
  }
  
  export interface User {
    id: string;
    name: string;
    is_typing?: boolean;
  }