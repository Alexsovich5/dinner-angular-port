export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  dateOfBirth: string;
  gender: string;
  isProfileComplete: boolean;
  bio?: string;
  interests?: string[];
  dietaryPreferences?: string[];
  locationPreferences?: {
    city?: string;
    maxDistance?: number;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  matchPreferences?: {
    ageRange?: {
      min: number;
      max: number;
    };
    genders?: string[];
  };
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  dietaryPreferences?: string[];
  cuisinePreferences?: string;
  location?: string;
  lookingFor?: string;
}

export interface LoginResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
  };
}
