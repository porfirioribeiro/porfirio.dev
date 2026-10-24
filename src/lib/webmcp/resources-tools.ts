import type { ResourceShape } from '#lib/resources/types.js';

type ResourceType = 'book' | 'podcast' | 'course';

export type ResourcesByType = Record<ResourceType, ResourceShape[]>;

/**
 * Tool: lists the learning resources (books, podcasts, courses) the site
 * recommends, optionally filtered to one type.
 */
export function listResourcesTool(resources: ResourcesByType) {
  const types = Object.keys(resources) as ResourceType[];
  return {
    name: 'list_resources',
    title: 'List recommended resources',
    description:
      'Lists books, podcasts, and courses the author of porfirio.dev recommends, with title, author, and link. Optionally filter to a single resource type.',
    inputSchema: {
      type: 'object',
      properties: {
        type: {
          type: 'string',
          enum: types,
          description: 'Only return resources of this type. Omit to return all types.',
        },
      },
    },
    annotations: { readOnlyHint: true },
    execute: (input: Record<string, unknown>): Record<string, unknown> => {
      const filter = typeof input.type === 'string' ? (input.type as ResourceType) : null;
      const entries = types
        .filter((type) => !filter || type === filter)
        .flatMap((type) => resources[type].map((res) => ({ type, ...res })));
      return {
        resources: entries.map(({ type, title, author, href }) => ({
          type,
          title,
          author,
          url: href,
        })),
      };
    },
  };
}
