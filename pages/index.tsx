import { Paper, Typography, useTheme, useMediaQuery } from '@mui/material'
import TitleContainer from '../src/components/TitleContainer';
import CenterBox from '../src/components/CenterBox';

export default function Home() {
  const theme = useTheme();
  const lessThanSM = useMediaQuery(theme.breakpoints.down('sm'));
  const lessThanMD = useMediaQuery(theme.breakpoints.down('md'));
  const titleSize = lessThanMD ? lessThanSM ? 'h3' : 'h2' : 'h1';
  const subtitleSize = lessThanSM ? 'h4' : 'h3';

  return (
    <CenterBox>
      <TitleContainer titleComponent={<Typography variant={titleSize} p={4} pb={0} align="center">Non&Meron Home</Typography>}>
        <Paper sx={{ padding: 2 }}>
          <Typography variant={subtitleSize} align="center">Welcome to our photography website!</Typography>
          <Typography>This website is a project led by two hobbyists by the name of Merona and Nonoi. 
            Here you will find our photos with different style and color schemes. <br /> 
            As you might've or might not have guessed, we are almost the same, but at the same time are almost opposite to each other. 
            This "sameness" and "opposition" you will notice in different styled photos we've taken over the years. 
            If you like our content, there's an ability to like or even comment, so don't hesitate to do that!</Typography>
          <Typography variant="h6" align="center">Head on over to the Posts section and check out the photos!</Typography>
        </Paper>
      </TitleContainer>
    </CenterBox>
  )
}
