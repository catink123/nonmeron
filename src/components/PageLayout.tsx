import React from "react";
import { Box, Container, Stack } from "@mui/material";
import Header from "./pageParts/Header";
import Footer from "./pageParts/Footer";

export default function PageLayout(props: React.PropsWithChildren) {
  return (
    <Container maxWidth="lg" sx={{paddingX: 1, minHeight: '100vh'}} disableGutters>
      <Stack spacing={1}>

        <Header />

        <Box component="main" sx={{minHeight: 'calc(100vh - 56px)', display: 'flex', flexDirection: 'column'}}>
          {props.children}
        </Box>

        <Footer />
        
      </Stack>
    </Container>
  )
}