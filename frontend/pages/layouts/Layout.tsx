import Footer from '@components/footer/Footer';
import Header from '@components/header/Header';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div>
        <Header />
        {children}
      </div>

      <Footer />
    </div>
  );
};

export default Layout;
