import { IconButton, IconButtonProps, Tooltip } from "@mui/material";
import Link from "next/link";
import { ReactElement } from "react";

interface LinkProps extends IconButtonProps, React.PropsWithChildren {
  href: string,
  icon: ReactElement
}

export default function IconButtonLink({ href, icon, children, ...restProps }: LinkProps) {
  return (
    <Link href={href} style={{display: 'flex', alignItems: 'center'}}>
      <Tooltip title={children} disableInteractive>
        <IconButton {...restProps} size="small">{icon}</IconButton>
      </Tooltip>
    </Link>
  )
}