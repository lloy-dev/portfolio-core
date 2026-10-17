import type { OrderByDirection, Timestamp } from "firebase/firestore";

interface Portfolio {
  id: string;
  name: string;
  title: string;
  description: string;
  profilePicSrc?: string;
  personalSite?: string;
  github?: string;
  gitlab?: string;
  linkedin?: string;
  youtube?: string;
  instagram?: string;
  twitter?: string;
  facebook?: string;
  email?: string;
  phone?: string;
  location?: string;
}

interface SkillSet {
  id: string;
  title: string;
  skills: string[];
}

interface Position {
  title: string;
  location: string;
  description: string;
  startDate: Timestamp;
  endDate?: Timestamp;
}

interface Experience {
  id: string;
  companyName: string;
  positions: Position[];
}

interface ProjectDetail {
  id: string;
  label: string;
  content: string;
  type: "detail";
  order: number;
}

interface ProjectGalleryItem {
  label: string;
  src: string;
  type: string;
}

interface ProjectGallery {
  id: string;
  items: ProjectGalleryItem[];
  type: "gallery";
  order: number;
}

interface ProjectIframe {
  id: string;
  label: string;
  src: string;
  contentType?: "pico-8-embed";
  type: "iframe";
  order: number;
}

interface Project {
  id: string;
  title: string;
  description: string;
  coverImg?: string;
  tags?: string[];
  likes?: number;
  links?: {
    label: string;
    url?: string;
    isExternal?: boolean;
  }[];
  isFeatured?: boolean;
  startDate: Timestamp;
  projectDetails?: (ProjectDetail | ProjectGallery | ProjectIframe)[];
}

interface PortfolioFeaturedItems {
  experience?: Experience;
  projects: Project[];
}

interface PortfolioExperienceItems {
  skillSets: SkillSet[];
  experiences: Experience[];
}

interface GetPortfolioExperienceItemsInput {
  portfolioId: string;
  filters?: {
    limitCount?: number;
  };
}

interface GetPortfolioProjectsInput {
  portfolioId: string;
  filters?: {
    isFeatured?: boolean;
    orderBy?: string;
    orderByDirection?: OrderByDirection;
  };
}

interface LikeProjectInput {
  portfolioId: string;
  projectId: string;
}

interface GetProjectDetailsByIdInput {
  portfolioId: string;
  projectId: string;
}

export type {
  Portfolio,
  SkillSet,
  Position,
  Experience,
  Project,
  ProjectDetail,
  ProjectGalleryItem,
  ProjectGallery,
  PortfolioFeaturedItems,
  PortfolioExperienceItems,
  GetPortfolioExperienceItemsInput,
  GetPortfolioProjectsInput,
  LikeProjectInput,
  GetProjectDetailsByIdInput,
};
