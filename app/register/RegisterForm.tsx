'use client';
import React from 'react';
import Link from 'next/link';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { AiOutlineGoogle } from 'react-icons/ai';

import Heading from '@/app/components/Heading';
import Input from '@/app/components/inputs/Input';
import Button from '@/app/components/Button';

const RegisterForm = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: '',
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
      <Heading title='Sign up for eShoppy' />

      <Button outline label='Sign up with Google' icon={AiOutlineGoogle} disabled={isLoading} 
      onClick={() => {}} />
      <hr className='bg-slate-300 w-full h-px' />
      <Input id='name' label='Name' disabled={isLoading} register={register} errors={errors} required />
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

      <Button label={isLoading ? 'Loading...' : 'Sign up'} disabled={isLoading} onClick={handleSubmit(onSubmit)} />

      <p className='text-sm'>
        Already have an account?{' '}
        <Link href='/login' className='underline'>
          Log In
        </Link>
      </p>
    </>
  );
};

export default RegisterForm;
