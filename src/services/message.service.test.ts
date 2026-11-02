import { beforeEach, describe, expect, it, vi } from "vitest";
import type { MessageRepository } from "../repositories";
import { DefaultMessageService, type MessageService } from ".";
import type { CreateMessageInput } from "../entities";

describe("DefaultMessageService", () => {
  let service: MessageService;

  const mockMessageRepository: MessageRepository = {
    createMessage: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    service = new DefaultMessageService(mockMessageRepository);
  });

  describe("createMessage", () => {
    it("should return true if successful", async () => {
      const createMessageData: CreateMessageInput = {
        name: "Finn",
        message: "Hello world!",
      };

      vi.mocked(mockMessageRepository.createMessage).mockResolvedValue(true);

      const result = await service.createMessage(createMessageData);

      expect(result).toEqual(true);
    });
  });
});
