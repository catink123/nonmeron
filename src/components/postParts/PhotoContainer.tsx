import { Box, Paper, Skeleton, SxProps, Theme, useTheme } from "@mui/material";
import { ref } from "firebase/storage";
import { useStorage, useStorageDownloadURL } from "reactfire";

const innerStyles: SxProps<Theme> = {
  width: {
    md: 'auto',
    xs: '100%'
  },
  height: {
    md: '100%',
    xs: 'auto'
  },
  aspectRatio: '3 / 2',
  overflow: 'hidden'
}
interface PostImageProps {
  postID: string
}
function PostImage({ postID }: PostImageProps) {
  const theme = useTheme();
  const storage = useStorage();
  const imageRef = ref(storage, postID + '/full.jpg');
  const { status, data: imageURL } = useStorageDownloadURL(imageRef);
  if (status === 'success') return (
    <Paper sx={innerStyles}>
      <Box component="img" src={imageURL} sx={{width: '100%', height: '100%', objectFit: 'contain', background: theme.palette.background.default}} />
    </Paper>
  ) 
  else return (
    <Skeleton sx={innerStyles} variant="rounded" />
  )
}

interface PhotoContainerProps {
  postID?: string;
  loading?: boolean;
}
export default function PhotoContainer({ postID }: PhotoContainerProps) {
  return (
    <Box
      sx={{
        width: '100%',
        height: {
          lg: 545,
          md: 350,
          xs: 'fit-content'
        },
        display: 'grid',
        placeItems: 'center',
        transition: 'height ease 0.25s',
        mb: 1
      }}
    >
      {postID ? ( 
        <PostImage postID={postID} />
      ) : (
        <Skeleton sx={innerStyles} variant="rounded" />
      )}
    </Box>
  )
}