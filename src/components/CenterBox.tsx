import { Box, BoxProps } from "@mui/system";

interface CenterBoxProps extends BoxProps, React.PropsWithChildren { }

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