import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const PUZZLES_DIR = path.join(process.cwd(), "public", "puzzles");

/**
 * POST /api/puzzles — Save a puzzle JSON file.
 * Works in local dev mode. On Vercel, the filesystem is read-only,
 * so the admin page also offers a "copy JSON" fallback.
 */
export async function POST(req: NextRequest) {
  try {
    const puzzle = await req.json();

    if (!puzzle.date || !puzzle.groups || puzzle.groups.length !== 4) {
      return NextResponse.json(
        { error: "Invalid puzzle format" },
        { status: 400 }
      );
    }

    const filePath = path.join(PUZZLES_DIR, `${puzzle.date}.json`);
    fs.writeFileSync(filePath, JSON.stringify(puzzle, null, 2) + "\n");

    return NextResponse.json({ success: true, path: filePath });
  } catch (err) {
    console.error("Failed to save puzzle:", err);
    return NextResponse.json(
      { error: "Failed to save puzzle. This only works in local dev mode." },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/puzzles?date=2026-04-01 — Delete a puzzle file.
 */
export async function DELETE(req: NextRequest) {
  try {
    const dateStr = req.nextUrl.searchParams.get("date");
    if (!dateStr) {
      return NextResponse.json({ error: "Missing date" }, { status: 400 });
    }

    const filePath = path.join(PUZZLES_DIR, `${dateStr}.json`);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Failed to delete puzzle:", err);
    return NextResponse.json(
      { error: "Failed to delete puzzle." },
      { status: 500 }
    );
  }
}
