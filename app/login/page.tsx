import React from 'react';
import LoginForm from './LoginForm';
import FormWrap from '../components/FormWrap';
import Container from '../components/Container';

const Login = () => {
  return (
    <Container>
      <FormWrap>
        <LoginForm />
      </FormWrap>
    </Container>
  );
};

export default Login;
