import { headers } from 'next/headers';
import Header from './Header';

const HeaderServer = () => {
  const currentHeaders = headers();
  const currentRoute = currentHeaders.get('x-nextjs-route');
  
  return (
    <Header route={currentRoute} />
  );
};

export default HeaderServer;
