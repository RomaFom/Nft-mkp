import { FC, ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

import { useUser } from '@/UserContext/UserContext';

interface Props {
  redirectPath?: string;
  children: ReactNode;
}

export const PrivateRoute: FC<Props> = ({ redirectPath = '/', children }) => {
  const { user } = useUser();

  return !user ? (
    <Navigate to={redirectPath} replace state={{ isRedirect: true }} />
  ) : (
    <>{children}</>
  );
};
