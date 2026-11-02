import { beforeEach, describe, expect, it, vi } from "vitest";
import { getDoc, getDocs, type Firestore } from "firebase/firestore";
import type { PortfolioRepository } from "./portfolio.repositories";
import FirestorePortfolioRepository from "./portfolio.repositories";
import type { Portfolio, SkillSet } from "../entities";
import { mockDocumentSnapshop, mockQuerySnapshot } from "../tests/mocks";

vi.mock("firebase/firestore", () => ({
  doc: vi.fn(),
  collection: vi.fn(),
  Timestamp: {
    now: vi.fn(),
  },
  query: vi.fn(),
  orderBy: vi.fn(),
  getDoc: vi.fn(),
  getDocs: vi.fn(),
}));

describe("FirestorePortfolioRepository", () => {
  type MockDocument = {
    id: string;
    data: () => Record<string, unknown>;
  };
  let repository: PortfolioRepository;

  const mockFirestore = {} as Firestore;

  const portfolioId = "v3";

  beforeEach(() => {
    vi.clearAllMocks();
    repository = new FirestorePortfolioRepository(mockFirestore);
  });

  describe("getPortfolioById", () => {
    const portfolioData: Omit<Portfolio, "id"> = {
      name: "Finn",
      title: "Adventurer",
      description: "Finn the human, an adventurer.",
    };

    it("should return portofolio details", async () => {
      vi.mocked(getDoc).mockResolvedValue(
        mockDocumentSnapshop<Portfolio>({ id: portfolioId, ...portfolioData }),
      );

      const result = await repository.getPortfolioById(portfolioId);

      expect(getDoc).toHaveBeenCalled();
      expect(result).toEqual({
        id: portfolioId,
        ...portfolioData,
      });
    });
  });

  describe("getPortfolioSkillSets", () => {
    it("should return an array of skill set", async () => {
      const skillSetData: SkillSet[] = [
        {
          id: "1",
          title: "Skills",
          skills: ["hand-to-hand", "magic", "swordsmanship"],
        },
      ];

      vi.mocked(getDocs).mockResolvedValue(
        mockQuerySnapshot<SkillSet>(skillSetData),
      );

      const result = await repository.getPortfolioSkillSets(portfolioId);

      expect(result).toEqual(skillSetData);
    });
  });
});
