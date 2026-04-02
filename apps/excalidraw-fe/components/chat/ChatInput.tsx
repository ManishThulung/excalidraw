"use client";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
// import { SpinningLoader } from "@/components/ui/spinning-loader";
import { Textarea } from "@/components/ui/textarea";
import { useSocket } from "@/hooks/useSocket";
// import { ALLOWED_FILE_TYPES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { chatContentSchema } from "@repo/common/schema";
import { FC } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface IProps {
  roomId: number;
}

export const ChatInputForm: FC<IProps> = ({ roomId }) => {
  const { socket } = useSocket(roomId.toString());
  // const { mutateAsync: getPresignedUrls } = useGetPresignedUrls();
  const form = useForm<z.infer<typeof chatContentSchema>>({
    resolver: zodResolver(chatContentSchema),
    defaultValues: {
      content: "",
    },
  });
  const { handleSubmit, formState } = form;
  const { isSubmitting } = formState;

  async function onSubmit(values: z.infer<typeof chatContentSchema>) {
    if (!values.content?.trim()) return;

    socket?.send(
      JSON.stringify({
        room: roomId,
        message: values.content.trim(),
        action: "chat",
      }),
    );

    form.reset();
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(onSubmit)();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full">
        <div className={cn("flex flex-col gap-2")}>
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative flex flex-col gap-4">
                    <div className="relative w-full">
                      <Textarea
                        placeholder="Message"
                        className={cn(
                          "no-scrollbar min-h-[48px] w-full resize-none py-3 pr-20 text-base",
                        )}
                        {...field}
                        onKeyDown={handleKeyDown}
                        disabled={isSubmitting}
                      />

                      {formState.errors.content && (
                        <p className="mt-1 text-sm font-semibold text-red-500">
                          {formState.errors.content.message}
                        </p>
                      )}
                    </div>
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );
};
