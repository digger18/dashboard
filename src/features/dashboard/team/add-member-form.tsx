"use client";

import { Button } from "@/ui/primitives/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/ui/primitives/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { mutate } from "swr";
import { QUERY_KEYS } from "@/configs/keys";
import { addTeamMemberAction } from "@/server/team/team-actions";
import { z } from "zod";
import { Input } from "@/ui/primitives/input";
import { useToast } from "@/lib/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";

const addMemberSchema = z.object({
  email: z.string().email(),
});

type AddMemberForm = z.infer<typeof addMemberSchema>;

interface AddMemberFormProps {
  className?: string;
}

export default function AddMemberForm({ className }: AddMemberFormProps) {
  const { teamId } = useParams();
  const { toast } = useToast();

  const form = useForm<AddMemberForm>({
    resolver: zodResolver(addMemberSchema),
    defaultValues: {
      email: "",
    },
  });

  const { mutate: addMember, isPending } = useMutation({
    mutationFn: async (data: AddMemberForm) => {
      const response = await addTeamMemberAction({
        teamId: teamId as string,
        email: data.email,
      });
      return response;
    },
    onSuccess: () => {
      mutate(QUERY_KEYS.TEAM_MEMBERS(teamId as string));
      toast({
        title: "Member added to team",
        description: "The member has been added to the team.",
      });
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "error",
      });
    },
  });

  function onSubmit(data: AddMemberForm) {
    addMember(data);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("flex gap-2", className)}
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="relative w-full">
              <FormLabel className="absolute bottom-[115%] left-1">
                E-Mail
              </FormLabel>
              <div className="flex items-center gap-2">
                <FormControl>
                  <Input placeholder="member@acme.com" {...field} />
                </FormControl>
                <Button
                  loading={isPending}
                  type="submit"
                  disabled={!form.formState.isValid}
                >
                  Add Member
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
