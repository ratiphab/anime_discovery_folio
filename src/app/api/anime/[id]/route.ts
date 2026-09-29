import { NextResponse } from "next/server";
import { getAnimeDetail, MalRequestError } from "@/lib/myanimelist";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id <= 0) return NextResponse.json({ error: "Anime not found." }, { status: 404 });
  try { return NextResponse.json(await getAnimeDetail(id)); }
  catch (error) { return NextResponse.json({ error: error instanceof MalRequestError ? error.message : "Anime is temporarily unavailable." }, { status: error instanceof MalRequestError ? error.status : 500 }); }
}
