"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@package/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@package/ui/form"
import { Input } from "@package/ui/input"
import { QUERY_KEYS } from "@package/utils"
import { useMutation, useQuery } from "@tanstack/react-query"
import { AccountApi } from "@package/api"
import { useToast } from "@package/ui/toast"

const profileFormSchema = z.object({
  username: z
    .string({
      required_error: "Please enter a username to update.",
    })
    .min(3, { message: "Username must be at least 3 characters long." })
    .max(32, { message: "Username must be at most 32 characters long." }),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

export function ProfileForm() {
  const accountService = new AccountApi()

  const { toast } = useToast()

  const { data } = useQuery({
    queryKey: QUERY_KEYS.USER_INFO(),
    queryFn: () => accountService.accountGetProfile(),
  })

  const defaultValues: Partial<ProfileFormValues> = {
    username: data?.data.username ?? "",
  }

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: "onChange",
  })

  const updateProfileMutation = useMutation({
    mutationKey: QUERY_KEYS.UPDATE_PROFILE(),
    mutationFn: accountService.accountUpdateProfile,
    onSuccess: () => {
      toast({
        title: "Profile updated successfully",
      })
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    },
  })

  function onSubmit(data: ProfileFormValues) {
    updateProfileMutation.mutate({
      body: {
        username: data.username,
      },
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="username" {...field} />
              </FormControl>
              <FormDescription>
                This is your username. This username can be publically viewed by
                other users.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Update profile</Button>
      </form>
    </Form>
  )
}
