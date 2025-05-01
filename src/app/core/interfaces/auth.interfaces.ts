export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  profile_picture?: string;
  date_of_birth: string;
  gender: string;
  is_profile_complete: boolean;
  bio?: string;
  interests?: string[];
  dietary_preferences?: string[];
  location_preferences?: {
    city?: string;
    max_distance?: number;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  match_preferences?: {
    age_range?: {
      min: number;
      max: number;
    };
    genders?: string[];
  };
  created_at?: string;
  updated_at?: string;
}

export interface RegisterData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: string;
  dietary_preferences?: string[];
  cuisine_preferences?: string;
  location?: string;
  looking_for?: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface ValidationError {
  loc: string[];
  msg: string;
  type: string;
}

export interface ApiErrorResponse {
  detail: ValidationError[] | string;
}
