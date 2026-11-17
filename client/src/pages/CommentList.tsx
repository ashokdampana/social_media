import { useCallback, useEffect, useState } from 'react';
import api, { getApiErrorMessage } from '../services/api';
import useAuthStore from '../store/useAuthStore';
import CommentForm from './CommentForm';
import type { CommentResponse } from '../types/schema';

type CommentListResponse = {
  success: boolean;
  data: CommentResponse[];
};

export default function CommentList({ postId }: { postId: string }) {
  const user = useAuthStore((state) => state.user);
  const [comments, setComments] = useState<CommentResponse[]>([]);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    void loadComments();
  }, [loadComments]);

  return (
    <section className="comment-list">
      {loading && <p>Loading comments...</p>}
      {error && <p role="alert">{error}</p>}

      {!loading && comments.length === 0 && <p>No comments yet.</p>}

      <ul>
        {comments.map((comment) => (
          <li key={comment._id}>{comment.text}</li>
        ))}
      </ul>

      {user && <CommentForm postId={postId} onDone={loadComments} />}
    </section>
  );
}
