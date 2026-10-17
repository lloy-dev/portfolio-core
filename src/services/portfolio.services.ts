import type { PortfolioRepository } from "../repositories";
import type {
  LikeProjectInput,
  Project,
  Portfolio,
  PortfolioFeaturedItems,
  PortfolioExperienceItems,
  GetProjectDetailsByIdInput,
  Position,
  SetPortfolioDetailsInput,
} from "../entities";

interface PortfolioService {
  getPortfolioDetails(): Promise<Portfolio | undefined>;
  getPortfolioFeaturedItems(
    portfolioId: string,
  ): Promise<PortfolioFeaturedItems>;
  getPortfolioExperienceItems(
    portfolioId: string,
  ): Promise<PortfolioExperienceItems>;
  getPortfolioProjects(portfolioId: string): Promise<Project[]>;
  likeProject(data: LikeProjectInput): Promise<boolean>;
  getProjectDetailsById(
    data: GetProjectDetailsByIdInput,
  ): Promise<Project | undefined>;
  setPortfolioDetails(data: SetPortfolioDetailsInput): Promise<boolean>;
}

class DefaultPortfolioService implements PortfolioService {
  private portfolioRepository: PortfolioRepository;

  constructor(portfolioRepository: PortfolioRepository) {
    this.portfolioRepository = portfolioRepository;
  }

  async getPortfolioDetails(): Promise<Portfolio | undefined> {
    const portfolio = await this.portfolioRepository.getPortfolioById("v3");

    if (portfolio) return portfolio;
  }

  async getPortfolioFeaturedItems(
    portfolioId: string,
  ): Promise<PortfolioFeaturedItems> {
    const experiences = await this.portfolioRepository.getPortfolioExperiences({
      filters: { limitCount: 1 },
      portfolioId,
    });

    const experience = experiences.length > 0 ? experiences[0] : undefined;

    const projects = await this.portfolioRepository.getPortfolioProjects({
      filters: {
        isFeatured: true,
        orderBy: "likes",
        orderByDirection: "desc",
      },
      portfolioId,
    });

    return {
      experience,
      projects,
    } as PortfolioFeaturedItems;
  }

  async getPortfolioExperienceItems(
    portfolioId: string,
  ): Promise<PortfolioExperienceItems> {
    const experiences = await this.portfolioRepository.getPortfolioExperiences({
      portfolioId,
    });
    const remappedExperiences = experiences.map((experience) => {
      const sortedPositions = experience.positions.sort(
        (a: Position, b: Position) =>
          b.startDate.toDate().getTime() - a.startDate.toDate().getTime(),
      );
      return {
        ...experience,
        positions: sortedPositions,
      };
    });

    const skillSets =
      await this.portfolioRepository.getPortfolioSkillSets(portfolioId);

    return {
      experiences: remappedExperiences,
      skillSets,
    };
  }

  getPortfolioProjects(portfolioId: string): Promise<Project[]> {
    return this.portfolioRepository.getPortfolioProjects({
      filters: {
        orderBy: "startDate",
        orderByDirection: "desc",
      },
      portfolioId,
    });
  }

  likeProject(data: LikeProjectInput): Promise<boolean> {
    return this.portfolioRepository.likeProject(data);
  }

  getProjectDetailsById(
    data: GetProjectDetailsByIdInput,
  ): Promise<Project | undefined> {
    return this.portfolioRepository.getProjectDetailsById(data);
  }

  setPortfolioDetails(data: SetPortfolioDetailsInput): Promise<boolean> {
    return this.portfolioRepository.setPortfolioDetails(data);
  }
}

export default DefaultPortfolioService;
export type { PortfolioService };
