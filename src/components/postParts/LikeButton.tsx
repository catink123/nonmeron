import { Favorite, FavoriteBorder } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Skeleton, Stack, Typography } from '@mui/material';
import { collection, CollectionReference } from "firebase/firestore";
import { useState } from 'react';
import { useFirestore, useFirestoreCollection, useUser } from "reactfire";

interface LikeButtonProps {
  postID?: string;
}
interface Like {}
export default function LikeButton({ postID }: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState(false);

  const firestore = useFirestore();
  const likesCollectionRef = collection(firestore, 'posts/' + postID + '/likes') as CollectionReference<Like>;
  const { status, data: likesCollection } = useFirestoreCollection<Like>(likesCollectionRef);

  let likes: string[] = [];
  if (status === 'success') likes = likesCollection.docs.map(doc => doc.id);

  const { status: userLoadingStatus, data: user } = useUser();

  const isLoading = status === 'loading' || userLoadingStatus === 'loading' || !postID;

  function handleClick() {
    setIsLiked(!isLiked);
  }
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <LoadingButton
        loading={isLoading}
        variant={isLiked ? 'contained' : 'outlined'}
        startIcon={isLiked ? <Favorite /> : <FavoriteBorder />}
        loadingPosition="start"
        color="reddish"
        onClick={handleClick}
      >Like</LoadingButton>
      {isLoading ? (
        <Skeleton width={100} />
      ) : (
        <Typography>
          {
            likes.length === 0 
            ? 
            'No likes.' 
            :
            (
              user && likes.includes(user.email!) 
              ? 
              `You and ${likes.length - 1} more people liked this.` 
              :
              `${likes.length} people liked this.`
            )
          }
        </Typography>
      )}
    </Stack>
  )
}