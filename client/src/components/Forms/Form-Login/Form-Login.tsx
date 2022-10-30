import { Button } from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import cn from 'classnames';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { ILoginForm, loginSchema } from '@/components/Forms/Form-Login/types';
import styles from '@/components/Forms/Forms.module.scss';
import InputWrapper from '@/components/InputWrapper/InputWrapper';
import { IUser, useUser } from '@/UserContext/UserContext';

import { User } from '../../../../utils/api';

const FormLogin: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ILoginForm>({
    resolver: yupResolver(loginSchema),
  });
  const { setUser } = useUser();
  const navigate = useNavigate();
  const onSubmit = async (values: ILoginForm): Promise<void> => {
    try {
      const { data, error, status } = await User.login(values);
      if (status !== 200 && error) {
        throw error;
      }

      localStorage.setItem('auth_mkp', data.token);
      const resGetUser = await User.getUserData(data.token);
      if (resGetUser.status !== 200) {
        throw error;
      }
      const newUser: IUser = {
        ...resGetUser.data.user,
        token: data.token,
      };
      setUser(newUser);
      navigate('/');
    } catch (err) {
      console.log('error', err);
    }
  };
  return (
    <form className={styles.formWrapper} onSubmit={handleSubmit(onSubmit)}>
      <InputWrapper labelId={'username'} labelText={'Username'}>
        <input
          className={cn(errors.username && 'invalid')}
          autoComplete={'off'}
          {...register('username')}
        />
      </InputWrapper>
      <InputWrapper labelId={'password'} labelText={'Password'}>
        <input
          className={cn(errors.password && 'invalid')}
          autoComplete={'off'}
          {...register('password')}
        />
      </InputWrapper>
      <Button
        className={styles.buttonContainer}
        type="submit"
        colorScheme="teal"
        size="md"
      >
        Login
      </Button>
    </form>
  );
};
export default FormLogin;
