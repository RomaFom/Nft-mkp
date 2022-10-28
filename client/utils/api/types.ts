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
