import { Button, useToast } from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import cn from 'classnames';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import {
  IFormInputValues,
  signUpSchema,
} from '@/components/Forms/Form-Sign-Up/types';
import styles from '@/components/Forms/Forms.module.scss';
import InputWrapper from '@/components/InputWrapper';

import { User } from '../../../../utils/api';

const FormSignUp: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInputValues>({
    resolver: yupResolver(signUpSchema),
  });
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const toast = useToast();

  const onSubmit = async (values: IFormInputValues): Promise<void> => {
    try {
      setIsSubmitting(true);
      const { status, data, error } = await User.register(values);
      if (status !== 200 && error) {
        throw error;
      }

      if (status === 200 && data) {
        toast({
          title: 'Success',
          description: "You've successfully signed up",
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: 'top',
        });
        navigate('/login');
        // setTimeout(() => {
        //   navigate('/login');
        // }, 3000);

        console.log(data);
      }
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form className={styles.formWrapper} onSubmit={handleSubmit(onSubmit)}>
        <InputWrapper labelId={'name'} labelText={'Name'}>
          <input
            className={cn(errors.name && 'invalid')}
            autoComplete={'off'}
            {...register('name')}
          />
        </InputWrapper>

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
            type={'password'}
            {...register('password')}
          />
        </InputWrapper>

        <InputWrapper labelId={'confirmPassword'} labelText={'Confirm'}>
          <input
            className={cn(errors.confirmPassword && 'invalid')}
            autoComplete={'off'}
            type={'password'}
            {...register('confirmPassword')}
          />
        </InputWrapper>

        <Button
          className={styles.buttonContainer}
          type="submit"
          colorScheme="teal"
          size="md"
          disabled={isSubmitting}
        >
          Submit
        </Button>
      </form>
    </>
  );
};
export default FormSignUp;
