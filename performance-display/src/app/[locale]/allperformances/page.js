"use client";

import { usePathname } from 'next/navigation';
import Navigation from '../../components/Navigation';
import PerformanceTable from '../../components/PerformanceTable';
import { useState, useEffect } from 'react';

export default function AllPerformancesPage() {
  const [locale, setLocale] = useState('en');
  const pathname = usePathname();

  useEffect(() => {
    const localeFromPath = pathname.split('/')[1];
    setLocale(localeFromPath);
  }, [pathname]);

  return (
    <div className="bg-white min-h-screen text-black">
      <Navigation locale={locale} />
      <div className="p-4">
        <PerformanceTable locale={locale} />
      </div>
    </div>
  );
}
