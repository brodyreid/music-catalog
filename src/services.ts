import { AlbumWithProjects, Contributor, Project } from '@/types.ts';

type Resource = 'projects' | 'albums' | 'contributors';

const createService = <T>(resource: Resource) => {
  const resourceUrl = `http://localhost:3000/${resource}`;

  return {
    getAll: async (): Promise<T[]> => {
      const response = await fetch(resourceUrl);
      if (!response) {
        throw new Error(`Failed to fetch resource ${resource}`);
      }
      return await response.json();
    },

    getById: async (id: string): Promise<T> => {
      const response = await fetch(`${resourceUrl}/${id}`);
      if (!response) {
        throw new Error(`Failed to fetch resource ${resource}`);
      }
      return await response.json();
    },
  };
};

export const contributorService = createService<Contributor>('contributors');
export const projectService = createService<Project>('projects');
export const albumService = createService<AlbumWithProjects>('albums');
