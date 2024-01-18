'use client';

import React, { useCallback, useEffect } from 'react';
import { FieldValues, SubmitHandler, set, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';

import Heading from '@/app/components/Heading';
import Input from '@/app/components/inputs/Input';
import TextArea from '@/app/components/inputs/TextArea';
import CustomeCheckBox from '@/app/components/inputs/CustomCheckBox';
import { categories } from '@/utils/Categories';
import CategoryInput from '@/app/components/inputs/CategoryInput';
import { colors } from '@/utils/Colors';
import SelectColor from '@/app/components/inputs/SelectColor';
import Button from '@/app/components/Button';
import firebaseApp from '@/libs/firebase';
import axios from 'axios';
import { useRouter } from 'next/navigation';

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
  const [images, setImages] = React.useState<ImageType[]>([]);
  const [isProductCreated, setIsProductCreated] = React.useState(false);
  const router = useRouter();


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
      price: '',
    },
  });

  useEffect(() => {
    setCustomValue('images', images);
  }, [images]);

  useEffect(() => {
    if (isProductCreated) {
      reset();
      setImages([]);
      setIsProductCreated(false);
    }
  }, [isProductCreated]);

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    console.log('Product Data: >>>>> ', data);
    // upload images to Firebase Storage
    // save product MongoDB
    // Firestorage docs, manage upload images
    setIsLoading(true);
    let uploadedImages: UploadedImageType[] = [];

    if (!data.category) {
      setIsLoading(false);
      return toast.error('Category is not selected!');
    }

    if (!data.images || data.images.length === 0) {
      setIsLoading(false);
      return toast.error('Not selected image!');
    }

    const handleImageUploads = async () => {
      toast('Creating product, please wait...');

      try {
        for (const item of data.images) {
          if (item.image) {
            const fileName = `${new Date().getTime()}-${item.image.name}`;
            const storage = getStorage(firebaseApp);
            const storageRef = ref(storage, `products/${fileName}`);
            const uploadTask = uploadBytesResumable(storageRef, item.image);

            await new Promise((resolve, reject) => {
              uploadTask.on(
                'state_changed',
                (snapshot) => {
                  const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                  // console.log('Upload is ' + progress + '% done');

                  switch (snapshot.state) {
                    case 'paused':
                      console.log('Upload is paused');
                      break;
                    case 'running':
                      console.log('Upload is running');
                      break;
                  }
                },
                (error) => {
                  console.log('Error: ', error);
                  reject(error);
                },
                () => {
                  getDownloadURL(uploadTask.snapshot.ref)
                    .then((downloadURL) => {
                      uploadedImages.push({
                        ...item,
                        image: downloadURL,
                      });
                      // console.log('File available at', downloadURL);
                      resolve(downloadURL);
                    })
                    .catch((error) => {
                      console.log('Error getting thee download URL: ', error);
                      reject(error);
                    });
                }
              );
            });
          }
        }
      } catch (error) {
        setIsLoading(false);
        console.log("Error handling image upoads: ", error);
        return toast.error('Error handling image uploads!');
      }
    };

    await handleImageUploads();
    const productData = {...data, images: uploadedImages};

    // save information product on MongoDB
    axios.post('/api/product', productData).then((res) => {
      setIsProductCreated(true);
      toast.success('Product created successfully!');

      router.refresh();
    }).catch((error) => {
      console.log('Error creating product: ', error);
      toast.error('Error creating product!');
    }).finally(() => {    
      setIsLoading(false);
    });
  };

  const category = watch('category');

  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const addImageToState = useCallback((value: ImageType) => {
    setImages((prev) => {
      if (!prev) {
        return [value];
      }
      return [...prev, value];
    });
  }, []);

  const removeImageFromState = useCallback((value: ImageType) => {
    setImages((prev) => {
      if (!prev) {
        return [];
      }
      return prev.filter((item) => item.color !== value.color);
    });
  }, []);

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
          {colors.map((item, index) => {
            return (
              <SelectColor
                key={index}
                item={item}
                addImageToState={() => addImageToState(item)}
                removeImageFromState={() => removeImageFromState(item)}
                isProductCreated={isProductCreated}
              />
            );
          })}
        </div>
      </div>
      <Button label={isLoading ? 'Loading...' : 'Add Product'} onClick={handleSubmit(onSubmit)} />
    </>
  );
};

export default AddProductForm;
