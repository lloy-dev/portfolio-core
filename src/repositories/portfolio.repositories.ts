import {
  collection,
  query,
  limit,
  getDocs,
  type Firestore,
  orderBy,
  where,
  doc,
  updateDoc,
  increment,
  getDoc,
} from "firebase/firestore";
import {
  type Experience,
  type Project,
  type SkillSet,
  type Portfolio,
  type GetPortfolioExperienceItemsInput,
  type GetPortfolioProjectsInput,
  type LikeProjectInput,
  type GetProjectDetailsByIdInput,
  type ProjectDetail,
} from "../entities";

interface PortfolioRepository {
  getFirstPortfolio(): Promise<Portfolio | undefined>;
  getPortfolioById(id: string): Promise<Portfolio | undefined>;
  getPortfolioSkillSets(portfolioId: string): Promise<SkillSet[]>;
  getPortfolioExperiences(
    data: GetPortfolioExperienceItemsInput,
  ): Promise<Experience[]>;
  getPortfolioProjects(data: GetPortfolioProjectsInput): Promise<Project[]>;
  likeProject(data: LikeProjectInput): Promise<boolean>;
  getProjectDetailsById(
    data: GetProjectDetailsByIdInput,
  ): Promise<Project | undefined>;
}

class FirestorePortfolioRepository implements PortfolioRepository {
  private COLLECTION_NAME = "portfolios";
  private SUB_COLLECTION_SKILL_SETS = "skillSets";
  private SUB_COLLECTION_EXPERIENCES = "experiences";
  private SUB_COLLECTION_PROJECTS = "projects";
  private SUB_COLLECTION_DETAILS = "details";
  private firestore: Firestore;

  constructor(firestore: Firestore) {
    this.firestore = firestore;
  }

  async getFirstPortfolio(): Promise<Portfolio | undefined> {
    const portfoliosRef = collection(this.firestore, this.COLLECTION_NAME);
    const portfoliosQ = query(portfoliosRef, limit(1));
    const portfoliosSS = await getDocs(portfoliosQ);

    if (!portfoliosSS.empty) {
      const portfolioDoc = portfoliosSS.docs[0]!;

      return {
        id: portfolioDoc.id,
        ...portfolioDoc.data(),
      } as Portfolio;
    }
  }

  async getPortfolioById(id: string): Promise<Portfolio | undefined> {
    try {
      const portfolioRef = doc(this.firestore, this.COLLECTION_NAME, id);
      const portfolioDoc = await getDoc(portfolioRef);

      return {
        id: portfolioDoc.id,
        ...portfolioDoc.data(),
      } as Portfolio;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return undefined;
    }
  }

  async getPortfolioSkillSets(portfolioId: string): Promise<SkillSet[]> {
    try {
      const skillSetsRef = collection(
        this.firestore,
        this.COLLECTION_NAME,
        portfolioId,
        this.SUB_COLLECTION_SKILL_SETS,
      );
      const skillSetsQ = query(skillSetsRef, orderBy("order", "asc"));
      const skillSetsSS = await getDocs(skillSetsQ);

      const skillSets: SkillSet[] = skillSetsSS.docs.map((skillSetDoc) => {
        return {
          id: skillSetDoc.id,
          ...skillSetDoc.data(),
        } as SkillSet;
      });

      return skillSets;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return [];
    }
  }

  async getPortfolioExperiences(
    data: GetPortfolioExperienceItemsInput,
  ): Promise<Experience[]> {
    try {
      const { portfolioId, filters } = data;
      const experiencesRef = collection(
        this.firestore,
        this.COLLECTION_NAME,
        portfolioId,
        this.SUB_COLLECTION_EXPERIENCES,
      );

      const experienceConstraints = [];
      if (filters?.limitCount)
        experienceConstraints.push(limit(filters.limitCount));

      const experiencesQ = query(
        experiencesRef,
        orderBy("startDate", "desc"),
        ...experienceConstraints,
      );
      const experiencesSS = await getDocs(experiencesQ);

      const experiences: Experience[] = experiencesSS.docs.map(
        (experienceDoc) => {
          return {
            id: experienceDoc.id,
            ...experienceDoc.data(),
          } as Experience;
        },
      );

      return experiences;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return [];
    }
  }

  async getPortfolioProjects(
    data: GetPortfolioProjectsInput,
  ): Promise<Project[]> {
    try {
      const { portfolioId, filters } = data;
      const projectsRef = collection(
        this.firestore,
        this.COLLECTION_NAME,
        portfolioId,
        this.SUB_COLLECTION_PROJECTS,
      );

      const projectConstraints = [];
      if (filters?.isFeatured)
        projectConstraints.push(where("isFeatured", "==", filters.isFeatured));
      if (filters?.orderBy)
        projectConstraints.push(
          orderBy(filters.orderBy, filters.orderByDirection),
        );

      const projectsQ = query(projectsRef, ...projectConstraints);
      const projectsSS = await getDocs(projectsQ);

      const projects: Project[] = projectsSS.docs.map((projectDoc) => {
        return {
          id: projectDoc.id,
          ...projectDoc.data(),
        } as Project;
      });

      return projects;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return [];
    }
  }

  async likeProject(data: LikeProjectInput): Promise<boolean> {
    try {
      const { portfolioId, projectId } = data;
      const projectDocRef = doc(
        this.firestore,
        this.COLLECTION_NAME,
        portfolioId,
        this.SUB_COLLECTION_PROJECTS,
        projectId,
      );
      await updateDoc(projectDocRef, {
        likes: increment(1),
      });
      return true;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return false;
    }
  }

  async getProjectDetailsById(
    data: GetProjectDetailsByIdInput,
  ): Promise<Project | undefined> {
    try {
      const { portfolioId, projectId } = data;

      const projectDocRef = doc(
        this.firestore,
        this.COLLECTION_NAME,
        portfolioId,
        this.SUB_COLLECTION_PROJECTS,
        projectId,
      );
      const projectDoc = await getDoc(projectDocRef);

      const projectDetailsRef = collection(
        this.firestore,
        this.COLLECTION_NAME,
        portfolioId,
        this.SUB_COLLECTION_PROJECTS,
        projectId,
        this.SUB_COLLECTION_DETAILS,
      );
      const projectDetailsQ = query(projectDetailsRef, orderBy("order", "asc"));
      const projectDetailsSS = await getDocs(projectDetailsQ);

      const projectDetails: ProjectDetail[] = projectDetailsSS.docs.map(
        (projectDetailDoc) => {
          return {
            id: projectDetailDoc.id,
            ...projectDetailDoc.data(),
          } as ProjectDetail;
        },
      );

      return {
        id: projectDoc.id,
        ...projectDoc.data(),
        projectDetails,
      } as Project;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return undefined;
    }
  }
}

export default FirestorePortfolioRepository;
export type { PortfolioRepository };
