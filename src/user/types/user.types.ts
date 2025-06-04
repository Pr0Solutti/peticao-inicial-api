export enum UserRolesEnum {
  ADMIN = 'admin',
  LAWYER = 'lawyer',
}
export interface IUser {
  name: string;
  email: string;
  role: UserRolesEnum;
  contact: string;
  password: string;
  creeatedAt: Date;
  updatedAt: Date;
}
