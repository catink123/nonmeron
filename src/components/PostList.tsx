import { ImageList, useMediaQuery, useTheme } from "@mui/material";
import { getStorage } from "firebase/storage";
import { StorageProvider, useFirebaseApp } from "reactfire";
import PostCard, { Post } from "./PostCard";

interface PostListProps {
  loading?: boolean,
  posts?: Post[]
}

export default function PostList({ loading, posts }: PostListProps) {
  const theme = useTheme();
  const lessThanSM = useMediaQuery(theme.breakpoints.down('sm'));
  const app = useFirebaseApp();
  return (
    <ImageList gap={8} cols={lessThanSM ? 2 : 3} sx={{ margin: 0 }}>
      <StorageProvider sdk={getStorage(app)}>
        {loading ? (
          Array(12).fill(null).map((_, i) => (
            <PostCard loading key={i} />
          ))
        ) : (
          posts!.map((post, i) => (
            <PostCard post={post} key={i} />
          ))
        )}
      </StorageProvider>
    </ImageList>
  )
}