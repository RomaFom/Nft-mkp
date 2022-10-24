import { lazy } from "react";
import { Navigate, RouteObject } from "react-router-dom";
import Home from "@/pages/Home";
import Create from "@/pages/Create";
import { OwnerRoute, PrivateRoute } from "@/RouterWrappers";
const MyListed = lazy(() => import("@/pages/MyListed"));
const MyPurchase = lazy(() => import("@/pages/MyPurchase"));

export enum RoutePaths {
  HOME = "/",
  CREATE = "/create",
  MY_LISTINGS = "/my-listings",
  MY_PURCHASES = "/my-purchases",
  NFT_DETAILS = "/nft/:id",
}

export const routes: RouteObject[] = [
  {
    path: RoutePaths.HOME,
    element: <Home />,
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
    path: "*",
    element: (
      <Navigate replace to={RoutePaths.HOME} state={{ isRedirect: true }} />
    ),
  },
];
