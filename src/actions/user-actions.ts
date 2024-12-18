"use server";

import { supabaseAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { Database } from "@/types/supabase";
import { User, UserAttributes } from "@supabase/supabase-js";
import checkAuthenticated from "./utils";
import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";
import { AUTH_URLS, PROTECTED_URLS } from "@/configs/urls";

interface GetUserResponse {
  user: User;
  accessToken: Database["public"]["Tables"]["access_tokens"]["Row"];
}

export async function getUserAction(): Promise<GetUserResponse> {
  const { user } = await checkAuthenticated();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const { data: accessToken, error } = await supabaseAdmin
    .from("access_tokens")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return {
    user,
    accessToken,
  };
}

const UpdateUserSchema = z.object({
  email: z.string().email().optional(),
  password: z.string().min(8).optional(),
  name: z.string().min(1).optional(),
});

export type UpdateUserSchemaType = z.infer<typeof UpdateUserSchema>;

interface UpdateUserResponse {
  newUser: User;
}

export async function updateUserAction(
  data: UpdateUserSchemaType,
  emailRedirectBaseUrl?: string,
): Promise<UpdateUserResponse> {
  const parsedData = UpdateUserSchema.safeParse(data);

  if (!parsedData.success) {
    console.error(parsedData.error);
    throw new Error("Invalid data");
  }

  const { supabase } = await checkAuthenticated();

  const { data: updateData, error } = await supabase.auth.updateUser(
    {
      email: data.email,
      password: data.password,
      data: {
        name: data.name,
      },
    },
    {
      emailRedirectTo: `${emailRedirectBaseUrl}/api/auth/email-callback`,
    },
  );

  if (error) {
    throw error;
  }

  return {
    newUser: updateData.user,
  };
}
