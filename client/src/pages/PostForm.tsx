import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { postInputSchema, type PostInputType } from "../types/schema";
import api, { getApiErrorMessage } from "../services/api";

export default function PostForm({ onDone }: { onDone?: () => void }) {
  const {
    register, handleSubmit, reset, clearErrors, setError,
    formState: { errors, isSubmitting },
  } = useForm<PostInputType>({ resolver: zodResolver(postInputSchema) });

  const onSubmit = async (data: PostInputType) => {
    clearErrors("root");
    try {
      await api.post("/posts", data);
      reset();
      onDone?.();
    } catch (error) {
      setError("root", {
        message: getApiErrorMessage(error, "Could not create post"),
      });
    }
  };

  return (
    <form className="post-composer" onSubmit={handleSubmit(onSubmit)}>
      <textarea {...register("content")} placeholder="Write a post..." />
      {errors.content && <p>{errors.content.message}</p>}
      {errors.root && <p role="alert">{errors.root.message}</p>}
      <button disabled={isSubmitting}>{isSubmitting ? "Posting..." : "Post"}</button>
    </form>
  );
}