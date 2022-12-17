import { useState, useEffect } from 'react';
import { AiTwotoneSetting } from 'react-icons/ai';

import { useRouter } from 'next/router';

import styles from './pageChangeSignal.module.scss';

export default function PageChangeSignal() {
  const [ isPageTransitioning, setIsPageTransitioning ] = useState(false);
  const router = useRouter();

  function handlePageChangeStart() {
    setIsPageTransitioning(true)
  }
  function handlePageChangeEnd() {
    setIsPageTransitioning(false)
  }

  useEffect(() => {
    router.events.on('routeChangeStart', handlePageChangeStart);
    router.events.on('routeChangeComplete', handlePageChangeEnd);

    return () => {
      router.events.off('routeChangeStart', handlePageChangeStart);
      router.events.off('routeChangeComplete', handlePageChangeEnd);
    }
  }, [])

  return (
    <span 
      className={`${
        styles.pageChangeSignalWrapper
      } ${
        isPageTransitioning ? styles.show : ''
      }`}
    >
      <AiTwotoneSetting size={48} />
    </span>
  );
}
