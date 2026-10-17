import type { Timestamp } from "firebase/firestore";

interface Message {
  id: string;
  name: string;
  message: string;
  email?: string;
  sentAt: Timestamp;
  createdAt: Timestamp;
}

interface CreateMessageInput {
  name: string;
  message: string;
  email?: string;
}

export type { Message, CreateMessageInput };
