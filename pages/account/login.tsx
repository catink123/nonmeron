import { Stack, Paper, TextField, Typography, Alert, Collapse } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import Head from "next/head";
import CenterBox from "../../src/components/CenterBox";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import TitleContainer from "../../src/components/TitleContainer";
import { useAuth } from "reactfire";
import { useRouter } from "next/router";
import { browserLocalPersistence, setPersistence, signInWithEmailAndPassword } from "firebase/auth";
import ButtonLink from "../../src/components/ButtonLink";

interface LoginCredentials {
  email: string;
  password: string;
}

export default function Account() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();
  const router = useRouter();
  const auth = useAuth();
  const {
    handleSubmit,
    register,
    formState: { errors },
    clearErrors
  } = useForm<LoginCredentials>({
    mode: 'onChange',
    delayError: 1000
  });

  useEffect(() => {
    if (auth.currentUser !== null) router.replace('/account');
  }, []);

  function handleLogin(data: LoginCredentials) {
    clearErrors();
    setErrorMessage(undefined);
    setIsLoading(true);
    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        return signInWithEmailAndPassword(auth, data.email, data.password)
          .then(() => router.replace('/account'))
          .catch(err => {
            console.error(err);
            switch (err.code) {
              case 'auth/invalid-email':
                setErrorMessage('Invalid email address entered!');
                break;
              case 'auth/wrong-password':
                setErrorMessage('Wrong password!');
                break;
              case 'auth/user-not-found':
                setErrorMessage('No user with this email/password combination was found!');
                break;
              case 'auth/too-many-requests':
                setErrorMessage('Too many failed login attempts! This account is temporarily blocked. You can restore access immediately by resetting the password.');
                break;
              default:
                setErrorMessage('An unknown error occured.');
            }
            setIsLoading(false);
          });
      });
  }

  return (
    <>
      <Head>
        <title>Log In</title>
      </Head>
      <CenterBox>
        <TitleContainer titleComponent={<Typography variant="h4" align="center" p={2} pb={0}>Log In</Typography>} sx={{ maxWidth: 400, width: '100%' }}>
          <Paper sx={{ padding: 1.5 }}>
            <Collapse in={errorMessage !== undefined}>
              <Alert severity="error" sx={{ mb: 2 }}>{errorMessage}</Alert>
            </Collapse>
            <Stack spacing={2}>
              <Stack component="form" spacing={1} onSubmit={handleSubmit(handleLogin)}>
                <TextField
                  variant="outlined"
                  size="small"
                  label="Email"
                  error={errors.email !== undefined}
                  helperText={errors.email !== undefined ? errors.email?.message : ''}
                  {...register(
                    'email',
                    {
                      required: true,
                      pattern: /\w+@\w+/
                    }
                  )}
                />
                <TextField
                  variant="outlined"
                  size="small"
                  label="Password"
                  type="password"
                  error={errors.password !== undefined}
                  helperText={errors.password !== undefined ? errors.password?.message : ''}
                  {...register(
                    'password',
                    { required: true }
                  )}
                />
                <ButtonLink href="/account/reset" size="small" variant="text" fullWidth>Forgot Password?</ButtonLink>
                <LoadingButton loading={isLoading} variant="contained" type="submit">Log in</LoadingButton>
              </Stack>
            </Stack>
          </Paper>
        </TitleContainer>
      </CenterBox>
    </>
  )
}