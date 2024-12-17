import { Album, Contributor, Project } from '@/types.ts';

interface ResourceTypeMap {
  projects: Project;
  albums: Album;
  contributors: Contributor;
}

type Resource = keyof ResourceTypeMap;

class ApiService<T extends Resource> {
  readonly resource: T;
  readonly resourceUrl: string;

  constructor(resource: T) {
    this.resource = resource;
    this.resourceUrl = `http://localhost:3000/${this.resource}`;
  }

  async getAll(): Promise<ResourceTypeMap[T][]> {
    const response = await fetch(this.resourceUrl);
    if (!response) {
      throw new Error(`Failed to fetch resource ${this.resource}`);
    }
    return await response.json();
  }

  async getById(id: string): Promise<ResourceTypeMap[T]> {
    const response = await fetch(`${this.resourceUrl}/${id}`);
    if (!response) {
      throw new Error(`Failed to fetch resource ${this.resource}`);
    }
    return await response.json();
  }
}

export const contributorService = new ApiService('contributors');
export const projectService = new ApiService('projects');
export const albumService = new ApiService('albums');