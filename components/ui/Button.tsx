// src/components/ui/Button.tsx
import { ButtonHTMLAttributes, forwardRef } from 'react'
import { clsx } from 'clsx'

/**
 * Button Component
 *
 * A reusable, accessible button with multiple variants and sizes
 * Follows best practices for React components
 *
 * Features:
 * - Multiple variants (primary, secondary, outline, ghost, danger)
 * - Multiple sizes (sm, md, lg)
 * - Loading state with spinner
 * - Full width option
 * - Proper TypeScript types
 * - Accessible (keyboard navigation, ARIA attributes)
 */

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  fullWidth?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      fullWidth = false,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'

    const variantStyles = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500',
      secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus-visible:ring-gray-500',
      outline:
        'border-2 border-gray-300 bg-transparent hover:bg-gray-50 focus-visible:ring-gray-500',
      ghost: 'bg-transparent hover:bg-gray-100 focus-visible:ring-gray-500',
      danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500',
    }

    const sizeStyles = {
      sm: 'h-9 px-3 text-sm rounded-md',
      md: 'h-10 px-4 text-base rounded-md',
      lg: 'h-12 px-6 text-lg rounded-lg',
    }

    return (
      <button
        ref={ref}
        className={clsx(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && 'w-full',
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg
            className="mr-2 h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

/**
 * USAGE EXAMPLES:
 *
 * // Basic button
 * <Button>Click me</Button>
 *
 * // Different variants
 * <Button variant="secondary">Secondary</Button>
 * <Button variant="outline">Outline</Button>
 * <Button variant="ghost">Ghost</Button>
 * <Button variant="danger">Delete</Button>
 *
 * // Different sizes
 * <Button size="sm">Small</Button>
 * <Button size="md">Medium</Button>
 * <Button size="lg">Large</Button>
 *
 * // Loading state
 * <Button isLoading>Processing...</Button>
 * <Button isLoading disabled>Processing...</Button>
 *
 * // Full width
 * <Button fullWidth>Full Width Button</Button>
 *
 * // With onClick handler
 * <Button onClick={() => console.log('clicked')}>
 *   Click Handler
 * </Button>
 *
 * // Form submit button
 * <Button type="submit">Submit Form</Button>
 *
 * // Disabled
 * <Button disabled>Disabled</Button>
 *
 * // Custom className
 * <Button className="mt-4">With Custom Class</Button>
 *
 * // All props combined
 * <Button
 *   variant="primary"
 *   size="lg"
 *   isLoading={isSubmitting}
 *   fullWidth
 *   type="submit"
 *   disabled={!isValid}
 * >
 *   Submit
 * </Button>
 */

/**
 * ACCESSIBILITY FEATURES:
 * - Keyboard focusable
 * - Clear focus indicator (ring)
 * - Disabled state prevents interaction
 * - Loading spinner has aria-hidden
 * - Works with screen readers
 * - Proper button semantics
 */

/**
 * STYLING NOTES:
 * - Uses Tailwind utility classes
 * - Consistent spacing and sizing
 * - Smooth transitions
 * - Clear visual hierarchy
 * - Accessible color contrast
 */
