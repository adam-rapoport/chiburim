"use client";

import { use } from "react";
import ArchiveGame from "@/components/ArchiveGame";

export default function PlayDatePage({
  params,
}: {
  params: Promise<{ date: string }>;
}) {
  const { date } = use(params);
  return <ArchiveGame dateStr={date} />;
}
