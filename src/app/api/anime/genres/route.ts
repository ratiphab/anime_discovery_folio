import { NextResponse } from "next/server";
import { getAnimeGenres, MalRequestError } from "@/lib/myanimelist";
export async function GET() {
  try {
    return NextResponse.json(await getAnimeGenres());
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof MalRequestError
            ? error.message
            : "Genres are temporarily unavailable.",
      },
      { status: error instanceof MalRequestError ? error.status : 500 },
    );
  }
}
