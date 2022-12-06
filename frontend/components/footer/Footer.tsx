const Footer = () => {
  const start_year = 2022;
  const curr_year = new Date().getFullYear();

  return (
    <footer className="bg-gray-200 py-16 px-[5%] flex flex-col items-center">
      &#169;{' '}
      {start_year === curr_year ? start_year : `${start_year} - ${curr_year}`}{' '}
      Smart Gardening
    </footer>
  );
};

export default Footer;
