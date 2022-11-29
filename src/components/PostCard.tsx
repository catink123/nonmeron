import { Box, Card, CardActionArea, CardMedia, Skeleton } from "@mui/material";
import { useRouter } from "next/router";

export interface PostCardProps {
  postID?: string;
  title?: string;
  imageURL?: string;
  loading?: boolean;
}

export default function PostCard({ postID, title, imageURL, loading }: PostCardProps) {
  const router = useRouter();
  if (loading || !imageURL || !postID) return (
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
  )
  else return (
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
        <CardActionArea onClick={() => router.push('/post/' + postID, undefined, {scroll: false})} sx={{height: 'inherit'}}>
          <CardMedia component="img" image={imageURL} sx={{objectFit: 'cover', height: '100%'}} />
        </CardActionArea>
      </Card>
    </Box>
  )
}