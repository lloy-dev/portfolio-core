import { beforeEach, describe, expect, it, vi } from "vitest";
import { getDoc, getDocs, Timestamp, type Firestore } from "firebase/firestore";
import { mockDocumentSnapshot, mockQuerySnapshot } from "../tests/mocks";
import type {
  Experience,
  Portfolio,
  Project,
  ProjectDetail,
  SetPortfolioDetailsInput,
  SkillSet,
} from "../entities";
import { FirestorePortfolioRepository, type PortfolioRepository } from ".";

vi.mock("firebase/firestore", () => ({
  doc: vi.fn(),
  collection: vi.fn(),
  Timestamp: {
    now: vi.fn(),
  },
  query: vi.fn(),
  orderBy: vi.fn(),
  increment: vi.fn(),
  getDoc: vi.fn(),
  getDocs: vi.fn(),
  updateDoc: vi.fn(),
  setDoc: vi.fn(),
}));

describe("FirestorePortfolioRepository", () => {
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
        mockDocumentSnapshot<Portfolio>({ id: portfolioId, ...portfolioData }),
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
      const skillSetsData: SkillSet[] = [
        {
          id: "1",
          title: "Skills",
          skills: ["hand-to-hand", "magic", "swordsmanship"],
        },
      ];

      vi.mocked(getDocs).mockResolvedValue(mockQuerySnapshot(skillSetsData));

      const result = await repository.getPortfolioSkillSets(portfolioId);

      expect(result).toEqual(skillSetsData);
    });
  });

  describe("getPortfolioExperiences", () => {
    it("should return an array of experiences", async () => {
      const experiencesData: Experience[] = [
        {
          id: "1",
          companyName: "Adventure Inc.",
          positions: [
            {
              title: "Newbie",
              description: "A new adventurer",
              location: "Earth",
              startDate: Timestamp.now(),
            },
          ],
        },
      ];

      vi.mocked(getDocs).mockResolvedValue(mockQuerySnapshot(experiencesData));

      const result = await repository.getPortfolioExperiences({ portfolioId });

      expect(result).toEqual(experiencesData);
    });
  });

  describe("getPortfolioProjects", () => {
    it("should return an array of projects", async () => {
      const projectsData: Project[] = [
        {
          id: "1",
          title: "Project A",
          description: "This is a project.",
          startDate: Timestamp.now(),
        },
      ];

      vi.mockObject(getDocs).mockResolvedValue(mockQuerySnapshot(projectsData));

      const result = await repository.getPortfolioExperiences({ portfolioId });

      expect(result).toEqual(projectsData);
    });
  });

  describe("likeProject", () => {
    it("should return true if successful", async () => {
      const result = await repository.likeProject({
        portfolioId,
        projectId: "1",
      });

      expect(result).toEqual(true);
    });
  });

  describe("getProjectDetailsById", () => {
    it("should return project details", async () => {
      const projectDetailsData: ProjectDetail[] = [
        {
          id: "1",
          type: "detail",
          label: "About",
          content: "Something",
          order: 1,
        },
      ];

      const projectData: Project = {
        id: "1",
        title: "Project A",
        description: "This is a project.",
        startDate: Timestamp.now(),
      };

      vi.mocked(getDoc).mockResolvedValue(mockDocumentSnapshot(projectData));

      vi.mocked(getDocs).mockResolvedValue(
        mockQuerySnapshot(projectDetailsData),
      );

      const result = await repository.getProjectDetailsById({
        portfolioId,
        projectId: "1",
      });

      expect(result).toEqual({
        ...projectData,
        projectDetails: projectDetailsData,
      });
    });
  });

  describe("setPortfolioDetails", () => {
    it("should return true if successful", async () => {
      const updateData: SetPortfolioDetailsInput = {
        id: portfolioId,
        name: "Jake",
      };

      const result = await repository.setPortfolioDetails(updateData);

      expect(result).toEqual(true);
    });
  });
});
