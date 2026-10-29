type FormFieldProps = {
  id: string
  label: string
  type: 'text' | 'email' | 'password'
  value: string
  error: string | undefined
  autoComplete?: string | undefined
  inputMode?: 'text' | 'decimal' | 'numeric' | undefined
  onChange: (value: string) => void
}

export default function FormField({
  id,
  label,
  type,
  value,
  error,
  autoComplete,
  inputMode,
  onChange,
}: FormFieldProps) {
  const errorId = `${id}-error`

  return (
    <div>
      <label htmlFor={id} className="block font-medium">
        {label}
      </label>
      <input
        type={type}
        id={id}
        value={value}
        autoComplete={autoComplete}
        inputMode={inputMode}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 w-full rounded border p-2"
      />
      {error && (
        <p id={errorId} role="alert" className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}
