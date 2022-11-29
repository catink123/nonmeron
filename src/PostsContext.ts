import { Timestamp } from "firebase/firestore";
import { createContext } from "react";

export interface Post {
  id: string;
  title?: string;
  description?: string;
  timestamp: Timestamp;
  tags: string[];
  imageURL: {
    full: string;
    thumbnail: string;
  }
}

export const PostsContext = createContext<Post[]>([]);