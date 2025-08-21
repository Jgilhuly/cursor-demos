export type Course = {
  id: number;
  title: string;
  description?: string | null;
  code?: string | null;
  active: boolean;
  published: boolean;
  maxEnrollments?: number | null;
  startDate?: string | null;
  endDate?: string | null;
  thumbnailUrl?: string | null;
};


