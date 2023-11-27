import React from 'react'
import CheckoutClient from './CheckoutClient';
import Container from '../components/Container';
import FormWrap from '../components/FormWrap';

const Checkout = () => {
  return (
    <div className='p-8'>
    <Container>
        <FormWrap>
            <CheckoutClient />
        </FormWrap>
    </Container>
</div>
  )
}

export default Checkout;