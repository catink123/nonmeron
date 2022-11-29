import { Card, CardActionArea, CardContent, ImageList, Paper, Typography, useMediaQuery, useTheme } from "@mui/material";
import Head from "next/head";
import { useRouter } from "next/router";
import TitleContainer from "../../src/components/TitleContainer";

export default function Tools() {
  const theme = useTheme();
  const lessThanSM = useMediaQuery(theme.breakpoints.down('sm'));
  const lessThanMD = useMediaQuery(theme.breakpoints.down('md'));
  const colCount = lessThanMD ? lessThanSM ? 1 : 2 : 3;
  const router = useRouter();
  return (
    <>
      <Head>
        <title>Tools</title>
      </Head>
      <TitleContainer titleComponent={<Typography variant="h2" p={2} pb={0}>Tools</Typography>}>
        <Paper sx={{p: 1}}>
          <ImageList cols={colCount} gap={8} sx={{ margin: 0 }}>
            <Card variant="outlined">
              <CardActionArea onClick={() => router.push('/tools/stamper')}>
                <CardContent>
                  <Typography variant="h5">Stamper</Typography>
                  <Typography variant="body2">Stamp your photos with the official Non&Meron logo!</Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </ImageList>
        </Paper>
      </TitleContainer>
    </>
  )
}