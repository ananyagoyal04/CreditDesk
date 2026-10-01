import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <Header />
      <main className="app-main">
        <div className="main-content">
          <div className="content-wrapper">
            {children}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};
