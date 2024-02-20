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
  const schema = z.object({
    user: z.string(),
    content: z.string(),
    roomId: z.string().min(8).max(8),
  });
  const body = schema.safeParse(await req.json());
  if (!body.success)
    return new NextResponse("Invalid Request Format", { status: 400 });

  await pusher.trigger(body.data.roomId, "message", {
    user: body.data.user,
    content: body.data.content,
  });

  return new NextResponse(null, { status: 201 });
};
