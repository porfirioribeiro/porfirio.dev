export type ProjectLinkLabel = 'GitHub' | 'npm';

export type ProjectLink = {
  label: ProjectLinkLabel;
  icon: 'logo-github' | 'logo-npm';
  href: string;
};

export type ProjectTech = {
  name: 'React' | 'TypeScript';
  icon: 'logo-react' | 'logo-typescript';
};

export type Project = {
  name: string;
  description: string;
  links: ProjectLink[];
  tech: ProjectTech[];
};

export const projects: Project[] = [
  {
    name: 'rc-service',
    description:
      'React Context Services — a tiny (<1 kb) dependency injection and state management library for React.',
    links: [
      {
        label: 'GitHub',
        icon: 'logo-github',
        href: 'https://github.com/porfirioribeiro/rc-service',
      },
      { label: 'npm', icon: 'logo-npm', href: 'https://www.npmjs.com/package/rc-service' },
    ],
    tech: [
      { name: 'React', icon: 'logo-react' },
      { name: 'TypeScript', icon: 'logo-typescript' },
    ],
  },
  {
    name: 'react-showof',
    description: 'A small (<500 b) opinionated component to help with mount/unmount transitions.',
    links: [
      {
        label: 'GitHub',
        icon: 'logo-github',
        href: 'https://github.com/porfirioribeiro/react-showof',
      },
      { label: 'npm', icon: 'logo-npm', href: 'https://www.npmjs.com/package/react-showof' },
    ],
    tech: [
      { name: 'React', icon: 'logo-react' },
      { name: 'TypeScript', icon: 'logo-typescript' },
    ],
  },
  {
    name: 'date-input-manager',
    description: 'Manages input state to make building date inputs straightforward and ergonomic.',
    links: [
      {
        label: 'GitHub',
        icon: 'logo-github',
        href: 'https://github.com/porfirioribeiro/date-input-manager',
      },
    ],
    tech: [{ name: 'TypeScript', icon: 'logo-typescript' }],
  },
  {
    name: 'staticmaps-react',
    description:
      'Render simple static maps with React, supporting Polygons, Markers and Overlay images. Made as a side project, never published on npm, but heavily used inside company code.',
    links: [
      {
        label: 'GitHub',
        icon: 'logo-github',
        href: 'https://github.com/porfirioribeiro/staticmaps-react',
      },
    ],
    tech: [
      { name: 'React', icon: 'logo-react' },
      { name: 'TypeScript', icon: 'logo-typescript' },
    ],
  },
  {
    name: 'openapi2ts',
    description: 'Generate TypeScript types for models and definitions from Swagger 2 JSON files.',
    links: [
      {
        label: 'GitHub',
        icon: 'logo-github',
        href: 'https://github.com/porfirioribeiro/openapi2ts',
      },
    ],
    tech: [{ name: 'TypeScript', icon: 'logo-typescript' }],
  },
];
