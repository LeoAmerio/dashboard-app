import Link from 'next/link';
import NavLinks from '@/components/ui/dashboard/nav-links';
import AcmeLogo from '@/components/ui/acme-logo';
import { PowerIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { CardWithBackground } from './cards';

export default function SideNav() {
  return (
    <div className="flex h-full flex-col px-3 py-4 md:py-6">
      <CardWithBackground img='/cat.png' alt='a' />
      {/*<Link
        className="relative mb-2 flex h-20 items-end justify-start rounded-md overflow-hidden md:h-40"
        href="/"
      >
        <Image
          src="/cat.png" // Asegúrate de que esta ruta sea correcta
          alt="Logo for Background"
          layout="fill"
          objectFit="cover"
          className="absolute inset-0 z-0 opacity-70" // Ajusta la opacidad según sea necesario
          quality={100}
        />
        <div className="w-32 text-white md:w-40 z-10 relative">
          <AcmeLogo />
        </div>
  </Link>*/}
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks />
        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
        <form>
          <button className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3">
            <PowerIcon className="w-6" />
            <div className="hidden md:block">Sign Out</div>
          </button>
        </form>
      </div>
    </div>
  );
}
