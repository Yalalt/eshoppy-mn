'use client';
import React, { useEffect } from 'react';
import Link from 'next/link';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { AiOutlineGoogle } from 'react-icons/ai';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

import Button from '@/app/components/Button';
import Heading from '@/app/components/Heading';
import Input from '@/app/components/inputs/Input';
import { signIn } from 'next-auth/react';
import { SafeUser } from '@/types';

interface LoginFormProps {
  currentUser: SafeUser | null;
}

const LoginForm: React.FC<LoginFormProps> = ({ currentUser }) => {
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

  const router = useRouter();

  useEffect(() => {
    if(currentUser) {
      router.push('/cart');
      router.refresh();
    }
  }, []);

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);
    
    signIn('credentials', {
      ...data,
      redirect: false,
    }).then((callback) => {
      setIsLoading(false);

      if (callback?.ok) {
          router.push('/cart');
          router.refresh();
          toast.success('Logged in');
        }

        if(callback?.error) {
          toast.error(callback.error);
        }
    });
  };

  if (currentUser) {
    return <p className='text-center'>Logged in. Redirecting...</p>
  }

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
