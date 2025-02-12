"use client"

import * as React from "react"
import { EyeIcon, EyeOffIcon, Check, X } from "lucide-react"

import { Button } from "../Button/Button"
import { Input, type InputProps } from "../Input/Input"
import { cn } from "@package/utils"
import { FormLabel } from "../Form/Form"

interface Requirement {
  met: boolean
  text: string
}

interface PasswordInputProps extends InputProps {
  showStrengthIndicator?: boolean
  requirements?: Requirement[]
  strengthScore?: number
  maxScore?: number
  withConfirmation?: boolean
  confirmValue?: string
  confirmPasswordPlaceholder?: string
  onConfirmChange?: (value: string) => void
  confirmPasswordProps?: {
    className?: string
    label?: React.ReactNode
    labelClassName?: string
  }
  mainPasswordLabel?: React.ReactNode
  mainPasswordLabelClassName?: string
  name?: string
  onConfirmPasswordChange?: (name: string, value: string) => void
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  (
    {
      className,
      showStrengthIndicator,
      requirements = [],
      strengthScore = 0,
      maxScore = 4,
      withConfirmation,
      confirmValue = "",
      confirmPasswordPlaceholder,
      onConfirmChange,
      confirmPasswordProps,
      mainPasswordLabel,
      mainPasswordLabelClassName,
      name,
      onConfirmPasswordChange,
      onChange,
      value,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = React.useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)

    const disabled = value === "" || value === undefined || props.disabled
    const passwordsMatch = value === confirmValue

    const allRequirements = withConfirmation
      ? [...requirements, { met: passwordsMatch, text: "Passwords match" }]
      : requirements

    const handleConfirmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onConfirmChange?.(e.target.value)
      if (name && onConfirmPasswordChange) {
        onConfirmPasswordChange(`${name}Confirm`, e.target.value)
      }
    }

    return (
      <div className="space-y-2">
        {/* Main password input */}
        <div className="relative">
          {mainPasswordLabel && (
            <FormLabel
              className={cn(
                "absolute -top-2.5 left-2 z-30 bg-background px-2 text-xs font-medium text-muted-foreground",
                mainPasswordLabelClassName
              )}
            >
              {mainPasswordLabel}
            </FormLabel>
          )}
          <Input
            type={showPassword ? "text" : "password"}
            className={cn("hide-password-toggle pr-10", className)}
            ref={ref}
            onChange={onChange}
            value={value}
            {...props}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowPassword((prev) => !prev)}
            disabled={disabled}
          >
            {showPassword && !disabled ? (
              <EyeIcon className="h-4 w-4" aria-hidden="true" />
            ) : (
              <EyeOffIcon className="h-4 w-4" aria-hidden="true" />
            )}
            <span className="sr-only">
              {showPassword ? "Hide password" : "Show password"}
            </span>
          </Button>
        </div>

        {/* Confirm password input */}
        {withConfirmation && (
          <div className="relative">
            {confirmPasswordProps?.label && (
              <FormLabel
                className={cn(
                  "absolute -top-2.5 left-2 z-30 bg-background px-2 text-xs font-medium text-muted-foreground",
                  confirmPasswordProps.labelClassName
                )}
              >
                {confirmPasswordProps.label}
              </FormLabel>
            )}
            <Input
              type={showConfirmPassword ? "text" : "password"}
              className={cn(
                "hide-password-toggle pr-10",
                confirmPasswordProps?.className
              )}
              value={confirmValue}
              onChange={handleConfirmChange}
              placeholder={confirmPasswordPlaceholder}
              disabled={disabled}
              name={name ? `${name}Confirm` : undefined}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              disabled={disabled}
            >
              {showConfirmPassword && !disabled ? (
                <EyeIcon className="h-4 w-4" aria-hidden="true" />
              ) : (
                <EyeOffIcon className="h-4 w-4" aria-hidden="true" />
              )}
              <span className="sr-only">
                {showConfirmPassword ? "Hide password" : "Show password"}
              </span>
            </Button>
          </div>
        )}

        {/* Strength indicator */}
        {showStrengthIndicator && (
          <>
            <div
              className="h-1 w-full overflow-hidden rounded-full bg-border"
              role="progressbar"
              aria-valuenow={strengthScore}
              aria-valuemin={0}
              aria-valuemax={maxScore}
            >
              <div
                className={`h-full ${getStrengthColor(strengthScore)} transition-all duration-500 ease-out`}
                style={{ width: `${(strengthScore / maxScore) * 100}%` }}
              />
            </div>

            <ul className="space-y-1.5" aria-label="Password requirements">
              {allRequirements.map((req, index) => (
                <li key={index} className="flex items-center gap-2">
                  {req.met ? (
                    <Check
                      size={16}
                      className="text-emerald-500"
                      aria-hidden="true"
                    />
                  ) : (
                    <X
                      size={16}
                      className="text-muted-foreground/80"
                      aria-hidden="true"
                    />
                  )}
                  <span
                    className={`text-xs ${req.met ? "text-emerald-600" : "text-muted-foreground"}`}
                  >
                    {req.text}
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}

        <style>{`
          .hide-password-toggle::-ms-reveal,
          .hide-password-toggle::-ms-clear {
            visibility: hidden;
            pointer-events: none;
            display: none;
          }
        `}</style>
      </div>
    )
  }
)

PasswordInput.displayName = "PasswordInput"

export { PasswordInput, type PasswordInputProps }

// Helper function
const getStrengthColor = (score: number) => {
  if (score === 0) return "bg-border"
  if (score <= 1) return "bg-red-500"
  if (score <= 2) return "bg-orange-500"
  if (score === 3) return "bg-amber-500"
  return "bg-emerald-500"
}
