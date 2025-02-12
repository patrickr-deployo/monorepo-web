"use client"

import { useAuth } from "@/app/(auth)/_hooks/useAuth"
import { Button } from "@package/ui/button"
import { Input } from "@package/ui/input"
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
import { Checkbox } from "@package/ui/checkbox"
import Link from "next/link"
import { featureFlags } from "@package/utils"
import { Typography } from "@package/ui/typography"
import { PasswordInput } from "@package/ui/password-input"
import { useState } from "react"

type AuthProps = {
  isRegister?: boolean
}

export function Auth({ isRegister }: AuthProps) {
  const { handleLoginRegister, registerLoginForm, error, loading } = useAuth({
    isRegister,
  })

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const requirements = [
    { regex: /.{8,}/, text: "At least 8 characters" },
    { regex: /[0-9]/, text: "At least 1 number" },
    { regex: /[a-z]/, text: "At least 1 lowercase letter" },
    { regex: /[A-Z]/, text: "At least 1 uppercase letter" },
  ]

  const checkStrength = (pass: string) => {
    return requirements.map((req) => ({
      met: req.regex.test(pass),
      text: req.text,
    }))
  }

  const strengthResults = checkStrength(password)
  const strengthScore = strengthResults.filter((req) => req.met).length

  return (
    <Card className="mx-auto w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">
          {isRegister ? "Register" : "Sign In"}
        </CardTitle>
        <CardDescription>
          {`${isRegister ? "Create a new account by filling out the form below." : "Enter your email and password to sign in."}`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...registerLoginForm}>
          <form
            onSubmit={registerLoginForm.handleSubmit(handleLoginRegister)}
            className="space-y-6"
          >
            <div className="grid gap-4">
              {/* Email Field */}
              <FormField
                control={registerLoginForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="grid gap-2">
                    <div className="relative">
                      <FormLabel
                        htmlFor="email"
                        className="absolute -top-2.5 left-2 z-30 bg-background px-2 text-xs font-medium text-muted-foreground"
                      >
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          id="email"
                          type="email"
                          autoComplete="email"
                          {...field}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password Field */}
              <FormField
                control={registerLoginForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="grid gap-2">
                    <FormControl>
                      <PasswordInput
                        id="password"
                        autoComplete="new-password"
                        showStrengthIndicator={isRegister}
                        requirements={strengthResults}
                        strengthScore={strengthScore}
                        maxScore={requirements.length}
                        withConfirmation={isRegister}
                        confirmValue={confirmPassword}
                        onConfirmChange={setConfirmPassword}
                        mainPasswordLabel="Password"
                        mainPasswordLabelClassName="absolute -top-2.5 left-2 z-30 bg-background px-2 text-xs font-medium text-muted-foreground"
                        confirmPasswordProps={{
                          label: "Confirm Password",
                          labelClassName:
                            "absolute -top-2.5 left-2 z-30 bg-background px-2 text-xs font-medium text-muted-foreground",
                          className: "mt-5",
                        }}
                        onConfirmPasswordChange={(_, value) => {
                          registerLoginForm.setValue("confirmPassword", value, {
                            shouldValidate: true,
                          })
                        }}
                        {...field}
                        onChange={(e) => {
                          field.onChange(e)
                          setPassword(e.target.value)
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Remember Field */}
              {!isRegister && (
                <FormField
                  control={registerLoginForm.control}
                  name="remember"
                  render={({ field }) => (
                    <FormItem className="grid gap-2 items-center">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel htmlFor="remember">
                            <Typography variant="small">Remember me</Typography>
                          </FormLabel>
                        </div>

                        {/* Forget Password */}
                        <Link href="/forget">
                          <Typography variant="muted">
                            Forget password?
                          </Typography>
                        </Link>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
            <Button
              className="w-full"
              disabled={loading}
              isLoading={loading}
              type="submit"
            >
              {isRegister ? "Sign up" : "Sign in"}
            </Button>
          </form>
        </Form>

        {featureFlags.enableOauthLogin && (
          <>
            <section className="flex items-center gap-4">
              <hr className="flex-1 border-foregroundGrey" />
              <p className="text-center text-foregroundGrey">or</p>
              <hr className="flex-1 border-foregroundGrey" />
            </section>
            <Button
              className="w-full"
              disabled={loading}
              isLoading={loading}
              variant="outline"
              onClick={() => {}}
            >
              {isRegister ? "Sign up" : "Sign in"} with Google
            </Button>
            <Button
              className="w-full"
              disabled={loading}
              isLoading={loading}
              variant="outline"
              onClick={() => {}}
            >
              {isRegister ? "Sign up" : "Sign in"} with Github
            </Button>
          </>
        )}
        <div className="mt-4 text-center text-sm">
          {isRegister ? "Already" : "Don't"} have an account?{" "}
          <Link className="underline" href={isRegister ? "/login" : "register"}>
            {isRegister ? "Sign in" : "Sign up"}
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
