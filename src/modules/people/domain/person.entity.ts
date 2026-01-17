export enum PersonRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export type PersonId = string;

export type Person = {
  id: PersonId;
  name: string;
  email: string;
  role: PersonRole;
  createdAt: Date;
};
