export interface Profile {
  id: string;
  code: string;
  name: string;
  permissions: string[];
  users_count?: number;
  users?: UserSummary[];
  created_at: string;
  updated_at: string;
}

export interface ProfileForm {
  name: string;
  permissions: string[];
}

export interface UserSummary {
  id: string;
  code: string;
  name: string;
  email: string;
}

export const AVAILABLE_PERMISSIONS = [
  { label: 'Productos',  value: 'products'  },
  { label: 'Usuarios',  value: 'users'     },
  { label: 'Perfiles',  value: 'profiles'  },
];