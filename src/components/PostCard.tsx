import { Box, Card, CardActionArea, CardMedia, Skeleton } from "@mui/material";
import { Timestamp } from "firebase/firestore";
import { ref } from "firebase/storage";
import { useRouter } from "next/router";
import { useStorage, useStorageDownloadURL } from "reactfire";

export interface Post {
  id: string;
  title?: string;
  description?: string;
  timestamp: Timestamp;
  tags: string[];
}

export interface PostCardProps {
  post?: Post;
  loading?: boolean;
}

export default function PostCard({ post, loading }: PostCardProps) {
  const loadingVariant = (
    <Box
      sx={{
        height: 0,
        overflow: 'hidden',
        paddingTop: '66.67%',
        position: 'relative'
      }}
    >
      <Skeleton
        variant="rounded"
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          borderRadius: 0.75
        }}
      />
    </Box>
  );

  const router = useRouter();

  if (!post || loading) return loadingVariant;

  const storage = useStorage();
  const imageRef = ref(storage, post.id + '/thumbnail.jpg');
  const { status, data: imageURL } = useStorageDownloadURL(imageRef);
  if (['loading', 'error'].includes(status)) return loadingVariant

  return (
    <Box
      sx={{
        height: 0,
        overflow: 'hidden',
        paddingTop: '66.67%',
        position: 'relative'
      }}
    >
      <Card
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          borderRadius: 0.75
        }}
      >
        <CardActionArea onClick={() => router.push('/post/' + post.id, undefined, {scroll: false})} sx={{height: 'inherit'}}>
          <CardMedia component="img" image={imageURL} sx={{objectFit: 'cover', height: '100%'}} />
        </CardActionArea>
      </Card>
    </Box>
  )
}