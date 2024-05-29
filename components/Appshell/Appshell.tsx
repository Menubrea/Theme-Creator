import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

const Appshell = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default Appshell;
