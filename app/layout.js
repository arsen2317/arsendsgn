import localFont from 'next/font/local';
import { Forum } from 'next/font/google';
import { LangProvider } from '../context/LangContext';
import './globals.css';

const glasstown = localFont({
  src: '../public/fonts/GlasstownNbp.ttf',
  variable: '--font-ui',
  display: 'swap',
});

const forum = Forum({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata = {
  title: 'Arsen Arakelyan — Product Designer',
  description: 'Product designer portfolio',
  other: { 'theme-color': '#faf6ef' },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru" className={`${glasstown.variable} ${forum.variable}`}>
      <body>
        <LangProvider>{children}</LangProvider>
      </body>
    </html>
  );
}
