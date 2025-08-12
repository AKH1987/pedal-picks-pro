/// <reference types="vitest" />
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { vi, describe, test, afterEach, expect } from 'vitest'
import Axelgaard from './Axelgaard'

const mockRepo = {
  name: 'test-repo',
  description: 'A test repository',
  html_url: 'https://github.com/user/test-repo',
  stargazers_count: 42,
  forks_count: 7,
  language: 'TypeScript',
  updated_at: '2024-01-01T00:00:00Z',
  topics: ['testing', 'vitest'],
  owner: { login: 'user', avatar_url: 'https://example.com/avatar.png' },
}

describe('Axelgaard page', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  test('renders repository data after loading', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => mockRepo,
    } as any)

    render(
      <MemoryRouter>
        <Axelgaard />
      </MemoryRouter>
    )

    // Wait for repo name to appear
    expect(await screen.findByText(/test-repo/i)).toBeInTheDocument()
    // Sanity check for some key fields
    expect(screen.getByText(/TypeScript/i)).toBeInTheDocument()
    expect(screen.getByText(/42/)).toBeInTheDocument()
  })

  test('shows error message on 404', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
      status: 404,
    } as any)

    render(
      <MemoryRouter>
        <Axelgaard />
      </MemoryRouter>
    )

    expect(await screen.findByText(/Repository not found or is private/i)).toBeInTheDocument()
  })
})
