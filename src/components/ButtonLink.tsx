import React from "react";
import Link from 'next/link';
import { Button } from "@mui/material";

interface NMLinkProps extends React.ComponentProps<typeof Button>, React.PropsWithChildren {
  href: string;
}

export default function ButtonLink({href, children, ...buttonProps}: NMLinkProps) {
  return (
    <Link href={href} passHref style={{textDecoration: 'none', color: 'inherit'}} tabIndex={-1} scroll={false}>
      <Button variant="outlined" {...buttonProps}>{children}</Button>
    </Link>
  )
}