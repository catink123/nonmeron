import { Favorite, FavoriteBorder } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Alert, Button, Skeleton, Snackbar, SnackbarContent, Stack, Typography } from '@mui/material';
import { collection, CollectionReference, deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";
import { useState } from 'react';
import { useFirestore, useFirestoreCollection, useFirestoreDoc, useUser } from "reactfire";

interface LikeButtonProps {
  postID?: string;
  onShowLoginPrompt: () => void;
  onLikeError: () => void;
}
interface Like { }
export default function LikeButton({ postID, onShowLoginPrompt, onLikeError }: LikeButtonProps) {
  // const [isLiked, setIsLiked] = useState(false);

  const firestore = useFirestore();
  const likesCollectionRef = collection(firestore, 'posts/' + postID + '/likes') as CollectionReference<Like>;
  const { status, data: likesCollection } = useFirestoreCollection<Like>(likesCollectionRef);

  let likes: string[] = [];
  if (status === 'success') likes = likesCollection.docs.map(doc => doc.id);

  const { status: userLoadingStatus, data: user } = useUser();
  const userLikeRef = doc(firestore, 'posts/' + postID + '/likes/' + user?.email);
  const { status: likeLoadingStatus, data: userLike } = useFirestoreDoc(userLikeRef);
  const isLiked = userLike && userLike.exists();

  const isLoading = status === 'loading' || userLoadingStatus === 'loading' || likeLoadingStatus === 'loading' || !postID;

  function handleClick() {
    if (isLoading) return;
    if (user === null) {
      onShowLoginPrompt();
      return;
    }
    // setIsLiked(!isLiked);
    if (isLiked) deleteDoc(userLikeRef).catch(() => onLikeError());
    else setDoc(userLikeRef, {}).catch(() => onLikeError());
  }
  return (
    <Stack direction="row" spacing={1} alignItems="center" sx={{pb: 1}}>
      <LoadingButton
        loading={isLoading}
        variant={isLiked ? 'contained' : 'outlined'}
        startIcon={isLiked ? <Favorite /> : <FavoriteBorder />}
        loadingPosition="start"
        // @ts-ignore
        color="reddish"
        onClick={handleClick}
      >Like</LoadingButton>
      {isLoading ? (
        <Skeleton width={100} />
      ) : (
        <Typography>
          {
            likes.length === 0 ? 'No likes.' :
              (
                user && likes.includes(user.email!) ?
                  (
                    likes.length === 1 ? 'You liked this.' : `You and ${likes.length - 1} more ${likes.length - 1 === 1 ? 'person' : 'people'} liked this.`
                  )
                  : `${likes.length} ${likes.length === 1 ? 'person' : 'people'} liked this.`
              )
          }
        </Typography>
      )}
    </Stack>
  )
}
