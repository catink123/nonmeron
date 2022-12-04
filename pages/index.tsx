import { Paper } from '@mui/material'
import PostList from '../src/components/PostList';
import { useFirestore, useFirestoreCollectionData } from 'reactfire';
import { collection, CollectionReference, doc } from 'firebase/firestore';
import { Post } from '../src/components/PostCard';

export default function Home() {
  const firestore = useFirestore();
  const postsCollection = collection(firestore, 'posts') as CollectionReference<Post>;
  const {status, data: posts} = useFirestoreCollectionData<Post>(postsCollection);

  return (
    <>
      <Paper sx={{ padding: 1 }}>
        <PostList 
          loading={status === 'loading'} 
          posts={
            status === 'success' ? posts.sort((a, b) => b.timestamp.toMillis() - a.timestamp.toMillis()) : undefined
          } 
        />
      </Paper>
    </>
  )
}
