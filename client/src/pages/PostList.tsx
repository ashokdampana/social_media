import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { getApiErrorMessage } from '../services/api';
import useAuthStore from '../store/useAuthStore';
import PostForm from './PostForm';
import CommentList from './CommentList';
import type { PostResponse } from '../types/schema';

type PostListResponse = {
  success: boolean;
  data: PostResponse[];
};

export default function PostList() {
  const user = useAuthStore((state) => state.user);
  const [posts, setPosts] = useState<PostResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPosts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await api.get<PostListResponse>('/posts', {
        params: { limit: 50 },
      });
      setPosts(res.data.data ?? []);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Could not load posts'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadPosts();
  }, [loadPosts]);

  return (
    <section className="post-list">
      {user ? (
        <PostForm onDone={loadPosts} />
      ) : (
        <p>
          <Link to="/login">Log in</Link> to create a post.
        </p>
      )}

      {loading && <p>Loading posts...</p>}
      {error && <p role="alert">{error}</p>}
      {!loading && !error && posts.length === 0 && <p>No posts yet.</p>}

      {posts.map((post) => (
        <article key={post._id} className="post">
          <p>{post.content}</p>
          <small>
            {post.createdAt ? new Date(post.createdAt).toLocaleString() : 'Just now'}
            {' · '}user {post.userId.slice(-6)}
          </small>
          <CommentList postId={post._id} />
        </article>
      ))}
    </section>
  );
}
