import { MarketplaceItemDTO } from '@/types';
import { IUser } from '@/UserContext/UserContext';

export interface IResponseError {
  status: number;
  error: {
    message: string;
  };
}

interface IResponse {
  status: number;
  error?: {
    message: string;
  };
  data?: any;
}

export interface IItemCountResponse extends IResponse {
  data: {
    count: number;
  };
}

export interface IItemResponse extends IResponse {
  data: {
    items: MarketplaceItemDTO[];
  };
}

export interface IUserResponse {
  status: number;
  error?: {
    message: string;
  };
  data?: {
    id: number;
  };
}

export interface IUserResponseLogin extends IResponse {
  data: {
    token: string;
  };
}

export interface IUserDataResponse extends IResponse {
  data: {
    user: IUser;
  };
}
