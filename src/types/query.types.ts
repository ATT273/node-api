export interface IBaseQuery {
  page?: number;
  limit?: number;
  keyword?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface IBaseMetadata {
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
  count: number;
}
