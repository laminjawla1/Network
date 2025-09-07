import type { User } from "./user"

export type Comment = {
    id: number
    content: string
    user: User
    created_at: string
}
export type Post = {
  id: number
    content: string
    user: User
    created_at: string
    likes_count: number
    comments: Array<Comment>
    likes: Array<number>
  }
  
  export type PostContextType = {
    posts: Post[];
    next: string | null;
    previous: string | null;
    post: string;
  openUpdate: boolean;
  updatePost: string;
  postToUpdate: number | null,
  setPost: (value: string) => void;
  setUpdatePost: (value: string) => void
  setPostToUpdate: (value: number | null) => void;
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
  deletePost: (id: number) => void;
  createPost: () => void;
  editPost: (id: number | null) => void;
  loadPosts: (endpoint: string) => void;
  setOpenUpdate: (value: boolean) => void;
};

export type NotificationType = "like" | "follow" | "comment" | "post" | "system";

export type _Notification = {
  id: number;
  recipient: User;
  type: NotificationType;
  created_at: string;
  sender: User;
  message: string
  read: boolean;
};

export type NotificationContextType = {
  notifications: _Notification[];
  markAsRead: (id: number) => void;
  markAllAsRead: () => void;
  openNotification: boolean;
  setOpenNotification: React.Dispatch<React.SetStateAction<boolean>>;
};

