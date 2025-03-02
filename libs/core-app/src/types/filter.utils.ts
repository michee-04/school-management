export interface FormFilters {
  skip?: number;
  limit?: number;
  filter?: string;
  sort?: Record<string, 1 | -1>;
}
