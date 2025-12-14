export interface Submission {
  id: string;
  rating: number;
  review: string;
  timestamp: string;
  aiResponse?: {
    userResponse: string;
    summary: string;
    actions: string[];
  };
}
