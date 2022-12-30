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
}

export interface BlogPostItem extends BlogPostShared {
  reactions: number;
  comments: number;
}

export interface BlogPostFull extends BlogPostShared {
  body: string;
  blocks: { twitter: boolean; code: boolean };
  description?: string;
  image?: string;
}
