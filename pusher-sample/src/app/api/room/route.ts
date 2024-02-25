"use strict";

import { NextResponse } from "next/server";
import Pusher from "pusher";
import { z } from "zod";

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID ?? "",
  key: process.env.NEXT_PUBLIC_PUSHER_KEY ?? "",
  secret: process.env.PUSHER_SECRET ?? "",
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER ?? "",
});

export const POST = async (req: Request) => {
  // validate request body
  const schema = z.object({
    username: z.string(),
    id: z.string().min(8).max(8),
  });
  const body = schema.safeParse(await req.json());
  if (!body.success)
    return new NextResponse("Invalid Request Format", { status: 400 });

  // make new room and notify all users
  await pusher.trigger(body.data.id, "message", {
    user: "system",
    content: `${body.data.username} has joined the room`,
  });

  return NextResponse.json({ roomId: body.data.id }, { status: 201 });
};
