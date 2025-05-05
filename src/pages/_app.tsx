import { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { useSyncAuth } from '@/hooks/useSyncAuth';
import { SessionProvider } from 'next-auth/react';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <Provider store={store}>
        <SyncAuthWrapper />
        <Component {...pageProps} />
      </Provider>
    </SessionProvider>
  );
}

const SyncAuthWrapper = () => {
  useSyncAuth(); 
  return null;
};

export default MyApp;
