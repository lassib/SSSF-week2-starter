// TODO: user interface
export interface User {
  _id: any;
  user_name: string;
  email: string;
  role: 'user' | 'admin';
  password?: string;
}
