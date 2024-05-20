import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

const Appshell = ({ children }: { children: any }) => {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
};

export default Appshell;
