import { Stack, Paper, TextField, Typography } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import Head from "next/head";
import CenterBox from "../../src/components/CenterBox";
import { useState } from "react";
import { useForm } from "react-hook-form";
import TitleContainer from "../../src/components/TitleContainer";

interface LoginCredentials {
  email: string;
  password: string;
}

export default function Account() {
  const [isLoading, setIsLoading] = useState(false);
  const {
    handleSubmit,
    register,
    formState: { errors },
    clearErrors
  } = useForm<LoginCredentials>({
    mode: 'onChange',
    delayError: 1000
  });

  function handleLogin(data: LoginCredentials) {
    console.log(data);
    clearErrors();
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  }

  return (
    <>
      <Head>
        <title>Log in</title>
      </Head>
      <CenterBox>
        <TitleContainer titleComponent={<Typography variant="h4" align="center" p={2} pb={0}>Log in</Typography>}>
          <Paper sx={{ padding: 1.5 }}>
            <Stack spacing={2}>
              <Stack component="form" spacing={1} onSubmit={handleSubmit(handleLogin)}>
                <TextField
                  variant="outlined"
                  size="small"
                  label="Email"
                  error={errors.email !== undefined}
                  helperText={errors.email !== undefined ? errors.email?.message : ''}
                  // helperText="hello"
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
                <LoadingButton loading={isLoading} variant="contained" type="submit">Log in</LoadingButton>
              </Stack>
            </Stack>
          </Paper>
        </TitleContainer>
      </CenterBox>
    </>
  )
}