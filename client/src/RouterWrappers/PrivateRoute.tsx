import { FC, ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

import { useDapp } from '@/DappContext';

interface Props {
  redirectPath?: string;
  children: ReactNode;
}

export const PrivateRoute: FC<Props> = ({ redirectPath = '/', children }) => {
  const { wallet } = useDapp();
  return !wallet ? (
    <Navigate to={redirectPath} replace state={{ isRedirect: true }} />
  ) : (
    <>{children}</>
  );
};
