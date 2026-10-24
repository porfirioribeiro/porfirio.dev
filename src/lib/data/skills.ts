export type SkillCategory = {
  name: string;
  items: string[];
};

export const skillCategories: SkillCategory[] = [
  {
    name: 'Working with',
    items: [
      'Vue with Typescript',
      'Pinia',
      'Nuxt',
      'SCSS / PostCSS / CSS Modules',
      'Microservices with Docker / Kubernetes',
    ],
  },
  {
    name: 'Previous experience',
    items: [
      'React with TypeScript',
      'SCSS / PostCSS / CSS Modules',
      'Spring Boot with Java / Kotlin',
      'Spring WebMVC / Spring WebFlux',
      'PostgreSQL',
      'Hibernate / JPA / R2DBC',
      'Microservices with Docker / Kubernetes',
      'Firebase',
      'Flutter with Dart',
    ],
  },
  {
    name: 'Having fun & exploring',
    items: ['Deno', 'Svelte / SvelteKit', 'Reactive Streams and RSocket', 'Rust (SQLx, actix-web)'],
  },
];
