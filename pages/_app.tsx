import "@fontsource/josefin-sans/variable.css";
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import PageLayout from '../src/components/PageLayout'
import { LazyMotion, domAnimation, AnimatePresence, m } from 'framer-motion';
import { CssBaseline, ThemeProvider } from '@mui/material';
import Head from "next/head";
import { darkTheme } from "../src/theme";
import { pageAnimations } from "../src/pageAnimations";
import { firestore, storage } from '../src/firebase';
import { getDocs, collection } from 'firebase/firestore';
import { getDownloadURL, ref } from "firebase/storage";
import { useEffect, useState } from "react";
import { Post, PostsContext } from "../src/PostsContext";

export default function App({ Component, pageProps, router }: AppProps) {
  const [posts, setPosts] = useState<Post[]>([]);

  // Load posts from Firestore and their image URLs from Storage upon first load
  useEffect(() => {
    getDocs(collection(firestore, "posts")).then(async postsSnapshot => {
      let postArray: Post[] = await Promise.all(
        postsSnapshot.docs.map(
          async doc => {
            let fullImage = "https://via.placeholder/3000x2000?text=" + doc.id, 
                thumbnailImage = "https://via.placeholder/300x200?text=" + doc.id;
            try {
              fullImage = await getDownloadURL(ref(storage, `${doc.id}/full.jpg`));
            } catch (error: any) {
              if (error.code === 'storage/object-not-found') fullImage = "https://via.placeholder/800";
              else throw error;
            }

            try {
              thumbnailImage = await getDownloadURL(ref(storage, `${doc.id}/thumbnail.jpg`));
            } catch (error: any) {
              if (error.code === 'storage/object-not-found') thumbnailImage = "https://via.placeholder/800";
              else throw error;
            }

            return ({
              ...doc.data() as Post,
              imageURL: {
                full: fullImage,
                thumbnail: thumbnailImage
              }
            });
          }
        )
      );
      setPosts(postArray.sort((a, b) => b.timestamp.toMillis() - a.timestamp.toMillis()));
    });
  }, []);

  return (
    <PostsContext.Provider value={posts}>
      <ThemeProvider theme={darkTheme}>
        <Head>
          <title>Non&Meron</title>
          <link rel="shortcut icon" type="image/svg+xml" href="/favicon.svg" />
          <link rel="shortcut icon" type="image/png" href="/favicon.png" />
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
      </ThemeProvider>
    </PostsContext.Provider>
  )
}
