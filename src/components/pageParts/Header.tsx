import "@fontsource/josefin-sans/variable.css";
import { 
  Home, 
  HomeOutlined, 
  Search, 
  SearchOutlined, 
  AccountCircle, 
  AccountCircleOutlined, 
  Construction, 
  ConstructionOutlined, 
  LandscapeOutlined,
  Landscape
} from "@mui/icons-material";
import { alpha, Paper, Slide, Stack, useMediaQuery, useScrollTrigger, useTheme } from "@mui/material";
import { useRouter } from "next/router";
import React, { PropsWithChildren, ReactElement } from "react";
import ButtonLink from "../ButtonLink";
import IconButtonLink from "../IconButtonLink";
import FullLogo from "../logo/FullLogo";
import IconLogo from "../logo/IconLogo";
import Spacer from "../Spacer";

interface HeaderLink {
  href: string,
  iconNormal: ReactElement,
  iconActive: ReactElement,
  label: string,
  alwaysIcon?: boolean
}
interface HeaderLinkLayout {
  left: HeaderLink[],
  right: HeaderLink[]
}

const links: HeaderLinkLayout = {
  left: [
    {
      href: '/',
      iconNormal: <HomeOutlined />,
      iconActive: <Home />,
      label: 'Home',
      alwaysIcon: true
    },
    {
      href: '/posts',
      iconNormal: <LandscapeOutlined />,
      iconActive: <Landscape />,
      label: 'Posts'
    },
    {
      href: '/search',
      iconNormal: <SearchOutlined />,
      iconActive: <Search />,
      label: 'Search'
    },
    {
      href: '/tools',
      iconNormal: <ConstructionOutlined />,
      iconActive: <Construction />,
      label: 'Tools'
    },
  ],
  right: [
    {
      href: '/account',
      iconNormal: <AccountCircleOutlined />,
      iconActive: <AccountCircle />,
      label: 'Account'
    }
  ]
}

interface HOSProps extends PropsWithChildren {children: ReactElement}
function HideOnScroll({ children }: HOSProps) {
  const trigger = useScrollTrigger();
  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  )
}

export default function Header() {
  const { asPath } = useRouter();
  const theme = useTheme();
  const lessThanSM = useMediaQuery(theme.breakpoints.down('sm'));
  const lessThanMD = useMediaQuery(theme.breakpoints.down('md'));
  return (
    <HideOnScroll>
      <Paper
        sx={{
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          padding: 1,
          position: 'sticky',
          top: 0,
          zIndex: 2,
          backgroundColor: alpha(theme.palette.background.paper, 0.85),
          backdropFilter: 'blur(10px)'
        }}
        component="header"
      >
        <Stack direction="row" spacing={1}>
          <FullLogo collapseText={lessThanSM} />
          {links.left.map((link, i) =>
            lessThanSM || (i >= 1 && lessThanMD) || link.alwaysIcon ? (
              <IconButtonLink
                key={link.href}
                href={link.href}
                icon={link.href === asPath ? link.iconActive : link.iconNormal}
                color={link.href === asPath ? 'primary' : 'default'}
              >{link.label}</IconButtonLink>
            ) : (
              <ButtonLink
                key={link.label}
                href={link.href}
                startIcon={link.href === asPath ? link.iconActive : link.iconNormal}
                variant={link.href === asPath ? 'contained' : 'outlined'}
              >{link.label}</ButtonLink>
            )
          )}

          <Spacer />

          {links.right.map((link, i) => 
            lessThanSM || (i >= 1 && lessThanMD) ? (
              <IconButtonLink
                key={link.href}
                href={link.href}
                icon={link.href === asPath ? link.iconActive : link.iconNormal}
                color={link.href === asPath ? 'primary' : 'default'}
              >{link.label}</IconButtonLink>
            ) : (
              <ButtonLink
                key={link.label}
                href={link.href}
                startIcon={link.href === asPath ? link.iconActive : link.iconNormal}
                variant={link.href === asPath ? 'contained' : 'outlined'}
              >{link.label}</ButtonLink>
            )
          )}
        </Stack>
      </Paper>
    </HideOnScroll>
  )
}
