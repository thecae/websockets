"use strict";

import { NextResponse } from "next/server";
import Pusher from "pusher";

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID ?? "",
  key: process.env.NEXT_PUBLIC_PUSHER_KEY ?? "",
  secret: process.env.PUSHER_SECRET ?? "",
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER ?? "",
});

export const POST = async (req: Request) => {
  return new NextResponse("Very Cool", { status: 200 });
};
