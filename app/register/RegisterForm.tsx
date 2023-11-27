'use client';
import React, { useEffect } from 'react';
import Link from 'next/link';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { AiOutlineGoogle } from 'react-icons/ai';
import axios from 'axios';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import Heading from '@/app/components/Heading';
import Input from '@/app/components/inputs/Input';
import Button from '@/app/components/Button';
import toast from 'react-hot-toast';
import { SafeUser } from '@/types';


interface RegisterFormProps {
  currentUser: SafeUser | null;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ currentUser }) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();
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

  useEffect(() => {
    if(currentUser) {
      router.push('/cart');
      router.refresh();
    }
  }, []);

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);

    axios.post('/api/register', data).then(() => {
      toast.success('Account created successfully!');

      signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      }).then((callback) => {
        if (callback?.ok) {
          router.push('/cart');
          router.refresh();
          toast.success('Logged in');
        }

        if(callback?.error) {
          toast.error(callback.error);
        }
      }).catch((err) => {
        toast.error("Something went wrong");
      }).finally(() => {
        setIsLoading(false);
      });
    });
  }

  if (currentUser) {
    return <p className='text-center'>Logged in. Redirecting...</p>
  }

  return (
    <>
      <Heading title='Sign up for eShoppy' />

      <Button outline label='Sign up with Google' icon={AiOutlineGoogle} disabled={isLoading} onClick={() => {signIn('google')}} />
      
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