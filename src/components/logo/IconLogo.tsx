import { Stack } from "@mui/material";
import NonmeronIcon from "../../NonmeronIcon";

export default function IconLogo() {
  return (
    <Stack spacing={0.5} alignItems="center" direction="row">
      <NonmeronIcon fontSize="large" sx={{marginY: 'auto', height: 'fit-content'}} />
    </Stack>
  )
}