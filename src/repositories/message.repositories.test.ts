import { vi, describe, beforeEach, it, expect } from "vitest";
import { addDoc, type Firestore } from "firebase/firestore";
import { mockDocumentReference } from "../tests/mocks";
import type { CreateMessageInput } from "../entities";
import { FirestoreMessageRepository, type MessageRepository } from "./";

vi.mock("firebase/firestore", () => ({
  collection: vi.fn(),
  Timestamp: {
    now: vi.fn(),
  },
  addDoc: vi.fn(),
}));

describe("FirestoreMessageRepository", () => {
  let repository: MessageRepository;

  const mockFirestore = {} as Firestore;

  const createMessageData: CreateMessageInput = {
    name: "Finn",
    message: "Hello world!",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    repository = new FirestoreMessageRepository(mockFirestore);
  });

  describe("createMessage", () => {
    it("should return true if successful", async () => {
      vi.mocked(addDoc).mockResolvedValue(mockDocumentReference("xyz"));

      const result = await repository.createMessage(createMessageData);

      expect(addDoc).toHaveBeenCalled();
      expect(result).toEqual(true);
    });

    it("should return false if error", async () => {
      vi.mocked(addDoc).mockRejectedValue(new Error("Firebase error"));

      const result = await repository.createMessage(createMessageData);

      expect(result).toEqual(false);
    });
  });
});
