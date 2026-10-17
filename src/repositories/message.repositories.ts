import {
  addDoc,
  collection,
  Timestamp,
  type Firestore,
} from "firebase/firestore";
import type { CreateMessageInput } from "../entities";

interface MessageRepository {
  createMessage(data: CreateMessageInput): Promise<boolean>;
}

class FirestoreMessageRepository implements MessageRepository {
  private COLLECTION_NAME = "messages";
  private firestore: Firestore;

  constructor(firestore: Firestore) {
    this.firestore = firestore;
  }

  async createMessage(data: CreateMessageInput): Promise<boolean> {
    try {
      await addDoc(collection(this.firestore, this.COLLECTION_NAME), {
        ...data,
        sentAt: Timestamp.now(),
        createdAt: Timestamp.now(),
      });

      return true;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return false;
    }
  }
}

export default FirestoreMessageRepository;
export type { MessageRepository };
