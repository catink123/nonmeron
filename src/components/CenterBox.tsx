import { Box, BoxProps } from "@mui/system";
import { PropsWithChildren } from "react";

interface CenterBoxProps extends BoxProps, PropsWithChildren { }

export default function CenterBox({ children, ...restProps }: CenterBoxProps) {
  return (
    <Box
      sx={{
        display: 'grid',
        placeItems: 'center',
        flexGrow: 1
      }}
      {...restProps}
    >
      {children}
    </Box>
  )
}