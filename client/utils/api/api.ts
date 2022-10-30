import axios, { AxiosError, AxiosResponse } from 'axios';

import { ILoginForm } from '@/components/Forms/Form-Login/types';
import { IFormSignUp } from '@/components/Forms/Form-Sign-Up/types';
import { ISendTx } from '@/types';

import {
  IItemCountResponse,
  IUserDataResponse,
  IUserResponse,
  IUserResponseLogin,
} from './types';

const instance = axios.create({
  baseURL: 'http://localhost:8080/',
  timeout: 15000,
});

const responseBody = (response: AxiosResponse): any => {
  return {
    status: response.status,
    data: response.data,
  };
};
const errorBody = (error: AxiosError): any => {
  return {
    status: error.response?.status || -1,
    error: error.response?.data || {
      error: {
        message: 'Unknown error on api client',
      },
    },
  };
};

const requests = {
  get: (url: string, Authorization?: string) =>
    instance
      .get(url, {
        headers: {
          Authorization: Authorization,
        },
      })
      .then(responseBody),
  post: (url: string, body: any) =>
    instance.post(url, body).then(responseBody).catch(errorBody),
  put: (url: string, body: any) => instance.put(url, body).then(responseBody),
  delete: (url: string) => instance.delete(url).then(responseBody),
};

export const Transaction = {
  addNew: (tx: ISendTx): Promise<number> =>
    requests.post('transaction/add', tx),

  // getPosts: (): Promise<PostType[]> => requests.get('posts'),
  // getAPost: (id: number): Promise<PostType> => requests.get(`posts/${id}`),
  // createPost: (post: PostType): Promise<PostType> =>
  //     requests.post('posts', post),
  // updatePost: (post: PostType, id: number): Promise<PostType> =>
  //     requests.put(`posts/${id}`, post),
  // deletePost: (id: number): Promise<void> => requests.delete(`posts/${id}`),
};

export const User = {
  register: (user: IFormSignUp): Promise<IUserResponse> =>
    requests.post('/auth/sign-up', user),
  login: (user: ILoginForm): Promise<IUserResponseLogin> =>
    requests.post('/auth/sign-in', user),
  getUserData: (token: string): Promise<IUserDataResponse> =>
    requests.get('/auth/get-user-data', `Bearer ${token}`),
};

export const MkpApi = {
  getCount: (): Promise<IItemCountResponse> =>
    requests.get('/marketplace/item-count'),
};
