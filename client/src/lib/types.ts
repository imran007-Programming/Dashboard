export type Role = "STUDENT" | "MENTOR" | "ADMIN";

export type ProjectStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

// Admin accounts only come from the server seed
export type SignupRole = Exclude<Role, "ADMIN">;

export interface SignupInput {
  name: string;
  email: string;
  password: string;
  role: SignupRole;
}

export interface Project {
  id: string;
  name: string;
  repoUrl: string;
  liveLink: string;
  description: string;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
  userId: string;
  user?: Pick<User, "id" | "name" | "email">;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface FieldError {
  field: string;
  message: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  meta?: PaginationMeta;
  data: T;
}

export interface ProjectInput {
  name: string;
  repoUrl: string;
  liveLink: string;
  description: string;
}

export type SortBy = "createdAt" | "updatedAt" | "name";
export type SortOrder = "asc" | "desc";

export interface ProjectQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: ProjectStatus;
  sortBy?: SortBy;
  sortOrder?: SortOrder;
}
