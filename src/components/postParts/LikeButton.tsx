import { Favorite, FavoriteBorder } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Stack, Typography } from '@mui/material';
import { useState } from 'react';

interface LikeButtonProps {
  postID?: string;
}
export default function LikeButton({ postID }: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState(false);
  function handleClick() {
    setIsLiked(!isLiked);
  }
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <LoadingButton
        loading={!postID}
        variant={isLiked ? 'contained' : 'outlined'}
        startIcon={isLiked ? <Favorite /> : <FavoriteBorder />}
        loadingPosition="start"
        color="reddish"
        onClick={handleClick}
      >Like</LoadingButton>
      <Typography>No one liked this!</Typography>
    </Stack>
  )
}