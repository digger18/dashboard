"use client";

import { Button } from "@/ui/primitives/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/ui/primitives/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/ui/primitives/dropdown-menu";
import { signOutAction } from "@/server/auth-actions";
import Link from "next/link";
import { PROTECTED_URLS } from "@/configs/urls";
import UserDetailsTile from "./user-details-tile";
import { useUser } from "@/lib/hooks/use-user";
import DeveloperSettingsDialog from "@/features/dashboard/developer-settings/settings-dialog";
import { useState } from "react";

export default function UserMenu() {
  const { user } = useUser();

  const [developerSettingsOpen, setDeveloperSettingsOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="iconSm" className="min-w-8" variant="ghost">
            <Avatar className="h-full w-full">
              <AvatarImage src={user?.user_metadata.avatar_url} />
              <AvatarFallback>
                {user?.email?.charAt(0).toUpperCase() || "?"}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[15rem]">
          <DropdownMenuItem asChild className="p-1">
            <Link href={PROTECTED_URLS.ACCOUNT_SETTINGS}>
              <UserDetailsTile />
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={() => setDeveloperSettingsOpen(true)}>
            Developer Settings
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="text-error"
            onClick={() => signOutAction()}
          >
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeveloperSettingsDialog
        open={developerSettingsOpen}
        onOpenChange={setDeveloperSettingsOpen}
      />
    </>
  );
}
