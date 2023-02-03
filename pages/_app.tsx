import "@fontsource/josefin-sans/variable.css";
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import PageLayout from '../src/components/PageLayout';
import { LazyMotion, domAnimation, AnimatePresence, m } from 'framer-motion';
import { CssBaseline, ThemeProvider } from '@mui/material';
import Head from "next/head";
import { darkTheme } from "../src/theme";
import { pageAnimations } from "../src/pageAnimations";
import { AuthProvider, FirebaseAppProvider, FirestoreProvider, StorageProvider, useFirebaseApp } from "reactfire";
import environment from "../src/environment";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { PropsWithChildren } from "react";
import { getAuth } from "firebase/auth";
import { auth, firestore, storage } from "../src/firebase";

function FirebaseAppWrapper({ children }: PropsWithChildren) {
  return (
    <FirebaseAppProvider firebaseConfig={environment.firebaseConfig}>
      {children}
    </FirebaseAppProvider>
  )
}

function SdkWrapper({ children }: PropsWithChildren) {
  return (
    <AuthProvider sdk={auth}>
      <StorageProvider sdk={storage}>
        <FirestoreProvider sdk={firestore}>
          {children}
        </FirestoreProvider>
      </StorageProvider>
    </AuthProvider>
  )
}

function AppWrapper({ children }: PropsWithChildren) {
  return (
    <FirebaseAppWrapper>
      <SdkWrapper>
        <ThemeProvider theme={darkTheme}>
          {children}
        </ThemeProvider>
      </SdkWrapper>
    </FirebaseAppWrapper>
  )
}

export default function App({ Component, pageProps, router }: AppProps) {
  return (
    <AppWrapper>
      <Head>
        <title>Non&Meron</title>
      </Head>
      <CssBaseline />
      <PageLayout>
        <LazyMotion features={domAnimation}>
          <AnimatePresence
            mode="wait"
            onExitComplete={() => window.scrollTo(0, 0)}
          >
            <m.div
              key={router.route}
              variants={pageAnimations.variants}
              transition={pageAnimations.transition}
              initial="initial"
              animate="animate"
              exit="exit"
              style={{ minHeight: '100%', display: 'flex', flexDirection: 'column', flexGrow: 1 }}
            >
              <Component {...pageProps} />
            </m.div>
          </AnimatePresence>
        </LazyMotion>
      </PageLayout>
    </AppWrapper>
  )
}
