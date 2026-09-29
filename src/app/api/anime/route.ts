import { NextRequest, NextResponse } from "next/server";
import { animeQuerySchema, getAnime, MalRequestError } from "@/lib/myanimelist";

export async function GET(request: NextRequest) {
  const parsed = animeQuerySchema.safeParse(Object.fromEntries(request.nextUrl.searchParams.entries()));
  if (!parsed.success) return NextResponse.json({ error: "Invalid discovery filters." }, { status: 400 });
  try { return NextResponse.json(await getAnime(parsed.data)); }
  catch (error) { return NextResponse.json({ error: error instanceof MalRequestError ? error.message : "Discovery is temporarily unavailable." }, { status: error instanceof MalRequestError ? error.status : 500 }); }
}
