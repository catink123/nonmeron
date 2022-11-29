import { Login } from "@mui/icons-material";
import { Button, Paper, Stack, Typography } from "@mui/material";
import Head from "next/head";
import ButtonLink from "../../src/components/ButtonLink";
import CenterBox from "../../src/components/CenterBox";
import TitleContainer from "../../src/components/TitleContainer";

export default function Account() {
  return (
    <>
      <Head>
        <title>Account</title>
      </Head>
      <CenterBox>
        <TitleContainer titleComponent={<Typography variant="h4" p={2} pb={0} align="center">Account</Typography>}>
          <Paper sx={{ padding: 1.5 }}>
            <Stack spacing={2}>
              <Typography>Not currently logged in.</Typography>
              <ButtonLink href="/account/login" variant="contained" startIcon={<Login />} fullWidth>Log in</ButtonLink>
            </Stack>
          </Paper>
        </TitleContainer>
      </CenterBox>
    </>
  )
}