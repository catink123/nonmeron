import { Collapse, Stack, Typography } from "@mui/material";
import NonmeronIcon from "../../NonmeronIcon";
import '@fontsource/josefin-sans/variable.css';

interface FullLogoProps {
  collapseText?: boolean
}

export default function FullLogo({ collapseText }: FullLogoProps) {
  return (
    <Stack alignItems="center" direction="row">
      <NonmeronIcon fontSize="large" sx={{ marginY: 'auto', height: 'fit-content' }} />
      <Collapse in={!collapseText} orientation="horizontal">
        <Typography variant="h6" fontFamily="Josefin SansVariable" fontWeight={375} pt={0.5} sx={{ userSelect: 'none', pl: 0.5 }}>Non&Meron</Typography>
      </Collapse>
    </Stack>
  )
}