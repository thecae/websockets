"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import UserContext from "@/lib/context";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

export default function CardsChat() {
  const [username, setUsername] = React.useState<string>("");
  const [roomId, setRoomId] = React.useState<string>("");
  const [error, setError] = React.useState<string>("");
  const context = React.useContext(UserContext);
  const router = useRouter();

  const join = async (id: string) => {
    if (!username) return setError("Please enter a display name");
    const res = await fetch("/api/room", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, id }),
    });
    if (res.ok) {
      // set display name in context
      context.setDisplay(username);
      router.push(`/chat?id=${id}`);
    } else {
      setError("An error occurred. Please try again.");
    }
  };

  const genRoom = async () => {
    await join(Math.random().toString().slice(2, 10));
  };
  const joinRoom = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await join(roomId);
  };

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-3/4 md:size-1/2 lg:size-1/3">
      {error && (
        <Alert variant="destructive" className="my-2">
          <ExclamationTriangleIcon className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <Card>
        <CardHeader className="font-bold text-3xl">VandyChat</CardHeader>
        <CardContent className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <p>Enter your Display Name:</p>
            <Input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="Graham Hemingway"
              className="flex-grow"
            />
          </div>
          <div className="grid grid-cols-5">
            <div className="col-span-2">
              <form className="flex flex-col gap-2" onSubmit={joinRoom}>
                <Input
                  value={roomId}
                  onChange={(event) => setRoomId(event.target.value)}
                  placeholder="12345678"
                  className="flex-grow"
                />
                <Button type="submit" className="w-full">
                  Join Room
                </Button>
              </form>
            </div>
            <div className="relative flex items-center justify-center">
              <Separator className="h-full" orientation="vertical" />
              <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-muted-foreground bg-background">
                OR
              </p>
            </div>
            <div className="flex items-center justify-center col-span-2">
              <Button className="w-full" onClick={genRoom}>
                Create Room
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
