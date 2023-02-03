import { Stack, Paper, TextField, Typography, Alert, Collapse } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import Head from "next/head";
import CenterBox from "../../src/components/CenterBox";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import TitleContainer from "../../src/components/TitleContainer";
import { useAuth, useFirestore } from "reactfire";
import { useRouter } from "next/router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import ButtonLink from "../../src/components/ButtonLink";
import { collection, doc, setDoc } from "firebase/firestore";

interface RegisterDetails {
  username: string;
  email: string;
  password: string;
}

export default function Account() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();
  const router = useRouter();
  const auth = useAuth();
  const firestore = useFirestore();
  const {
    handleSubmit,
    register,
    formState: { errors },
    clearErrors
  } = useForm<RegisterDetails>({
    mode: 'onChange',
    delayError: 1000
  });

  useEffect(() => {
    if (auth.currentUser !== null) router.replace('/account');
  }, []);

  function handleRegister(data: RegisterDetails) {
    clearErrors();
    setErrorMessage(undefined);
    setIsLoading(true);
    createUserWithEmailAndPassword(auth, data.email, data.password)
      .then(cred => {
        setDoc(doc(firestore, 'users/' + cred.user.email!), {
          nickname: data.username
        }).then(() => router.replace('/account')).catch(err => console.error('Couldn\'t set nickname!', err));
      })
      .catch(err => {
        console.error(err);
        switch (err.code) {
          case 'auth/invalid-email':
            setErrorMessage('Invalid email address entered!');
            break;
          case 'auth/invalid-password':
            setErrorMessage('Invalid password entered!');
            break;
          case 'auth/email-already-in-use':
            setErrorMessage('Provided email address is already in use!');
            break;
          case 'auth/weak-password':
            setErrorMessage('Weak password was provided, enter a stronger one.');
            break;
          default:
            setErrorMessage('An unknown error occured.');
        }
        setIsLoading(false);
      });
  }

  return (
    <>
      <Head>
        <title>Register</title>
      </Head>
      <CenterBox>
        <TitleContainer titleComponent={<Typography variant="h4" align="center" p={2} pb={0}>Register</Typography>} sx={{maxWidth: 400, width: '100%'}}>
          <Paper sx={{ padding: 1.5 }}>
            <Collapse in={errorMessage !== undefined}>
              <Alert severity="error" sx={{mb: 2}}>{errorMessage}</Alert>
            </Collapse>
            <Stack spacing={2}>
              <Stack component="form" spacing={1} onSubmit={handleSubmit(handleRegister)}>
                <TextField
                  variant="outlined"
                  size="small"
                  label="Username"
                  error={errors.username !== undefined}
                  helperText={errors.username !== undefined ? errors.username?.message : ''}
                  {...register(
                    'username',
                    {
                      required: true,
                      pattern: /[0-9a-zA-Z]{1,32}/
                    }
                  )}
                />
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
                <LoadingButton loading={isLoading} variant="contained" type="submit">Register</LoadingButton>
              </Stack>
            </Stack>
          </Paper>
        </TitleContainer>
      </CenterBox>
    </>
  )
}