import { Favorite, FavoriteBorder } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Box, Paper, Skeleton, SxProps, Theme, Typography, useMediaQuery, useTheme, Stack } from "@mui/material";
import { motion } from "framer-motion";
import Head from "next/head";
import { useRouter } from "next/router"
import { useEffect, useState } from "react";
import TitleContainer from "../../src/components/TitleContainer";

interface PhotoContainerProps {
  imageURL?: string;
  loading?: boolean;
}
const innerStyles: SxProps<Theme> = {
  width: {
    sm: 'auto',
    xs: '100%'
  },
  height: {
    sm: '100%',
    xs: 'auto'
  },
  aspectRatio: '3 / 2'
}
function PhotoContainer({ imageURL, loading }: PhotoContainerProps) {
  return (
    <Box
      sx={{
        width: '100%',
        height: {
          md: 450,
          sm: 350,
          xs: 'fit-content'
        },
        display: 'grid',
        placeItems: 'center',
        transition: 'height ease 0.25s',
        mb: 1
      }}
    >
      {loading ? (
        <Skeleton sx={innerStyles} variant="rounded" />
      ) : (
        <Paper></Paper>
      )}
    </Box>
  )
}

export default function Post() {
  const [postID, setPostID] = useState<string>();
  const [isLoading, setIsLoading] = useState(true);
  const theme = useTheme();

  const smallerThanSM = useMediaQuery(theme.breakpoints.down('sm'));

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

  return (
    <>
      <Head>
        <title>Post</title>
      </Head>
      <Stack spacing={1} direction={{xs: 'column', md: 'row'}}>
        <TitleContainer titleComponent={<Typography variant="h2" p={2} pb={0}>Post - {postID}</Typography>} collapseTitle={smallerThanSM} sx={{width: '100%'}}>
          <Paper sx={{ p: 1.5 }}>
            {isLoading ? (
              <>
                <PhotoContainer loading />
                <LoadingButton loading variant="outlined" startIcon={<FavoriteBorder />} loadingPosition="start">Like</LoadingButton>
                <Skeleton width={200} />
                <Skeleton width={350} />
                <Skeleton width={300} />
              </>
            ) : null}
          </Paper>
        </TitleContainer>
        <TitleContainer 
          titleComponent={<Typography variant="h4" p={2} pb={0}>Comments</Typography>} 
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