import React from 'react';
import Footer from '../components/common/Footer';
import Header from '../components/common/Header';
import CourierPage from '../components/pages/CourierPage';
import Soskets from '../components/ui/sockets/soskets';

const Courier: React.FC = () => { 
  return (
    <>
      <Soskets />
      <Header /> 
      <CourierPage />
      <Footer />
    </>
  );
};

export default Courier;
