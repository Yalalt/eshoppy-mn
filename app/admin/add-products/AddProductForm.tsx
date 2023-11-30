'use client';
import Heading from '@/app/components/Heading';
import Input from '@/app/components/inputs/Input';
import TextArea from '@/app/components/inputs/TextArea';
import CustomeCheckBox from '@/app/components/inputs/CustomCheckBox';
import React from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { categories } from '@/utils/Categories';
import CategoryInput from '@/app/components/inputs/CategoryInput';
import { colors } from '@/utils/Colors';

export type ImageType = {
  color: string;
  colorCode: string;
  image: File | null;
};

export type UploadedImageType = {
  color: string;
  colorCode: string;
  image: string;
};

const AddProductForm = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: '',
      description: '',
      brand: '',
      category: '',
      inStock: false,
      images: [],
      price: 0,
    },
  });

  const category = watch('category');

  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  return (
    <>
      <Heading title='Add a Product' center />

      <Input id='name' label='Name' disabled={isLoading} register={register} errors={errors} required />

      <Input id='price' label='Price' disabled={isLoading} register={register} errors={errors} type='number' required />

      <Input id='brand' label='Brand' disabled={isLoading} register={register} errors={errors} required />

      <TextArea
        id='description'
        label='Description'
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />

      <CustomeCheckBox id='inStock' label='This Product is in stock' register={register} />

      <div className='w-full font-medium'>
        <div className='mb-2 font-semibold'>Select a Category</div>
        <div className='grid grid-cols-2 gap-3 md:grid-cols-3 max-h-[50vh] overflow-y-auto'>
          {categories.map((item) => {
            if (item.label === 'All') {
              return null;
            }

            return (
              <div key={item.label} className='col-span'>
                <CategoryInput
                  onClick={(category) => setCustomValue('category', category)}
                  selected={category === item.label}
                  label={item.label}
                  icon={item.icon}
                />
              </div>
            );
          })}
        </div>
      </div>
      <div className='w-full flex flex-col flex-wrap gap-4'>
        <div className=''>
          <div className='font-bold'>Select the available product colors and upload their images.</div>
          <div className='text-sm'>
            You must upload and image for each of the color slected otherwise your color selection will be ignored.
          </div>
        </div>
        <div className='grid grid-cols-2 gap-3'>
          {colors.map((color, index) => {
            return <></>;
          })}
        </div>
      </div>
    </>
  );
};

export default AddProductForm;
