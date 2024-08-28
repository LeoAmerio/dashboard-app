import { Metadata } from 'next';
import { montserrat } from '../components/ui/fonts';
import '../components/ui/global.css';

export const metadata: Metadata = {
  title: {
    template: '%s | App Dashboard',
    default: 'Acme Dashboard',
  },
  description: 'This project is a dashboard app, created while i´m learning Next.Js',
  // metadataBase: new URL('https://dashboard-app.com'), Aqui poner la URL cuando deploye mi app
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${montserrat.className} antialiased`}>
        {children}
        <footer className='flex justify-center items-center py-10'>
          Footer Here!
        </footer>
      </body>
    </html>
  );
}
