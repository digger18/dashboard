'use client'

import { useToast } from '@/lib/hooks/use-toast'
import { TableCell, TableRow } from '@/ui/primitives/table'
import { Button } from '@/ui/primitives/button'
import { AlertDialog } from '@/ui/alert-dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/ui/primitives/avatar'
import { removeTeamMemberAction } from '@/server/team/team-actions'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSelectedTeam, useTeams } from '@/lib/hooks/use-teams'
import { useUser } from '@/lib/hooks/use-user'
import { PROTECTED_URLS } from '@/configs/urls'
import { QUERY_KEYS } from '@/configs/keys'
import { mutate } from 'swr'
import { TeamMember } from '@/server/team/types'
import { useAction } from 'next-safe-action/hooks'

interface TableRowProps {
  member: TeamMember
  addedByEmail?: string
  index: number
}

export default function MemberTableRow({
  member,
  addedByEmail,
  index,
}: TableRowProps) {
  const { toast } = useToast()
  const selectedTeam = useSelectedTeam()
  const router = useRouter()
  const { refetch: refetchTeams } = useTeams()
  const { user } = useUser()
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false)

  const { execute: removeMember, isExecuting: isRemoving } = useAction(
    removeTeamMemberAction,
    {
      onSuccess: ({ input }) => {
        if (input.userId === user?.id) {
          refetchTeams()
          router.push(PROTECTED_URLS.DASHBOARD)
          toast({
            description: 'You have left the team',
            variant: 'success',
          })
        } else {
          toast({
            description: 'The member has been removed from the team',
            variant: 'success',
          })
        }
      },
      onError: ({ error }) => {
        toast({
          description: error.serverError || 'Unknown error',
          variant: 'error',
        })
      },
      onSettled: () => {
        setRemoveDialogOpen(false)
      },
    }
  )

  const handleRemoveMember = async (userId: string) => {
    if (!selectedTeam) {
      return
    }

    removeMember({
      teamId: selectedTeam.id,
      userId,
    })
  }

  return (
    <TableRow key={`${member.info.id}-${index}`}>
      <TableCell>
        <Avatar className="size-8">
          <AvatarImage src={member.info?.avatar_url} />
          <AvatarFallback>
            {member.info?.email?.charAt(0).toUpperCase() || '?'}
          </AvatarFallback>
        </Avatar>
      </TableCell>
      <TableCell className="min-w-36">
        {member.info.id === user?.id
          ? 'You'
          : (member.info.name ?? 'Anonymous')}
      </TableCell>
      <TableCell className="text-fg-500">{member.info.email}</TableCell>
      <TableCell className="text-fg-300">
        {member.relation.added_by === user?.id ? 'You' : (addedByEmail ?? '')}
      </TableCell>
      <TableCell className="text-end">
        {!member.relation.is_default && user?.id !== member.info.id && (
          <AlertDialog
            title="Remove Member"
            description="Are you sure you want to remove this member from the team?"
            confirm="Remove"
            onConfirm={() => handleRemoveMember(member.info.id)}
            confirmProps={{
              loading: isRemoving,
            }}
            trigger={
              <Button variant="muted" size="iconSm">
                <span className="text-xs">X</span>
              </Button>
            }
            open={removeDialogOpen}
            onOpenChange={setRemoveDialogOpen}
          />
        )}
      </TableCell>
    </TableRow>
  )
}
