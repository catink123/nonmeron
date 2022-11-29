import { Stack, Typography } from "@mui/material";
import TextLogo from "../logo/TextLogo";

export default function Footer() {
  return (
    <Stack component="footer" pt={5} pb={10} color="white">
      <TextLogo />
      <Stack>
        <Typography>Made by @catink123.</Typography>
        <Typography>Designers: @catink123, @nonoi_the_maid.</Typography>
        <Typography>Inspired by Modrinth</Typography>
      </Stack>
    </Stack>
  )
}