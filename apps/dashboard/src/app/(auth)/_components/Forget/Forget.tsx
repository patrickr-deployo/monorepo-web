"use client"

import { useAuth } from "@/app/(auth)/_hooks/useAuth"
import { Button } from "@package/ui/button"
import { Input } from "@package/ui/input"
import { ChevronLeft } from "lucide-react"
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
import { useRouter } from "next/navigation"

export function Forget() {
  const router = useRouter()
  const { handleSendForgetEmail, forgetPasswordForm, error, loading } = useAuth(
    {}
  )

  return (
    <Card className="mx-auto w-full max-w-sm">
      <div className="flex items-center justify-between">
        <Button
          variant="link"
          className="mt-2 ml-1"
          onClick={() => router.back()}
        >
          <ChevronLeft
            className="me-1 opacity-60"
            size={16}
            strokeWidth={2}
            aria-hidden="true"
          />
          Go back
        </Button>
      </div>
      <CardHeader>
        <CardTitle className="text-2xl">Forgot Password</CardTitle>
        <CardDescription>
          Enter your email address to receive a password reset link.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...forgetPasswordForm}>
          <form
            onSubmit={forgetPasswordForm.handleSubmit(handleSendForgetEmail)}
            className="space-y-6"
          >
            <div className="grid gap-4">
              {/* Email Field */}
              <FormField
                control={forgetPasswordForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="grid gap-2">
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <FormControl>
                      <Input
                        id="email"
                        placeholder="johndoe@mail.com"
                        type="email"
                        autoComplete="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <p className="text-destructive">{error}</p>
            </div>
            <Button
              className="w-full"
              disabled={loading}
              isLoading={loading}
              type="submit"
            >
              Send Reset Link
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
