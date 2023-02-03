import { Paper, Typography } from '@mui/material'
import PostList from '../src/components/PostList';
import { useFirestore, useFirestoreCollectionData } from 'reactfire';
import { collection, CollectionReference } from 'firebase/firestore';
import { Post } from '../src/components/PostCard';
import TitleContainer from '../src/components/TitleContainer';

export default function Posts() {
  const firestore = useFirestore();
  const postsCollection = collection(firestore, 'posts') as CollectionReference<Post>;
  const {status, data: posts} = useFirestoreCollectionData<Post>(postsCollection);

  return (
    <TitleContainer titleComponent={<Typography variant="h2" p={2} pb={0}>Posts</Typography>}>
      <Paper sx={{ padding: 1 }}>
        <PostList 
          loading={status === 'loading'} 
          posts={
            status === 'success' ? posts.sort((a, b) => b.timestamp.toMillis() - a.timestamp.toMillis()) : undefined
          } 
        />
      </Paper>
    </TitleContainer>
  )
}
