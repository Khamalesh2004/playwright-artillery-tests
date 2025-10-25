export interface User {
  id?: number;
  name: string;
  email: string;
  gender: 'male' | 'female';
  status: 'active' | 'inactive';
}

export interface ApiResponse {
  code?: number;
  meta?: any;
  data: User | User[];
}