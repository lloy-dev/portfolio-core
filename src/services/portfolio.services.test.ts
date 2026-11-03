import { beforeEach, describe, expect, it, vi } from "vitest";
import type { PortfolioRepository } from "../repositories";
import type { Portfolio } from "../entities";
import { DefaultPortfolioService, type PortfolioService } from ".";

describe("DefaultPortfolioService", () => {
  let service: PortfolioService;

  const portfolioId = "v3";

  const mockPortfolioRepository: PortfolioRepository = {
    getPortfolioById: vi.fn(),
    getFirstPortfolio: vi.fn(),
    getPortfolioSkillSets: vi.fn(),
    getPortfolioExperiences: vi.fn(),
    getPortfolioProjects: vi.fn(),
    likeProject: vi.fn(),
    getProjectDetailsById: vi.fn(),
    setPortfolioDetails: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    service = new DefaultPortfolioService(mockPortfolioRepository);
  });

  describe("getPortfolioDetails", () => {
    it("should return portfolio details", async () => {
      const portfolioData: Portfolio = {
        id: portfolioId,
        name: "Finn",
        title: "Adventurer",
        description: "Finn the human, an adventurer.",
      };

      vi.mocked(mockPortfolioRepository.getPortfolioById).mockResolvedValue(
        portfolioData,
      );

      const result = await service.getPortfolioDetails();

      expect(result).toBeDefined();
      expect(result).toEqual(portfolioData);
    });
  });
});
