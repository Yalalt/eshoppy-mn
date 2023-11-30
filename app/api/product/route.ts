import prisma from '@/libs/prismadb';
import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/actions/getCurrentUser';

export async function POST(request: Request) {
    const currentUser = await getCurrentUser();

    if(!currentUser || currentUser.role !== 'ADMIN') {
        return NextResponse.error();
    }
  const body = await request.json();
  const { name, description, price, brand, category, inStock, images } = body;


  const newProduct = await prisma.product.create({
    data: {
      name,
      description,
      brand,
      category,
      inStock,
      images,
        price: parseFloat(price),
    },
  });

  return NextResponse.json(newProduct);
}
