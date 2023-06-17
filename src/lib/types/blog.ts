export interface BlogTag {
  name: string;
  description?: string;
  link: string;
  color?: string;
}

export interface BlogPostShared {
  number: number;
  title: string;
  slug: string;
  description?: string;
  blocks: { twitter?: true; code?: true };
  link: string;
  ghUrl: string;
  date: string;
  tags: BlogTag[];
  keywords: string;
  author: BlogPostAuthor;
  body: string;
}

export interface BlogPostItem extends BlogPostShared {
  reactions: number;
  comments: number;
}

export interface BlogPostFull extends BlogPostShared {
  image?: string;
  reactions: { name: string; count: number; icon: string }[];
  isPublished: boolean;
}

export interface BlogPostAuthor {
  name: string;
  ghUrl: string;
  avatar?: string;
}

export interface BlogPostComment {
  id: number;
  ghUrl: string;
  author: BlogPostAuthor;
  body: string;
  created_at: string;
  blocks: { twitter?: true; code?: true };
  reactions: { name: string; count: number; icon: string }[];
}
