import { alpha, Collapse, Paper, PaperProps, useTheme } from "@mui/material";
import { ReactElement } from "react";

export interface TitleContainerProps extends React.PropsWithChildren, PaperProps {
  titleComponent?: ReactElement,
  collapseTitle?: boolean
}

export default function TitleContainer({ children, titleComponent, collapseTitle, ...restProps }: TitleContainerProps) {
  const theme = useTheme();

  return (
    <Paper sx={{ backgroundColor: alpha(theme.palette.background.paper, 0.75), backdropFilter: 'blur(20px)', boxShadow: 'none' }} {...restProps}>
      <Collapse in={!collapseTitle}>
        {titleComponent}
      </Collapse>
      {children}
    </Paper>
  )
}