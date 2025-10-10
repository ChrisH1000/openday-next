// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.
export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  admin: boolean;
};

export type AdminUser = Omit<User, 'password'>;

export type Openday = {
  id: string;
  title: string;
  campus: string;
  starttime: number;
  endtime: number;
  status: string;
  event_count?: number;
};

export type Event = {
  id: string;
  title: string;
  description: string;
  interests: string;
  openday_fk: string;
  sessions?: Session[];
};

export type Session = {
  id: string;
  starttime: number;
  endtime: number;
  event_fk: string;
};
