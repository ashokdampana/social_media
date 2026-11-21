import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { commentInputSchema, type CommentInputType } from "../types/schema";
import api, { getApiErrorMessage } from "../services/api";

export default function CommentForm({
  postId,
  onDone,
}: {
  postId: string;
  onDone?: () => void;
}) {
  const {
    register, handleSubmit, reset, clearErrors, setError,
    formState: { errors, isSubmitting },
  } = useForm<CommentInputType>({ resolver: zodResolver(commentInputSchema) });

  const onSubmit = async (data: CommentInputType) => {
    clearErrors("root");
    try {
      await api.post(`/comments/posts/${encodeURIComponent(postId)}/comments`, data);
      reset();
      onDone?.();
    } catch (error) {
      setError("root", {
        message: getApiErrorMessage(error, "Could not add comment"),
      });
    }
  };

  return (
    <form className="comment-form" onSubmit={handleSubmit(onSubmit)}>
      <input {...register("text")} placeholder="Add a comment..." />
      {errors.text && <p>{errors.text.message}</p>}
      {errors.root && <p role="alert">{errors.root.message}</p>}
      <button disabled={isSubmitting}>{isSubmitting ? "Sending..." : "Make comment"}</button>
    </form>
  );
}
