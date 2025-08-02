import { useState, useEffect } from 'react';

interface GitHubRepository {
  name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  updated_at: string;
  topics: string[];
  owner: {
    login: string;
    avatar_url: string;
  };
}

interface UseGitHubDataReturn {
  data: GitHubRepository | null;
  isLoading: boolean;
  error: string | null;
}

export const useGitHubData = (repository: string): UseGitHubDataReturn => {
  const [data, setData] = useState<GitHubRepository | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGitHubData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch(`https://api.github.com/repos/${repository}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Repository not found or is private');
          } else if (response.status === 403) {
            throw new Error('API rate limit exceeded');
          } else {
            throw new Error(`GitHub API error: ${response.status}`);
          }
        }
        
        const repoData = await response.json();
        setData(repoData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    if (repository) {
      fetchGitHubData();
    }
  }, [repository]);

  return { data, isLoading, error };
};