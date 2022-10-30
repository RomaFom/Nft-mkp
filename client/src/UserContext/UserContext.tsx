import { createContext, useContext } from 'react';

export interface IUser {
  id: number;
  name: string;
  username: string;
  wallet: string;
  token: string;
}

export type UserContextType = {
  user: IUser | null;
  setUser: (user: IUser | null) => void;
};
const UserContextDefaultValues: UserContextType = {
  user: null,
  setUser: () => null,
};

export const UserContext = createContext<UserContextType>(
  UserContextDefaultValues,
);

export const useUser = (): UserContextType => {
  return useContext(UserContext);
};
