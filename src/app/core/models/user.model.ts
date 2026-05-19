import { Profile } from './profile.model';

export interface User {
  id: string;
  code: string;
  name: string;
  email: string;
  phone?: string;
  phone_code?: string;
  avatar?: string;
  is_active: boolean;
  profile?: Profile;
  created_at: string;
  updated_at: string;
}

export interface UserFilters {
  search?: string;
  is_active?: boolean;
  profile_id?: string;
  per_page?: number;
  page?: number;
}