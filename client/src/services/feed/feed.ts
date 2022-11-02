import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { MarketplaceItemDTO } from '@/types';

export const feedApi = createApi({
  reducerPath: 'feedApi',
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_APP_CORE_API }),
  endpoints: builder => ({
    getFeed: builder.query<MarketplaceItemDTO[], void>({
      query: () => '/marketplace/get-all',
      transformResponse(response: { items: MarketplaceItemDTO[] }) {
        return response.items;
      },
    }),
    getMyListings: builder.query<MarketplaceItemDTO[], any>({
      query: args => {
        return {
          url: '/marketplace/my-listings',
          headers: {
            Authorization: `Bearer ${args.token}`,
            wallet: args.userWallet,
          },
        };
      },
      transformResponse(response: { items: MarketplaceItemDTO[] }) {
        return response.items;
      },
    }),
    getMyPurchases: builder.query<MarketplaceItemDTO[], any>({
      query: args => {
        return {
          url: '/marketplace/my-purchases',
          headers: {
            Authorization: `Bearer ${args.token}`,
            wallet: args.userWallet,
          },
        };
      },
      transformResponse(response: { items: MarketplaceItemDTO[] }) {
        return response.items;
      },
    }),
  }),
});

export const {
  useGetFeedQuery,
  useGetMyListingsQuery,
  useGetMyPurchasesQuery,
} = feedApi;
