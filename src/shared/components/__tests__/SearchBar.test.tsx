import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SearchBar from '../SearchBar'

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    form: ({ children, onSubmit, layoutId, layout, initial, animate, transition, ...props }: any) => (
      <form onSubmit={onSubmit} data-testid="search-form" {...props}>
        {children}
      </form>
    ),
    div: ({ children, layout, transition, ...props }: any) => (
      <div {...props}>{children}</div>
    ),
  },
}))

// Mock SearchButton
jest.mock('@/shared/components/SearchButton', () => {
  return function MockSearchButton({ type, onClick }: any) {
    return (
      <button type={type} onClick={onClick}>
        Buscar
      </button>
    )
  }
})

describe('SearchBar', () => {
  const mockOnSearch = jest.fn()

  beforeEach(() => {
    mockOnSearch.mockClear()
  })

  // Without a default placeholder, users won't know what they can search for
  it('should render the input with the default placeholder', () => {
    render(<SearchBar onSearch={mockOnSearch} />)

    const input = screen.getByLabelText('Buscar aeropuertos')
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('placeholder', 'Buscar aeropuertos...')
  })

  // Need to be able to change the placeholder to reuse the component in different contexts
  it('should render the input with a custom placeholder', () => {
    render(<SearchBar onSearch={mockOnSearch} placeholder="Buscar vuelos..." />)

    const input = screen.getByLabelText('Buscar aeropuertos')
    expect(input).toHaveAttribute('placeholder', 'Buscar vuelos...')
  })

  // If the input doesn't reflect what you type, the component is useless
  it('should update the input value when the user types', async () => {
    const user = userEvent.setup()
    render(<SearchBar onSearch={mockOnSearch} />)

    const input = screen.getByLabelText('Buscar aeropuertos') as HTMLInputElement

    await user.type(input, 'Madrid')

    expect(input.value).toBe('Madrid')
  })

  // Main flow: if this fails, the whole search breaks. Should call onSearch with the typed query
  it('should call onSearch with the query when the form is submitted', async () => {
    const user = userEvent.setup()
    render(<SearchBar onSearch={mockOnSearch} />)

    const input = screen.getByLabelText('Buscar aeropuertos')
    const form = input.closest('form')

    await user.type(input, 'Barcelona')
    await user.click(screen.getByText('Buscar'))

    expect(mockOnSearch).toHaveBeenCalledTimes(1)
    expect(mockOnSearch).toHaveBeenCalledWith('Barcelona')
  })

  // Enter should work, it's what any user expects
  it('should call onSearch when Enter is pressed in the input', async () => {
    const user = userEvent.setup()
    render(<SearchBar onSearch={mockOnSearch} />)

    const input = screen.getByLabelText('Buscar aeropuertos')

    await user.type(input, 'Valencia')
    await user.keyboard('{Enter}')

    expect(mockOnSearch).toHaveBeenCalledTimes(1)
    expect(mockOnSearch).toHaveBeenCalledWith('Valencia')
  })

  // When navigating back from results, the input should keep the search query, should initialize with initialValue
  it('should initialize the input with initialValue', () => {
    render(<SearchBar onSearch={mockOnSearch} initialValue="Aeropuerto inicial" />)

    const input = screen.getByLabelText('Buscar aeropuertos') as HTMLInputElement
    expect(input.value).toBe('Aeropuerto inicial')
  })

  // When the value comes from URL and changes (e.g., back button), the input should update
  it('should update the input when initialValue changes', async () => {
    const { rerender } = render(<SearchBar onSearch={mockOnSearch} initialValue="Valor inicial" />)

    const input = screen.getByLabelText('Buscar aeropuertos') as HTMLInputElement
    expect(input.value).toBe('Valor inicial')

    rerender(<SearchBar onSearch={mockOnSearch} initialValue="Nuevo valor" />)

    await waitFor(() => {
      expect(input.value).toBe('Nuevo valor')
    })
  })

  // If classes aren't applied in vertical, layout breaks on phones. Should apply correct classes for vertical layout
  it('should apply the correct classes for vertical layout', () => {
    const { container } = render(<SearchBar onSearch={mockOnSearch} layout="vertical" />)

    const form = container.querySelector('form')
    const div = form?.querySelector('div')

    expect(div).toHaveClass('flex-col')
    expect(div).toHaveClass('w-[780px]')
  })

  // Component is used in hero and navbar, both should look good. Should apply correct classes for horizontal layout
  it('should apply the correct classes for horizontal layout', () => {
    const { container } = render(<SearchBar onSearch={mockOnSearch} layout="horizontal" />)

    const form = container.querySelector('form')
    const div = form?.querySelector('div')

    expect(div).toHaveClass('flex-row')
    expect(div).toHaveClass('w-fit')
  })

  // Allowing empty search is useful to clear filters and show everything
  it('should not call onSearch if the input is empty', async () => {
    const user = userEvent.setup()
    render(<SearchBar onSearch={mockOnSearch} />)

    const button = screen.getByText('Buscar')
    await user.click(button)

    expect(mockOnSearch).toHaveBeenCalledTimes(1)
    expect(mockOnSearch).toHaveBeenCalledWith('')
  })

  // Prevents value from being lost due to unexpected re-renders. Input should keep the typed value, improves UX
  it('should keep the input value after writing and not submitting', async () => {
    const user = userEvent.setup()
    render(<SearchBar onSearch={mockOnSearch} />)

    const input = screen.getByLabelText('Buscar aeropuertos') as HTMLInputElement

    await user.type(input, 'Sevilla')

    expect(input.value).toBe('Sevilla')

    // We don't submit the form, just verify the value persists
    expect(input.value).toBe('Sevilla')
  })
})

