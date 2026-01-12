// src/components/ui/Input.tsx
import { InputHTMLAttributes, forwardRef } from 'react'
import { clsx } from 'clsx'

/**
 * Input Component
 *
 * A reusable, accessible input field with label and error support
 * Works seamlessly with react-hook-form and manual state management
 *
 * Features:
 * - Optional label
 * - Error message display
 * - Helper text
 * - Required field indicator
 * - Proper TypeScript types
 * - Accessible (ARIA attributes, proper labeling)
 * - Auto-generated IDs
 */

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className, id, required, ...props }, ref) => {
    // Auto-generate ID from label if not provided
    const inputId = id || `input-${label?.toLowerCase().replace(/\s+/g, '-')}`

    return (
      <div className="w-full">
        {/* Label */}
        {label && (
          <label htmlFor={inputId} className="mb-2 block text-sm font-medium text-gray-700">
            {label}
            {required && <span className="ml-1 text-red-500">*</span>}
          </label>
        )}

        {/* Input field */}
        <input
          ref={ref}
          id={inputId}
          className={clsx(
            'w-full rounded-md border px-3 py-2 text-sm transition-colors',
            'focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none',
            'disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500',
            error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 hover:border-gray-400',
            className
          )}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={
            error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
          }
          required={required}
          {...props}
        />

        {/* Error message */}
        {error && (
          <p id={`${inputId}-error`} className="mt-1 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        {/* Helper text (only show if no error) */}
        {!error && helperText && (
          <p id={`${inputId}-helper`} className="mt-1 text-sm text-gray-500">
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

/**
 * USAGE EXAMPLES:
 *
 * // Basic input
 * <Input label="Email" type="email" placeholder="you@example.com" />
 *
 * // Required field
 * <Input label="Username" required />
 *
 * // With error message
 * <Input
 *   label="Password"
 *   type="password"
 *   error="Password must be at least 8 characters"
 * />
 *
 * // With helper text
 * <Input
 *   label="Username"
 *   helperText="Choose a unique username"
 * />
 *
 * // Controlled input
 * const [email, setEmail] = useState('')
 * <Input
 *   label="Email"
 *   type="email"
 *   value={email}
 *   onChange={(e) => setEmail(e.target.value)}
 * />
 *
 * // With react-hook-form
 * import { useForm } from 'react-hook-form'
 *
 * const { register, formState: { errors } } = useForm()
 *
 * <Input
 *   label="Email"
 *   type="email"
 *   {...register('email', { required: 'Email is required' })}
 *   error={errors.email?.message}
 * />
 *
 * // Disabled input
 * <Input label="Read Only" value="Cannot edit" disabled />
 *
 * // Different input types
 * <Input label="Email" type="email" />
 * <Input label="Password" type="password" />
 * <Input label="Number" type="number" />
 * <Input label="Date" type="date" />
 * <Input label="Search" type="search" />
 *
 * // With custom ID
 * <Input label="Custom" id="custom-input-id" />
 *
 * // Multiple inputs in a form
 * <form>
 *   <Input label="First Name" required />
 *   <Input label="Last Name" required />
 *   <Input
 *     label="Email"
 *     type="email"
 *     required
 *     error={emailError}
 *   />
 *   <Input
 *     label="Password"
 *     type="password"
 *     required
 *     helperText="Must be at least 8 characters"
 *   />
 * </form>
 */

/**
 * ACCESSIBILITY FEATURES:
 * - Proper label association (htmlFor)
 * - Required indicator (*)
 * - Error messages with role="alert"
 * - ARIA attributes (aria-invalid, aria-describedby)
 * - Helper text properly linked
 * - Keyboard accessible
 * - Clear focus indicators
 * - Screen reader friendly
 */

/**
 * STYLING NOTES:
 * - Uses Tailwind utility classes
 * - Error state changes border and ring color
 * - Disabled state clearly indicated
 * - Consistent spacing and sizing
 * - Smooth transitions
 * - Accessible color contrast
 */

/**
 * FORM INTEGRATION:
 *
 * Works great with both controlled and uncontrolled forms:
 *
 * // Uncontrolled (ref-based)
 * const emailRef = useRef<HTMLInputElement>(null)
 * <Input ref={emailRef} label="Email" />
 * const email = emailRef.current?.value
 *
 * // Controlled (state-based)
 * const [email, setEmail] = useState('')
 * <Input
 *   label="Email"
 *   value={email}
 *   onChange={(e) => setEmail(e.target.value)}
 * />
 *
 * // React Hook Form
 * const { register } = useForm()
 * <Input {...register('email')} label="Email" />
 */
