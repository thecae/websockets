"use client";

import { PaperPlaneIcon } from "@radix-ui/react-icons";
import * as React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import Pusher from "pusher-js";
import { useSearchParams } from "next/navigation";
import { notFound } from "next/navigation";
import UserContext from "@/lib/context";

interface Message {
  user: string;
  content: string;
}

export default function CardsChat() {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [input, setInput] = React.useState("");
  const inputLength = input.trim().length;
  const context = React.useContext(UserContext);

  // get the room id
  const searchParams = useSearchParams();
  const roomId = searchParams.get("id");
  if (!roomId) notFound();

  // connect to pusher
  React.useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY ?? "", {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER ?? "",
    });
    const channel = pusher.subscribe(roomId);
    channel.bind("message", (data: any) => {
      const { user, content } = data;
      setMessages((m) => [...m, { user, content }]);
    });

    // cleanup
    return () => {
      pusher.unsubscribe(roomId);
      channel.unbind_all();
    };
  }, [roomId]);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (inputLength === 0) return;
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: context.display,
        content: input,
        roomId,
      }),
    });
    if (!res.ok) {
      console.error(await res.text());
      return;
    }
    setInput("");
  };

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-3/4 md:size-1/2 lg:size-1/3">
      <Card>
        <CardHeader className="flex flex-row items-center">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src="/avatars/01.png" alt="Image" />
              <AvatarFallback>OM</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium leading-none">
                {context.display}
              </p>
              <p className="text-sm text-muted-foreground">m@example.com</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96 flex flex-col gap-2">
            {messages.map((message, index) => {
              if (message.user === "system") {
                return (
                  <p
                    key={index}
                    className="text-center text-muted-foreground text-xs uppercase"
                  >
                    {message.content}
                  </p>
                );
              }
              return (
                <div key={index} className="my-4">
                  {message.user !== context.display && (
                    <p className="ml-6 text-muted-foreground text-xs">
                      {message.user}
                    </p>
                  )}
                  <div
                    className={cn(
                      "flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm",
                      message.user === context.display
                        ? "ml-auto mr-4 bg-primary text-primary-foreground"
                        : "bg-muted ml-4"
                    )}
                  >
                    {message.content}
                  </div>
                </div>
              );
            })}
          </ScrollArea>
        </CardContent>
        <CardFooter>
          <form
            onSubmit={onSubmit}
            className="flex w-full items-center space-x-2"
          >
            <Input
              id="message"
              placeholder="Type your message..."
              className="flex-1"
              autoComplete="off"
              value={input}
              onChange={(event) => setInput(event.target.value)}
            />
            <Button type="submit" size="icon" disabled={inputLength === 0}>
              <PaperPlaneIcon className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
