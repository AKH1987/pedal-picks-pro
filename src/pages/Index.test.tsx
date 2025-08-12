/// <reference types="vitest" />
import { describe, test, expect } from 'vitest'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Index from './Index'

describe('Index page navigation', () => {
  const setup = () => render(
    <MemoryRouter>
      <Index />
    </MemoryRouter>
  )

  test('renders all five navigation items', () => {
    const { getByText } = setup()
    expect(getByText('Løb')).toBeInTheDocument()
    expect(getByText('Axelgaard')).toBeInTheDocument()
    expect(getByText('Picks')).toBeInTheDocument()
    expect(getByText('Resultater')).toBeInTheDocument()
    expect(getByText('Stillingen')).toBeInTheDocument()
  })

  test('Axelgaard link points to /axelgaard and fills width', () => {
    const { getByRole } = setup()
    const axelLink = getByRole('link', { name: /Axelgaard/i }) as HTMLAnchorElement
    expect(axelLink).toBeInTheDocument()
    expect(axelLink.href).toContain('/axelgaard')
    expect(axelLink).toHaveClass('flex-1')
  })

  test('Løb tab stretches to fill available space', () => {
    const { getByRole } = setup()
    const lobTab = getByRole('tab', { name: /Løb/i })
    expect(lobTab).toHaveClass('w-full')
    expect(lobTab).toHaveClass('flex-1')
  })
})
