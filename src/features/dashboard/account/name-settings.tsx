'use client'

import { updateUserAction } from '@/server/user/user-actions'
import { AuthFormMessage } from '@/features/auth/form-message'
import { Button } from '@/ui/primitives/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/ui/primitives/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/ui/primitives/form'
import { Input } from '@/ui/primitives/input'
import { useTimeoutMessage } from '@/lib/hooks/use-timeout-message'
import { useUser } from '@/lib/hooks/use-user'
import { AnimatePresence } from 'motion/react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAction } from 'next-safe-action/hooks'
import { cn } from '@/lib/utils'
import { useToast } from '@/lib/hooks/use-toast'

const formSchema = z.object({
  name: z.string().min(1, 'Name cannot be empty'),
})

type FormValues = z.infer<typeof formSchema>

interface NameSettingsProps {
  className?: string
}

export function NameSettings({ className }: NameSettingsProps) {
  'use no memo'

  const { user, refetch: refetchUser } = useUser()
  const { toast } = useToast()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.user_metadata?.name || '',
    },
    values: {
      name: user?.user_metadata?.name || '',
    },
  })

  const { execute: updateName, isPending } = useAction(updateUserAction, {
    onSuccess: async () => {
      await refetchUser()
      toast({
        title: 'Name updated successfully',
      })
    },
    onError: (error) => {
      toast({
        title: 'Error updating name',
        description: error.error.serverError || 'Failed to update name',
        variant: 'error',
      })
    },
  })

  if (!user) return null

  return (
    <Card variant="slate" className={cn(className)} hideUnderline>
      <CardHeader>
        <CardTitle>Your Name</CardTitle>
        <CardDescription>Will be visible to your team members.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((values) =>
              updateName({ name: values.name })
            )}
            className="flex gap-2"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="max-w-[17rem] flex-1">
                  <FormControl>
                    <Input placeholder="Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              variant="outline"
              loading={isPending}
              disabled={form.watch('name') === user?.user_metadata?.name}
              type="submit"
            >
              Save
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
