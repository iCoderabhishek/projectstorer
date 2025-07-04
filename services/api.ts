import { CreateProjectData, Project } from '@/types/project';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://projecstore-api.onrender.com';

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  private async authenticatedRequest<T>(
    endpoint: string,
    token: string,
    options: RequestInit = {}
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    });
  }

  // Public endpoints
  async getAllProjects(): Promise<Project[]> {
    return this.request<Project[]>('/api/v1/projects');
  }

  async getProjectById(id: string): Promise<Project> {
    return this.request<Project>(`/api/v1/project/${id}`);
  }

  // Authenticated endpoints
  async getUserProjects(token: string): Promise<Project[]> {
    return this.authenticatedRequest<Project[]>('/api/v1/projects/me', token);
  }

  async createProject(token: string, data: CreateProjectData): Promise<Project> {
    return this.authenticatedRequest<Project>('/api/v1/projects', token, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateProject(
    token: string,
    id: string,
    data: Partial<CreateProjectData>
  ): Promise<Project> {
    return this.authenticatedRequest<Project>(`/api/v1/projects/${id}`, token, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteProject(token: string, id: string): Promise<{ success: boolean }> {
    return this.authenticatedRequest<{ success: boolean }>(`/api/v1/projects/${id}`, token, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();