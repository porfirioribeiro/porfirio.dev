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
  link: string;
  ghUrl: string;
  created_at: string;
  tags: BlogTag[];
  keywords: string;
  author: BlogPostAuthor;
}

export interface BlogPostItem extends BlogPostShared {
  reactions: number;
  comments: number;
}

export interface BlogPostFull extends BlogPostShared {
  body: string;
  blocks: { twitter?: true; code?: true };
  description?: string;
  image?: string;
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
  // reactions: number;
}
