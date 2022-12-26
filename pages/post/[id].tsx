import { Paper, Skeleton, Typography, useMediaQuery, useTheme, Stack } from "@mui/material";
import { doc, DocumentReference } from "firebase/firestore";
import Head from "next/head";
import { useRouter } from "next/router"
import { useEffect, useState } from "react";
import { useFirestore, useFirestoreDocData } from "reactfire";
import { Post as IPost } from "../../src/components/PostCard";
import LikeButton from "../../src/components/postParts/LikeButton";
import PhotoContainer from "../../src/components/postParts/PhotoContainer";
import TitleContainer from "../../src/components/TitleContainer";

export default function Post() {
  const [postID, setPostID] = useState<string>();
  const theme = useTheme();

  const smallerThanSM = useMediaQuery(theme.breakpoints.down('sm'));
  const smallerThanMD = useMediaQuery(theme.breakpoints.down('md'));

  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;
    const { id: postID } = router.query;
    if (!postID || typeof postID !== 'string') {
      router.replace('/404');
      return;
    }
    setPostID(postID);
  }, [router.isReady]);

  const firestore = useFirestore();
  const postRef = doc(firestore, 'posts/' + postID) as DocumentReference<IPost>;
  const { status, data: postData } = useFirestoreDocData(postRef);
  console.log(status, JSON.stringify(postData));

  return (
    <>
      <Head>
        <title>Post</title>
      </Head>
      <Stack spacing={1} direction={{ xs: 'column', md: 'row' }}>
        <TitleContainer titleComponent={<Typography variant="h2" p={2} pb={0}>Post - {postID}</Typography>} collapseTitle={smallerThanSM} sx={{ width: '100%' }}>
          <Paper sx={{ p: 1.5 }}>
            <PhotoContainer postID={postID} />
            <LikeButton postID={postID} />
            {['loading', 'error'].includes(status) ? (
              <>
                <Skeleton width={200} />
                <Skeleton width={350} />
                <Skeleton width={300} />
              </>
            ) : (
              <>
                { postData.title ? <Typography>{postData.title}</Typography> : null }
                { postData.description ? <Typography>{postData.description}</Typography> : null }
                <Typography>from {postData.timestamp.toDate().toLocaleString()}</Typography>
              </>
            )}
          </Paper>
        </TitleContainer>
        <TitleContainer
          titleComponent={<Typography variant={smallerThanMD ? 'h3' : 'h2'} p={2} pb={0} align={smallerThanMD ? 'left' : 'center'}>Comments</Typography>}
          sx={{
            width: {
              xs: '100%',
              md: 450
            }
          }}
        >
          <Paper sx={{ p: 1.5, height: '100%' }}>
            <Typography>Comments</Typography>
          </Paper>
        </TitleContainer>
      </Stack>
    </>
  )
}