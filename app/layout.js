import localFont from 'next/font/local';
import { Cormorant } from 'next/font/google';
import './globals.css';

const fkRaster = localFont({
  src: '../public/fonts/FKRasterGrotesk.ttf',
  variable: '--font-ui',
  display: 'swap',
});

const cormorant = Cormorant({
  subsets: ['latin'],
  weight: ['500'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata = {
  title: 'Arsen Arakelyan — Product Designer',
  description: 'Product designer portfolio',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${fkRaster.variable} ${cormorant.variable}`}>
      <body>{children}</body>
    </html>
  );
}
