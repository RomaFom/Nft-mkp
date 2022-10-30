import { FC, ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

import { useDapp } from '@/DappContext';
import { useUser } from '@/UserContext/UserContext';

import { checkAddressEquality } from '../../utils/helpers';

interface Props {
  redirectPath?: string;
  children: ReactNode;
}

export const OwnerRoute: FC<Props> = ({ redirectPath = '/', children }) => {
  const { wallet, owner } = useDapp();
  const { user } = useUser();
  const isOwner = checkAddressEquality(owner, wallet ? wallet : '');
  return !isOwner && !user ? (
    <Navigate to={redirectPath} replace state={{ isRedirect: true }} />
  ) : (
    <>{children}</>
  );
};
