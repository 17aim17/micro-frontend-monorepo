export type Role = 'admin' | 'editor' | 'viewer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export const roles: Role[] = ['admin', 'editor', 'viewer'];

export const users: User[] = [
  { id: '1', name: 'Priya Sharma', email: 'priya@example.com', role: 'admin' },
  { id: '2', name: 'Marco Rossi', email: 'marco@example.com', role: 'editor' },
  { id: '3', name: 'Aiko Tanaka', email: 'aiko@example.com', role: 'viewer' },
  { id: '4', name: 'Lena Fischer', email: 'lena@example.com', role: 'editor' },
  { id: '5', name: 'Omar Haddad', email: 'omar@example.com', role: 'viewer' },
  { id: '42', name: 'Grace Hopper', email: 'grace@example.com', role: 'admin' }
];

export const findUser = (id: string) => users.find((user) => user.id === id);
