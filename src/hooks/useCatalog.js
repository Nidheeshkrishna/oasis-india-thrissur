import { useEffect, useState } from 'react';

// Hook that loads data from a catalog loader and keeps it in sync
// when the admin portal updates localStorage (same tab or other tabs).
export function useCatalog(loader) {
  const [data, setData] = useState(() => loader());

  useEffect(() => {
    const reload = () => setData(loader());
    window.addEventListener('storage', reload);
    window.addEventListener('oasis-catalog-changed', reload);
    return () => {
      window.removeEventListener('storage', reload);
      window.removeEventListener('oasis-catalog-changed', reload);
    };
  }, [loader]);

  return data;
}
