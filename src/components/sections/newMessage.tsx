import { Button } from "../ui/button";
import { messageSchema } from "@/lib/types";
import { toast } from "sonner";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "../ui/textarea";
import { useRef, useState } from "react";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";

export const NewMessage = () => {
  const tagRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      to: "",
      subject: "",
      body: "",
      tags: [],
    },
  });
  const tags = form.watch("tags");

  const onSubmit = (values: z.infer<typeof messageSchema>) => {
    toast.info(
      <pre>
        The Message is not acually sent
        <br />
        (feature being worked on)
        <br />
        {JSON.stringify(values, null, 2)}
      </pre>
    );
  };
  return (
    <>
      <section className="flex flex-col min-h-[100svh] relative">
        <div className="p-4 border-b h-16 flex justify-between items-center">
          <h1 className="text-2xl">New Message</h1>
        </div>
        <Form {...form}>
          <form
            className="flex-grow h-full"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="lg:max-w-[75%] mx-auto flex flex-col gap-4 mt-4">
              <FormField
                name="to"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>To</FormLabel>
                    <FormControl>
                      <Input autoComplete="off" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>
              <FormField
                name="subject"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <FormControl>
                      <Input autoComplete="off" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>
              <FormField
                name="body"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Body</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        className="min-h-[20svh] resize-none rounded-lg"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>
              <Label>Tags</Label>
              <div className="flex gap-2 relative">
                <Input autoComplete="off" className="w-[75%]" ref={tagRef} />

                <Button
                  variant={"secondary"}
                  className="w-[25%] rounded-lg"
                  onClick={() => {
                    if (tagRef.current?.value) {
                      form.setValue("tags", [...tags, tagRef.current.value]);
                      tagRef.current.value = "";
                    }
                  }}
                  type="button"
                >
                  Add
                </Button>
              </div>
              <motion.div className=" h-full w-full">
                <Collapsible>
                  <CollapsibleTrigger asChild>
                    <Button
                      type="button"
                      onClick={() => {
                        console.log(open);

                        setOpen(!open);
                      }}
                      className="w-full"
                      variant={"secondary"}
                    >
                      Preset Labels
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-2">
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{
                        opacity: open ? 1 : 0,
                        height: open ? "auto" : 0,
                      }}
                      className={` flex flex-wrap gap-2 justify-center`}
                    >
                      <Button
                        type="button"
                        onClick={() => {
                          form.setValue("tags", [...tags, "social"]);
                        }}
                        className="max-w-max cursor-move"
                      >
                        #social
                      </Button>
                      <Button
                        type="button"
                        onClick={() => {
                          form.setValue("tags", [...tags, "updates"]);
                        }}
                        className="max-w-max cursor-move"
                      >
                        #updates
                      </Button>
                      <Button
                        type="button"
                        onClick={() => {
                          form.setValue("tags", [...tags, "forums"]);
                        }}
                        className="max-w-max cursor-move"
                      >
                        #forums
                      </Button>
                      <Button
                        type="button"
                        onClick={() => {
                          form.setValue("tags", [...tags, "promotions"]);
                        }}
                        className="max-w-max cursor-move"
                      >
                        #promotions
                      </Button>
                    </motion.div>
                  </CollapsibleContent>
                </Collapsible>
              </motion.div>
              <motion.div className="flex flex-wrap gap-2">
                {tags.map((tag, idx) => (
                  <Badge
                    onClick={() => {
                      form.setValue(
                        "tags",
                        tags.filter((_, i) => i !== idx)
                      );
                    }}
                    className="max-w-max cursor-move"
                    key={idx}
                  >
                    #{tag}
                  </Badge>
                ))}
              </motion.div>
            </div>
            <div className="border-t absolute bottom-0 w-full flex justify-end gap-4 py-4 pr-4">
              <Button type="submit" className="md:w-24">
                Send
              </Button>
              <Button className="md:w-24" variant={"outline"}>
                Draft
              </Button>
            </div>
          </form>
        </Form>
      </section>
    </>
  );
};
