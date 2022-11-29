import { Box, ImageList, Skeleton, useMediaQuery, useTheme } from "@mui/material";
import PostCard, { PostCardProps } from "./PostCard";

interface PostListProps {
  loading?: boolean,
  posts?: PostCardProps[]
}

export default function PostList({ loading, posts }: PostListProps) {
  const theme = useTheme();
  const lessThanSM = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <ImageList gap={8} cols={lessThanSM ? 2 : 3} sx={{margin: 0}}>
      {loading ? (
        Array(12).fill(null).map((_, i) => (
          <PostCard loading key={i} />
        ))
      ) : (
        posts!.map((post, i) => (
          <PostCard {...post} key={i} />
        ))
      )}
    </ImageList>
  )
}