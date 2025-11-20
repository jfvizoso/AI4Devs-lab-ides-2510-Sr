export interface Candidate {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  cvFileName?: string;
  cvFilePath?: string;
  cvMimeType?: string;
  createdAt: string;
  updatedAt: string;
  education?: Education[];
  workExperience?: WorkExperience[];
}

export interface Education {
  id?: number;
  candidateId?: number;
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  startDate?: string;
  endDate?: string;
  isCurrent?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface WorkExperience {
  id?: number;
  candidateId?: number;
  company: string;
  position: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  isCurrent?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  details?: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface CandidatesResponse {
  candidates: Candidate[];
  pagination: Pagination;
}

export interface CandidateResponse {
  candidate: Candidate;
  education: Education[];
  workExperience: WorkExperience[];
}

