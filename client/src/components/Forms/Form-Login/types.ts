import * as Yup from 'yup';

export interface ILoginForm {
  username: string;
  password: string;
}

export const loginSchema = Yup.object().shape({
  username: Yup.string()
    .required('Username is required')
    .min(3, 'Username is too short'),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
});
