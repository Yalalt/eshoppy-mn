import prisma from '@/libs/prismadb';

export default async function getOrdersByUserId(userId: string) {
  try {
    // get orders by user id
    const orders = await prisma.order.findMany({
      where: {
        userId: userId,
      },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return orders;
  } catch (error: any) {
    throw new Error(error);
  }
}
