import { z } from 'zod';

// Shared Enums
export const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ID format');

// ==========================================
// 1. USER SCHEMAS & TYPES
// ==========================================
export const userInputSchema = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['userrole', 'adminrole']).default('userrole'),
});

const userOutputSchema = z.object({
  _id: z.string(),
  email: z.email(),
  role: z.enum(['userrole', 'adminrole']),
  createdAt: z.union([z.date(), z.string()]), // Handles both DB Date objects & JSON ISO strings
  updatedAt: z.union([z.date(), z.string()]),
});

export type UserInputType = z.infer<typeof userInputSchema>;
export type UserOutputType = z.infer<typeof userOutputSchema>;


// ==========================================
// 2. COMMENT SCHEMAS & TYPES
// ==========================================
export const commentInputSchema = z.object({
  text: z.string().min(1, 'Comment cannot be empty'),
  postId: z.string().min(1, 'Post ID is required'),
});

const commentOutputSchema = z.object({
  _id: z.string(),
  text: z.string(),
  userId: z.string(),
  postId: z.string(),
  user_email: z.email().optional(), // Optional if populated from User
  createdAt: z.union([z.date(), z.string()]),
  updatedAt: z.union([z.date(), z.string()]),
});

export type CommentInputType = z.infer<typeof commentInputSchema>;
export type CommentOutputType = z.infer<typeof commentOutputSchema>;


// ==========================================
// 3. POST SCHEMAS & TYPES
// ==========================================
export const postInputSchema = z.object({
  content: z.string().min(1, 'Post cannot be empty'),
});

const postOutputSchema = z.object({
  _id: z.string(),
  content: z.string(),
  author: z.string(), // Matches 'author' ObjectId in your Mongoose PostModel
  user_email: z.email().optional(), // Optional if populated from User
  comments: z.array(commentOutputSchema).default([]),
  createdAt: z.union([z.date(), z.string()]),
  updatedAt: z.union([z.date(), z.string()]),
});

export type PostInputType = z.infer<typeof postInputSchema>;
export type PostOutputType = z.infer<typeof postOutputSchema>;
