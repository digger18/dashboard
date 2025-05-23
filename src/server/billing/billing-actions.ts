'use server'

import { USER_ACCESS_TOKEN_HEADER } from '@/configs/constants'
import { authActionClient } from '@/lib/clients/action'
import { getUserAccessToken } from '@/lib/utils/server'
import { returnServerError } from '@/lib/utils/action'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'

// Checkout

const RedirectToCheckoutParamsSchema = z.object({
  teamId: z.string().uuid(),
  tierId: z.string(),
})

export const redirectToCheckoutAction = authActionClient
  .schema(RedirectToCheckoutParamsSchema)
  .metadata({ actionName: 'redirectToCheckout' })
  .action(async ({ parsedInput }) => {
    const { teamId, tierId } = parsedInput

    const res = await fetch(`${process.env.BILLING_API_URL}/checkouts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        teamID: teamId,
        tierID: tierId,
      }),
    })

    if (!res.ok) {
      const text = await res.text()
      throw new Error(text ?? 'Failed to redirect to checkout')
    }

    const data = (await res.json()) as { url: string; error?: string }

    if (data.error) {
      throw new Error(data.error)
    }

    throw redirect(data.url)
  })

// Limits

function typeToKey(type: 'limit' | 'alert') {
  return type === 'limit' ? 'limit_amount_gte' : 'alert_amount_gte'
}

const SetLimitParamsSchema = z.object({
  teamId: z.string().uuid(),
  type: z.enum(['limit', 'alert']),
  value: z.number().min(1),
})

export const setLimitAction = authActionClient
  .schema(SetLimitParamsSchema)
  .metadata({ actionName: 'setLimit' })
  .action(async ({ parsedInput, ctx }) => {
    const { teamId, type, value } = parsedInput
    const { user } = ctx
    const accessToken = await getUserAccessToken(user.id)

    const res = await fetch(
      `${process.env.BILLING_API_URL}/teams/${teamId}/billing-limits`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          [USER_ACCESS_TOKEN_HEADER]: accessToken,
        },
        body: JSON.stringify({
          [typeToKey(type)]: value,
        }),
      }
    )

    if (!res.ok) {
      const text = await res.text()
      return returnServerError(text ?? 'Failed to set limit')
    }

    revalidatePath(`/dashboard/[teamIdOrSlug]/budget`, 'page')
  })

const ClearLimitParamsSchema = z.object({
  teamId: z.string().uuid(),
  type: z.enum(['limit', 'alert']),
})

export const clearLimitAction = authActionClient
  .schema(ClearLimitParamsSchema)
  .metadata({ actionName: 'clearLimit' })
  .action(async ({ parsedInput, ctx }) => {
    const { teamId, type } = parsedInput
    const { user } = ctx
    const accessToken = await getUserAccessToken(user.id)

    const res = await fetch(
      `${process.env.BILLING_API_URL}/teams/${teamId}/billing-limits/${typeToKey(type)}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          [USER_ACCESS_TOKEN_HEADER]: accessToken,
        },
      }
    )

    if (!res.ok) {
      const text = await res.text()
      return returnServerError(text ?? 'Failed to clear limit')
    }

    revalidatePath(`/dashboard/[teamIdOrSlug]/budget`, 'page')
  })
