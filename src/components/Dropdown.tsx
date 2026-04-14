import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface DropdownOption<T = string> {
  value: T;
  label: string;
}

interface DropdownProps<T = string> {
  value: T;
  onChange: (value: T) => void;
  options: DropdownOption<T>[];
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  className?: string;
  isLoading?: boolean;
}

export function Dropdown<T = string>({
  value,
  onChange,
  options,
  placeholder = 'Seleccionar...',
  disabled = false,
  error,
  className = '',
  isLoading = false,
}: DropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <motion.button
        type="button"
        onClick={() => !(disabled || isLoading) && setIsOpen(!isOpen)}
        disabled={disabled || isLoading}
        className={`w-full px-4 py-3 bg-surface-overlay border rounded-lg text-text-primary text-left flex items-center justify-between transition-colors duration-200 ${
          error ? 'border-semantic-danger' : 'border-border-default'
        } ${!disabled && !isLoading && 'hover:border-border-emphasis'} ${
          isOpen && !isLoading && 'border-gold-dim'
        } ${isLoading && 'animate-pulse'} disabled:opacity-50 disabled:cursor-not-allowed`}
        whileHover={!disabled && !isLoading ? { scale: 1.01 } : undefined}
        whileTap={!disabled && !isLoading ? { scale: 0.99 } : undefined}
      >
        <span className={isLoading ? 'text-text-muted' : selectedOption ? 'text-text-primary' : 'text-text-muted'}>
          {isLoading ? 'Cargando...' : selectedOption?.label || placeholder}
        </span>
        {isLoading ? (
          <svg
            className="animate-spin h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" opacity="0.25" />
            <path
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              opacity="0.75"
            />
          </svg>
        ) : (
          <motion.svg
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="6 8 10 12 14 8" />
          </motion.svg>
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-2 bg-surface-raised border border-border-default rounded-lg shadow-lg z-50 overflow-hidden"
          >
            <motion.ul
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.05 }}
              className="max-h-60 overflow-y-auto"
            >
              {options.map((option, index) => (
                <motion.li
                  key={`${option.value}-${index}`}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.02 }}
                >
                  <button
                    type="button"
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                    }}
                    className={`w-full px-4 py-3 text-left transition-colors duration-150 ${
                      value === option.value
                        ? 'bg-gold-primary text-surface-base font-semibold'
                        : 'text-text-primary hover:bg-surface-muted'
                    }`}
                  >
                    {option.label}
                  </button>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <p className="text-semantic-danger text-xs mt-2">{error}</p>
      )}
    </div>
  );
}
