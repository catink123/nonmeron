import { Stack, Typography } from "@mui/material";
import '@fontsource/josefin-sans/variable.css';

export default function TextLogo() {
  return (
    <Stack spacing={0.5} alignItems="center" direction="row">
      <Typography variant="h6" fontFamily="Josefin SansVariable" fontWeight={500} pt={0.5} sx={{userSelect: 'none'}}>Non&Meron</Typography>
    </Stack>
  )
}