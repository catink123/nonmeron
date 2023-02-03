import { Box, Paper, Skeleton, SxProps, Theme, useTheme } from "@mui/material";
import { ref } from "firebase/storage";
import { useEffect, useRef, useState } from "react";
import { useStorage, useStorageDownloadURL } from "reactfire";
import CircleProgress from "../CircleProgress";

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
  overflow: 'hidden',
  position: 'relative',
  display: 'grid',
  placeItems: 'center'
}
interface PostImageProps {
  postID: string
}
function PostImage({ postID }: PostImageProps) {
  const theme = useTheme();
  const storage = useStorage();
  const imageRef = ref(storage, postID + '/full.jpg');
  const { status, data: imageURL } = useStorageDownloadURL(imageRef);
  const [imageBlobURL, setImageBlobURL] = useState<string>();
  const [loadedValue, setLoadedValue] = useState<number>();

  const xhrRef = useRef(new XMLHttpRequest());
  xhrRef.current.onload = () => {
    setImageBlobURL(URL.createObjectURL(xhrRef.current.response));
    setLoadedValue(100);
  };
  xhrRef.current.onprogress = e => {
    console.log(e.loaded, e.total)
    setLoadedValue(e.lengthComputable ? e.loaded / e.total * 100 : undefined);
  };
  useEffect(() => {
    if (status === 'success' && xhrRef.current.readyState === xhrRef.current.OPENED) {
      xhrRef.current.open('GET', imageURL);
      xhrRef.current.send();
      setLoadedValue(0);
    }
  }, [status, xhrRef.current.readyState]);

  if (status === 'success') return (
    <Paper sx={innerStyles}>
      {imageBlobURL !== undefined ? (
        <Box component="img" src={imageBlobURL} sx={{width: '100%', height: '100%', objectFit: 'contain', background: theme.palette.background.default}} />
      ) : (
        <Skeleton sx={innerStyles} variant="rounded" animation={false} />
      )}
      <CircleProgress sx={{position: 'absolute'}} value={loadedValue} />
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