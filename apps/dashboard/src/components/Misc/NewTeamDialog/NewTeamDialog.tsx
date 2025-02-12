"use client"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@package/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@package/ui/form"

import { Button } from "@package/ui/button"
import { Typography } from "@package/ui/typography"
import { Input } from "@package/ui/input"
import { useTeam } from "@/hooks/useTeam"
import { Loader2 } from "lucide-react"

interface NewTeamDialogProps {
  open: boolean
  onClose: () => void
}

export function NewTeamDialog({ open, onClose }: NewTeamDialogProps) {
  const { handleCreateTenant, createTenantForm, loading, error, message } =
    useTeam()

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <Form {...createTenantForm}>
          <form
            onSubmit={createTenantForm.handleSubmit(handleCreateTenant)}
            className="space-y-6"
          >
            <DialogHeader>
              <DialogTitle>Create Team</DialogTitle>
              <DialogDescription>
                <Typography variant="body">
                  Add a new team to manage your resources.
                </Typography>
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2 pb-4">
              {message && (
                <div className="text-green-500 text-sm">{message}</div>
              )}

              <div className="space-y-2">
                <FormField
                  control={createTenantForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="tenantName">Team Name</FormLabel>
                      <FormControl>
                        <Input
                          id="tenantName"
                          placeholder="My Team"
                          {...field}
                          required
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={onClose} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  "Create"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
