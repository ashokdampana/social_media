import { z } from 'zod';


// 1. VALIDATION SCHEMAS (Runtime Zod checks)
export const userSchema = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});


export const postInputSchema = z.object({
  content: z.string().min(1, 'Post cannot be empty'),
});

export const commentInputSchema = z.object({
  text: z.string().min(1, 'Comment cannot be empty'),
});


// 2. INPUT TYPES (Forms & API Request Bodies)
export type UserInputType = z.infer<typeof userSchema>;
export type PostInputType = z.infer<typeof postInputSchema>;
export type CommentInputType = z.infer<typeof commentInputSchema>;


// 3. RESPONSE TYPES (API Outputs & UI State)
export type AuthResponse = {
  _id: string;
  token: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
};

export type CommentResponse = {
  _id: string;
  text: string;
  userId: string;
  postId: string;
  createdAt?: string;
  updatedAt?: string;
};

export type PostResponse = {
  _id: string;
  userId: string;
  content: string;
  comments?: CommentResponse[];
  createdAt?: string;
  updatedAt?: string;
};
