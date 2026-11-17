import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { getApiErrorMessage } from '../services/api';
import useAuthStore from '../store/useAuthStore';
import CommentForm from './CommentForm';
import type { CommentResponse } from '../types/schema';

type CommentListResponse = {
  success: boolean;
  data: CommentResponse[];
};

export default function CommentList({
  postId,
  initialComments = [],
}: {
  postId: string;
  initialComments?: CommentResponse[];
}) {
  const user = useAuthStore((state) => state.user);
  const [comments, setComments] = useState<CommentResponse[]>(initialComments);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadComments = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await api.get<CommentListResponse>(
        `/comments/posts/${encodeURIComponent(postId)}/comments`,
        { params: { limit: 50 } }
      );
      setComments(res.data.data ?? []);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Could not load comments'));
    } finally {
      setLoading(false);
    }
  }, [postId]);

  return (
    <section className="comment-list">
      {loading && <p>Loading comments...</p>}
      {error && <p role="alert">{error}</p>}

      {!loading && comments.length === 0 && <p>No comments yet.</p>}

      <h3><strong>Comments</strong></h3>
      <ul className="comment-items">
        {comments.map((comment) => (
          <li key={comment._id} className="comment-item">
            <small className="comment-author">{comment.user_email ?? 'User'}</small>
            <p className="comment-text">{comment.text}</p>
          </li>
        ))}
      </ul>

      {user ? (
        <CommentForm postId={postId} onDone={loadComments} />
      ) : (
        <p><Link to="/login">Log in</Link> to comment.</p>
      )}
    </section>
  );
}
