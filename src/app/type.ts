export interface UserType {
  // name: string;
  email: string;
  password: string;
  status?: string;
  isloggedIn?: boolean;
  // confirmPassword: string;
  // phone: string;
  // address: string;
}

export type ScreeningMethod = "epds" | "symptoms" | "hybrid";

export interface Answers {
  epds: Record<number, number>;
  symptoms: Record<number, number>;
}

export interface RiskResult {
  level: "Low" | "Moderate" | "High";
  color: string;
  description: string;
  advice: string;
}

export type Page =
  | "select-method"
  | "onboarding"
  | "assessment"
  | "review"
  | "result";

//  community post types
export interface Post {
  id: string;
  title: string;
  body: string;
  tags: string[];
  category: string;
  postType: boolean;
  imageUrl?: string;
  userId?: string;
  userEmail?: string;
  userName?: string;
  createdAt?: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface User {
  id: string;
  name: string;
}

export interface CreatePostState {
  formData: {
    title: string;
    body: string;
    tags: string[];
    category: string;
    postType: boolean;
    imageUrl?: string;
  };
  posts: Post[];
  userName?: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  currentPostId?: string | null;
}

// community group post types
export interface CreateGroupPostPayload {
  postTitle: string;
  postBody: string;
  tags: string[];
  categoryId: string; // Send just ID
  isAnonymous: boolean;
  image?: string;
  groupId: string;
}

export interface GroupPost {
  id: string; // Backend adds this
  postTitle: string;
  postBody: string;
  tags: string[];
  category: Category; // Backend returns full object
  isAnonymous: boolean;
  image?: string;
  user: User; // Backend adds this
  postedTime: string; // Backend adds this
  groupId: string;
  // hasLiked: boolean;
  // likeCount?: string;
  commentsCount: number;
  like: LikeResponse;
}

// For like API response (if different from your main Like)
export interface LikeResponse {
  id: string;
  likeCount: string;
  hasLiked: boolean;
}

// EPDS types

export interface EPDSQuestion {
  q1: number;
  q2: number;
  q3: number;
  q4: number;
  q5: number;
  q6: number;
  q7: number;
  q8: number;
  q9: number;
  q10: number;
}

export interface EpdsResultState {
  answers: EPDSQuestion | null;
  score: number | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

// Symptoms types
export type SymptomsQuestionType = "number" | "dropdown";

export interface SymptomsQuestion {
  id: number | string;
  label: string;
  type: SymptomsQuestionType;
  options?: string[]; // optional if not all questions have options
  min?: number;
  max?: number;
  default?: number | string;
}
export type SymptomsAnswer = Record<string, any>;

export interface SymptomsQuestionsResponse {
  app_title: string;
  description: string;
  fields: SymptomsQuestion[];
  isLoading?: boolean;
}

export interface SymptomsResultState {
  answers: Record<string, any> | null;
  score: number | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

export interface SymptomsAssessmentResponse {
  id: string;
  createdAt: string;
  result: {
    prediction: string;
    risk_probability: number;
    flag: number;
    clinical_note?: string;
    threshold_used?: number;
  };
}

export interface HybridAssessmentResponse {
  audit: {
    decision_path: string;
    is_discordant: boolean;
    timestamp: string;
    uncertainty_flag: boolean;
  };
  clinical_recommendation: string;
  explanation: string;
  final_probability: number;
  fusion_method: string;
  is_critical: boolean;
  metrics: {
    epds_total: number;
    epds_risk: string;
    ml_raw: number;
    ml_std: number;
  };
  risk_label: string;
  system_disclaimer: string;
}

export interface HybridResultState {
  epdsAnswers: EPDSQuestion | null;
  symptomsAnswers: Record<string, any> | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  result: HybridAssessmentResponse | null;
}
