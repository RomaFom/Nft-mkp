import { lazy } from 'react';
import { Navigate, RouteObject } from 'react-router-dom';

import Create from '@/pages/Create';
import Home from '@/pages/Home';
import { OwnerRoute, PrivateRoute } from '@/RouterWrappers';
const MyListed = lazy(() => import('@/pages/MyListed'));
const MyPurchase = lazy(() => import('@/pages/MyPurchase'));
const SignUp = lazy(() => import('@/pages/SignUp'));
const Login = lazy(() => import('@/pages/Login'));
export enum RoutePaths {
  HOME = '/',
  CREATE = '/create',
  MY_LISTINGS = '/my-listings',
  MY_PURCHASES = '/my-nfts',
  NFT_DETAILS = '/nft/:id',
  SIGN_UP = '/sign-up',
  LOGIN = '/login',
}

export const routes: RouteObject[] = [
  {
    path: RoutePaths.HOME,
    element: <Home />,
  },
  {
    path: RoutePaths.SIGN_UP,
    element: <SignUp />,
  },
  {
    path: RoutePaths.LOGIN,
    element: <Login />,
  },
  {
    path: RoutePaths.CREATE,
    element: (
      <OwnerRoute>
        <Create />
      </OwnerRoute>
    ),
  },
  {
    path: RoutePaths.MY_LISTINGS,
    element: (
      <PrivateRoute>
        <MyListed />
      </PrivateRoute>
    ),
  },
  {
    path: RoutePaths.MY_PURCHASES,
    element: (
      <PrivateRoute>
        <MyPurchase />
      </PrivateRoute>
    ),
  },
  {
    path: '*',
    element: (
      <Navigate replace to={RoutePaths.HOME} state={{ isRedirect: true }} />
    ),
  },
];
