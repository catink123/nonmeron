import { Stack, Typography } from "@mui/material";
import Head from "next/head";
import Sidebar from "../src/components/Sidebar";
import TitleContainer from "../src/components/TitleContainer";

export default function Search() {
  return (
    <>
      <Head>
        <title>Search</title>
      </Head>
      <Stack direction={{ xs: 'column-reverse', md: 'row' }} spacing={1}>
        <TitleContainer titleComponent={<Typography variant="h2" p={2} pb={0}>Search</Typography>} style={{width: '100%'}}>
        </TitleContainer>
        <Sidebar>
          <Typography>Sidebar</Typography>
        </Sidebar>
      </Stack>
    </>
  )
}