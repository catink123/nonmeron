import { Collapse, Stack, Typography } from "@mui/material";
import NonmeronIcon from "../../NonmeronIcon";
import '@fontsource/josefin-sans/variable.css';

interface FullLogoProps {
  collapseText?: boolean
}

export default function FullLogo({ collapseText }: FullLogoProps) {
  return (
    <Stack alignItems="center" direction="row">
      <NonmeronIcon fontSize="large"/>
      <Collapse in={!collapseText} orientation="horizontal">
        <Typography variant="h6" fontFamily="Josefin SansVariable" fontWeight={500} pt={0.5} sx={{ userSelect: 'none', pl: 0.5 }}>Non&Meron</Typography>
      </Collapse>
    </Stack>
  )
}