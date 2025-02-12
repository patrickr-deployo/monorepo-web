"use client"

import { useAuth } from "@/app/(auth)/_hooks/useAuth"
import { Button } from "@package/ui/button"
import { PasswordInput } from "@package/ui/password-input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@package/ui/form"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@package/ui/card"
import { ChangePasswordByForgetSchema } from "@package/validations"

export function ResetPassword({ token }: { token: string }) {
  const {
    handleChangePasswordByForget,
    changePasswordByForgetForm,
    error,
    loading,
  } = useAuth({})

  return (
    <Card className="mx-auto w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Reset Password</CardTitle>
        <CardDescription>Enter your new password below.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...changePasswordByForgetForm}>
          <form
            onSubmit={changePasswordByForgetForm.handleSubmit(
              (values: ChangePasswordByForgetSchema) =>
                handleChangePasswordByForget(values, token)
            )}
            className="space-y-6"
          >
            <div className="grid gap-4">
              {/* Password Field */}
              <FormField
                control={changePasswordByForgetForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="grid gap-2">
                    <FormLabel htmlFor="password">Password</FormLabel>
                    <FormControl>
                      <PasswordInput
                        id="password"
                        placeholder="******"
                        autoComplete="new-password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Confirm Password Field */}
              <FormField
                control={changePasswordByForgetForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem className="grid gap-2">
                    <FormLabel htmlFor="confirmPassword">
                      Confirm Password
                    </FormLabel>
                    <FormControl>
                      <PasswordInput
                        id="confirmPassword"
                        placeholder="******"
                        autoComplete="new-password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {error && <p className="text-destructive">{error}</p>}
            </div>
            <Button
              className="w-full"
              disabled={loading}
              isLoading={loading}
              type="submit"
            >
              Reset Password
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
