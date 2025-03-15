'use client'

import { useState } from 'react'
import { Button } from '@/ui/primitives/button'
import { Input } from '@/ui/primitives/input'
import HelpTooltip from '@/ui/help-tooltip'
import { useToast } from '@/lib/hooks/use-toast'
import { Eye, EyeOff } from 'lucide-react'
import { Label } from '@/ui/primitives/label'
import { Loader } from '@/ui/loader'
import { getUserAccessTokenAction } from '@/server/user/user-actions'
import CopyButton from '@/ui/copy-button'
import { useAction } from 'next-safe-action/hooks'

interface UserAccessTokenProps {
  className?: string
}

export default function UserAccessToken({ className }: UserAccessTokenProps) {
  const { toast } = useToast()
  const [token, setToken] = useState<string>()
  const [isVisible, setIsVisible] = useState(false)

  const { execute: fetchToken, isPending } = useAction(
    getUserAccessTokenAction,
    {
      onSuccess: (result) => {
        if (result.data) {
          setToken(result.data.accessToken)
          setIsVisible(true)
        }
      },
      onError: () => {
        toast({
          title: 'Error',
          description: 'Failed to fetch access token',
          variant: 'error',
        })
      },
    }
  )

  return (
    <div className={className}>
      <div className="flex h-5 items-center gap-2">
        <Label>Access Token</Label>
        <HelpTooltip>
          Your personal access token for authenticating with E2B services.
        </HelpTooltip>
      </div>
      <div className="mt-2 flex items-center">
        <Input
          type={isVisible ? 'text' : 'password'}
          value={token ?? '••••••••••••••••'}
          readOnly
          className="bg-bg-100 font-mono"
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => {
            if (token) {
              setIsVisible(!isVisible)
              setToken(undefined)
            } else {
              fetchToken()
            }
          }}
          className="ml-2"
          disabled={isPending}
        >
          {isPending ? (
            <Loader />
          ) : token ? (
            isVisible ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )
          ) : (
            <Eye className="size-4" />
          )}
        </Button>
        <CopyButton
          value={token ?? ''}
          variant="outline"
          className="ml-2"
          disabled={!token}
        />
      </div>
    </div>
  )
}
