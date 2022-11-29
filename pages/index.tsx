import { Paper } from '@mui/material'
import PostList from '../src/components/PostList';
import { useContext } from 'react';
import { PostsContext } from '../src/PostsContext';

export default function Home() {
  const posts = useContext(PostsContext);
  return (
    <>
      <Paper sx={{ padding: 1 }}>
        <PostList 
          loading={posts.length === 0} 
          posts={
            posts.map(post => ({
              postID: post.id,
              title: post.title,
              imageURL: post.imageURL.thumbnail
            }))
          } 
        />
      </Paper>
    </>
  )
}
