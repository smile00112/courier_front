import React from 'react';
import Footer from '../components/common/Footer';
import Header from '../components/common/Header';
import HomePage from '../components/pages/HomePage';
import Soskets from '../components/ui/sockets/soskets';

const Main: React.FC = () => {

  return (
    <>
      <Soskets />
      <Header />
      <HomePage />
      <Footer />
    </>
  );
};

export default Main;
