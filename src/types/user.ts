export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string; // Optional fields
  roles?: string[];
}
