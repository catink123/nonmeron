import { Paper, Typography } from "@mui/material";
import TitleContainer, { TitleContainerProps } from "./TitleContainer";

export interface SidebarProps extends React.PropsWithChildren, TitleContainerProps { }
export default function Sidebar({ children, ...restProps }: SidebarProps) {
  return (
    <TitleContainer {...restProps}>
      <Paper sx={{
        width: {
          xs: '100%',
          md: '300px'
        },
        padding: 1
      }}>
        {children}
      </Paper>
    </TitleContainer>
  )
}