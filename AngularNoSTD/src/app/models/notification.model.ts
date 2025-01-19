export interface Notification {
  id: number;
  userId: number;
  recipient: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface NotificationRequest {
userId: number;
recipient: string;
message: string;
timestamp: string;
}

export interface NotificationResponse{
  id: number;
  userId: number;
  message: string;
  timestamp: string;
  read: boolean;
}