import { AppProps } from 'next/app';

import Header from '../components/Header';
import PageChangeSignal from '../components/PageChangeSignal';

import '../styles/globals.scss';

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <>
      <Header />
      <Component {...pageProps} />
      <PageChangeSignal />
    </>
  );
}

export default MyApp;
