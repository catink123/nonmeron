import { Login, Logout } from "@mui/icons-material";
import LoadingButton from "@mui/lab/LoadingButton";
import { Paper, Skeleton, Stack, Typography } from "@mui/material";
import { doc } from "firebase/firestore";
import Head from "next/head";
import { useState } from "react";
import { useAuth, useFirestore, useFirestoreDocData, useUser } from "reactfire";
import ButtonLink from "../../src/components/ButtonLink";
import CenterBox from "../../src/components/CenterBox";
import TitleContainer from "../../src/components/TitleContainer";

export default function Account() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { status, data: user } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  let userData = useFirestoreDocData(doc(firestore, "users/" + user?.email)).data;

  function handleLogout() {
    setIsLoggingOut(true);
    auth.signOut()
      .then(() => {
        setIsLoggingOut(false);
      })
      .catch(err => {
        console.error(err);
      });
  }

  return (
    <>
      <Head>
        <title>Account</title>
      </Head>
      <CenterBox>
        <TitleContainer titleComponent={<Typography variant="h4" p={2} pb={0} align="center">Account</Typography>} sx={{ maxWidth: 400, width: '100%' }}>
          <Paper sx={{ padding: 1.5 }}>
            <Stack spacing={1}>
              {!['loading', 'error'].includes(status) ? (
                user === null ? (
                  <>
                    <Typography>Not currently logged in.</Typography>
                    <ButtonLink href="/account/login" variant="contained" startIcon={<Login />} fullWidth>Log in</ButtonLink>
                    <ButtonLink href="/account/register" variant="outlined" fullWidth>Register</ButtonLink>
                  </>
                ) : (
                  <>
                    <Typography>Logged in as {user.email}</Typography>
                    {userData ? (
		      <Typography>Username: {userData.nickname}</Typography>
                    ) : (
                      <Skeleton width={200} />
                    )}
                    <LoadingButton loading={isLoggingOut} variant="contained" startIcon={<Logout />} onClick={handleLogout}>Log out</LoadingButton>
                  </>
                )
              ) : (
                <>
                  <Skeleton width={200} />
                  <Skeleton width={300} />
                  <Skeleton width={250} />
                </>
              )}
            </Stack>
          </Paper>
        </TitleContainer>
      </CenterBox>
    </>
  )
}
