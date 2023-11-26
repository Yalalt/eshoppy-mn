'use client';
import React from 'react';
import Link from 'next/link';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { AiOutlineGoogle } from 'react-icons/ai';

import Button from '@/app/components/Button';
import Heading from '@/app/components/Heading';
import Input from '@/app/components/inputs/Input';

const LoginForm = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);
    console.log(data);
    // setIsLoading(false);
  };

  return (
    <>
      <Heading title='Login for eShoppy' />

      <Button outline label='Continue with Google' icon={AiOutlineGoogle} disabled={isLoading} 
      onClick={() => {}} />
      <hr className='bg-slate-300 w-full h-px' />
      <Input id='email' label='Email' disabled={isLoading} register={register} errors={errors} required />
      <Input
        id='password'
        label='Password'
        disabled={isLoading}
        register={register}
        errors={errors}
        required
        type='password'
      />

      <Button label={isLoading ? 'Loading...' : 'Login'} disabled={isLoading} onClick={handleSubmit(onSubmit)} />

      <p className='text-sm'>
        Do not have an account?{' '}
        <Link href='/register' className='underline'>
          Sign Up
        </Link>
      </p>
    </>
  );
};

export default LoginForm;
