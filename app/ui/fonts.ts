import { Inter, Lusitana, Cabin } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });
const lusitana = Lusitana({ subsets: ['latin'], weight: '400' });
const cabin = Cabin({ subsets: ['latin'], weight: '400' });

export {
  inter,
  lusitana,
  cabin,
}