'use client';
import React from 'react';
import Container from '../Container';
import { categories } from '@/utils/Categories';
import Category from './Category';
import { usePathname, useSearchParams } from 'next/navigation';

const Categories = () => {
  const params = useSearchParams();
  const category = params?.get('category');
  const pathname = usePathname();

//   console.log("Search params: ");
//   console.log(params);
//   console.log("Pathname: ", pathname);

  const isMainPage = pathname === '/';

  // only see main page
  if(!isMainPage) return null;

//   console.log("Category: ", category);
//   console.log("is Mainpage value is: ", isMainPage);

  return (
    <div className='bg-white'>
      <Container>
        <div className='pt-4 flex flex-row items-center justify-between overflow-x-auto'>
          {categories.map((item) => (
            <Category key={item.label} label={item.label} icon={item.icon} selected={category === item.label || (category === null && item.label === 'All')} />
          ))}
        </div>
      </Container>
    </div>
  );
};

export default Categories;