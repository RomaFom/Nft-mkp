import React from 'react';

import FormLogin from '@/components/Forms/Form-Login';
import PageWrapper from '@/components/Layout';

const Login: React.FC = () => {
  return (
    <>
      <PageWrapper>
        <FormLogin />
        {/*<Modal show={show} setShow={setShow} title={'Title'}>*/}
        {/*  <div>asdasdasd</div>*/}
        {/*</Modal>*/}
      </PageWrapper>
    </>
  );
};
export default Login;
