import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '@/components/ui/Button'

/**
 * Button Component Tests
 *
 * This is a complete example showing best practices for testing React components.
 * Use this as a reference when writing tests for other components.
 *
 * What we're testing:
 * - Rendering with different props
 * - User interactions (clicks)
 * - Different variants and sizes
 * - Loading and disabled states
 * - Accessibility
 */

describe('Button', () => {
  describe('Rendering', () => {
    it('renders with children text', () => {
      render(<Button>Click me</Button>)
      expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
    })

    it('renders with custom className', () => {
      render(<Button className="custom-class">Button</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('custom-class')
    })

    it('applies base styles', () => {
      render(<Button>Button</Button>)
      const button = screen.getByRole('button')
      // Check for base classes
      expect(button).toHaveClass('inline-flex')
      expect(button).toHaveClass('items-center')
      expect(button).toHaveClass('justify-center')
    })
  })

  describe('Variants', () => {
    it('renders primary variant by default', () => {
      render(<Button>Button</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-blue-600')
    })

    it('renders secondary variant', () => {
      render(<Button variant="secondary">Button</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-gray-200')
    })

    it('renders outline variant', () => {
      render(<Button variant="outline">Button</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('border-2')
    })

    it('renders ghost variant', () => {
      render(<Button variant="ghost">Button</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-transparent')
    })

    it('renders danger variant', () => {
      render(<Button variant="danger">Button</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-red-600')
    })
  })

  describe('Sizes', () => {
    it('renders medium size by default', () => {
      render(<Button>Button</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('h-10')
    })

    it('renders small size', () => {
      render(<Button size="sm">Button</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('h-9')
    })

    it('renders large size', () => {
      render(<Button size="lg">Button</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('h-12')
    })
  })

  describe('States', () => {
    it('handles disabled state', () => {
      render(<Button disabled>Button</Button>)
      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
      expect(button).toHaveClass('opacity-50')
    })

    it('shows loading spinner when isLoading is true', () => {
      render(<Button isLoading>Button</Button>)
      const button = screen.getByRole('button')

      // Button should be disabled during loading
      expect(button).toBeDisabled()

      // Should contain an SVG (the spinner)
      const spinner = button.querySelector('svg')
      expect(spinner).toBeInTheDocument()
      expect(spinner).toHaveClass('animate-spin')
    })

    it('disables button when isLoading is true', () => {
      render(<Button isLoading>Button</Button>)
      expect(screen.getByRole('button')).toBeDisabled()
    })

    it('renders full width', () => {
      render(<Button fullWidth>Button</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('w-full')
    })
  })

  describe('Interactions', () => {
    it('calls onClick when clicked', () => {
      const handleClick = jest.fn()
      render(<Button onClick={handleClick}>Button</Button>)

      const button = screen.getByRole('button')
      fireEvent.click(button)

      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('does not call onClick when disabled', () => {
      const handleClick = jest.fn()
      render(
        <Button onClick={handleClick} disabled>
          Button
        </Button>
      )

      const button = screen.getByRole('button')
      fireEvent.click(button)

      expect(handleClick).not.toHaveBeenCalled()
    })

    it('does not call onClick when loading', () => {
      const handleClick = jest.fn()
      render(
        <Button onClick={handleClick} isLoading>
          Button
        </Button>
      )

      const button = screen.getByRole('button')
      fireEvent.click(button)

      expect(handleClick).not.toHaveBeenCalled()
    })

    it('handles multiple clicks', () => {
      const handleClick = jest.fn()
      render(<Button onClick={handleClick}>Button</Button>)

      const button = screen.getByRole('button')
      fireEvent.click(button)
      fireEvent.click(button)
      fireEvent.click(button)

      expect(handleClick).toHaveBeenCalledTimes(3)
    })
  })

  describe('Form Integration', () => {
    it('works as submit button', () => {
      const handleSubmit = jest.fn(e => e.preventDefault())

      render(
        <form onSubmit={handleSubmit}>
          <Button type="submit">Submit</Button>
        </form>
      )

      const button = screen.getByRole('button')
      fireEvent.click(button)

      expect(handleSubmit).toHaveBeenCalledTimes(1)
    })

    it('can be reset button', () => {
      render(<Button type="reset">Reset</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('type', 'reset')
    })

    it('defaults to button type', () => {
      render(<Button>Button</Button>)
      const button = screen.getByRole('button')
      // type="button" is the default for button elements
      expect(button).toHaveAttribute('type', 'button')
    })
  })

  describe('Accessibility', () => {
    it('has proper button role', () => {
      render(<Button>Button</Button>)
      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    it('is keyboard accessible', () => {
      const handleClick = jest.fn()
      render(<Button onClick={handleClick}>Button</Button>)

      const button = screen.getByRole('button')
      button.focus()

      expect(button).toHaveFocus()
    })

    it('shows focus styles', () => {
      render(<Button>Button</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('focus-visible:outline-none')
      expect(button).toHaveClass('focus-visible:ring-2')
    })

    it('spinner has aria-hidden', () => {
      render(<Button isLoading>Button</Button>)
      const spinner = screen.getByRole('button').querySelector('svg')
      expect(spinner).toHaveAttribute('aria-hidden', 'true')
    })

    it('can have custom aria-label', () => {
      render(<Button aria-label="Custom label">Icon only</Button>)
      expect(screen.getByLabelText('Custom label')).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('handles undefined children', () => {
      render(<Button>{undefined}</Button>)
      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
    })

    it('handles empty string children', () => {
      render(<Button>{''}</Button>)
      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
    })

    it('handles JSX children', () => {
      render(
        <Button>
          <span>Click</span> <strong>me</strong>
        </Button>
      )
      expect(screen.getByRole('button')).toHaveTextContent('Click me')
    })

    it('combines multiple className props correctly', () => {
      render(
        <Button className="mt-4 text-xl" variant="secondary">
          Button
        </Button>
      )
      const button = screen.getByRole('button')
      expect(button).toHaveClass('mt-4')
      expect(button).toHaveClass('text-xl')
      expect(button).toHaveClass('bg-gray-200') // variant classes still apply
    })
  })
})

/**
 * TESTING BEST PRACTICES DEMONSTRATED HERE:
 *
 * 1. Organized with describe blocks
 *    - Groups related tests together
 *    - Makes it easy to find specific tests
 *
 * 2. Clear test names
 *    - Each test describes what it's testing
 *    - Use "it should..." or "it ..." pattern
 *
 * 3. Test behavior, not implementation
 *    - Test what users see and do
 *    - Don't test internal state or methods
 *
 * 4. Test accessibility
 *    - Use semantic queries (getByRole)
 *    - Verify ARIA attributes
 *    - Check keyboard interactions
 *
 * 5. Test edge cases
 *    - What happens with empty/undefined values?
 *    - What happens when disabled?
 *    - What happens with multiple interactions?
 *
 * 6. Arrange-Act-Assert pattern
 *    - Arrange: Set up the test (render component)
 *    - Act: Perform action (click button)
 *    - Assert: Verify result (check if function called)
 */
