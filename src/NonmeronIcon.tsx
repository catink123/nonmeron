import { SvgIcon as MuiSvgIcon, styled, SvgIconProps } from "@mui/material";

const SvgIcon = styled(MuiSvgIcon, {
  name: 'NonmeronIcon',
  shouldForwardProp: prop => prop !== 'fill'
})<SvgIconProps>(() => ({
  fill: 'none',
  stroke: 'currentColor',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  strokeWidth: '2.25px',
}));

SvgIcon.defaultProps = {
  viewBox: '0 0 32 32'
}

export default function NonmeronIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M 22,3 11,20 V 6 L 2,20 m 8,9 9,-14 v 12 l 8,-12 v 10 m 4,-9 A 15,15 0 0 1 16,31 15,15 0 0 1 1,16 15,15 0 0 1 16,1 15,15 0 0 1 31,16 Z" strokeLinejoin="miter" strokeLinecap="square" />
    </SvgIcon>
  )
}