import Container from '@/app/components/Container';
import React from 'react'
import OrdersClient from './OrdersClient';
import { getCurrentUser } from '@/actions/getCurrentUser';
import NullData from '@/app/components/NullData';
import getOrders from '@/actions/getOrders';
import getOrdersByUserId from '@/actions/getOrdersByUserId';



const Orders = async () => {
  const currentUser = await getCurrentUser();

  if(!currentUser) {
    return <NullData title='Oops! Access Denied' />
  }

  const orders = await getOrdersByUserId(currentUser.id);

  if(!orders) {
    return <NullData title='Oops! No Orders Found' />
  }

  return (
    <div>
      <Container>
        <OrdersClient orders={orders} />
      </Container>
    </div>
  )
}

export default Orders;