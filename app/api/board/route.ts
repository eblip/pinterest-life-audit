import { NextResponse } from "next/server";
import { BoardError, fetchBoard } from "@/lib/pinterest";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url).searchParams.get("url") ?? "";
  try {
    const data = await fetchBoard(url);
    return NextResponse.json(data);
  } catch (e) {
    if (e instanceof BoardError) {
      return NextResponse.json({ error: e.message }, { status: e.status });
    }
    return NextResponse.json({ error: "Erreur inattendue." }, { status: 500 });
  }
}
