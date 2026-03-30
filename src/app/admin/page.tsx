"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ALL_PUZZLE_DATES } from "@/lib/puzzles";
import {
  Difficulty,
  DIFFICULTY_ORDER,
  DIFFICULTY_COLORS,
  DIFFICULTY_LABELS,
} from "@/types";

interface Group {
  category: string;
  difficulty: Difficulty;
  words: string[];
}

interface Puzzle {
  id: number;
  date: string;
  groups: Group[];
}

const EMPTY_GROUP = (diff: Difficulty): Group => ({
  category: "",
  difficulty: diff,
  words: ["", "", "", ""],
});

const NEW_PUZZLE = (): Puzzle => ({
  id: Date.now(),
  date: "",
  groups: DIFFICULTY_ORDER.map((d) => EMPTY_GROUP(d)),
});

export default function AdminPage() {
  const [puzzles, setPuzzles] = useState<Puzzle[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPuzzle, setEditingPuzzle] = useState<Puzzle | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");

  // Load all puzzles
  const loadPuzzles = useCallback(async () => {
    setLoading(true);
    const loaded: Puzzle[] = [];
    for (const date of ALL_PUZZLE_DATES) {
      try {
        const res = await fetch(`/puzzles/${date}.json`);
        if (res.ok) {
          loaded.push(await res.json());
        }
      } catch {
        // skip
      }
    }
    setPuzzles(loaded);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadPuzzles();
  }, [loadPuzzles]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const handleEdit = (puzzle: Puzzle) => {
    setEditingPuzzle(JSON.parse(JSON.stringify(puzzle)));
    setIsNew(false);
  };

  const handleNew = () => {
    setEditingPuzzle(NEW_PUZZLE());
    setIsNew(true);
  };

  const handleSave = async () => {
    if (!editingPuzzle) return;

    // Validation
    if (!editingPuzzle.date || !/^\d{4}-\d{2}-\d{2}$/.test(editingPuzzle.date)) {
      showToast("Please enter a valid date (YYYY-MM-DD)");
      return;
    }
    for (const group of editingPuzzle.groups) {
      if (!group.category.trim()) {
        showToast("All groups need a category name");
        return;
      }
      if (group.words.some((w) => !w.trim())) {
        showToast("All words must be filled in");
        return;
      }
    }

    // Check for duplicate words
    const allWords = editingPuzzle.groups.flatMap((g) =>
      g.words.map((w) => w.trim())
    );
    const unique = new Set(allWords);
    if (unique.size !== 16) {
      showToast("Found duplicate words — each word must be unique");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/puzzles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingPuzzle),
      });

      if (res.ok) {
        showToast("Puzzle saved!");
        setEditingPuzzle(null);
        await loadPuzzles();
      } else {
        const data = await res.json();
        showToast(data.error || "Failed to save");
      }
    } catch {
      showToast("Failed to save — copy the JSON manually instead");
    }
    setSaving(false);
  };

  const handleCopyJSON = () => {
    if (!editingPuzzle) return;
    navigator.clipboard.writeText(JSON.stringify(editingPuzzle, null, 2));
    showToast("JSON copied to clipboard!");
  };

  const handleGroupChange = (
    groupIndex: number,
    field: "category" | "words",
    value: string,
    wordIndex?: number
  ) => {
    if (!editingPuzzle) return;
    const updated = { ...editingPuzzle };
    updated.groups = updated.groups.map((g, i) => {
      if (i !== groupIndex) return g;
      if (field === "category") {
        return { ...g, category: value };
      }
      if (field === "words" && wordIndex !== undefined) {
        const newWords = [...g.words];
        newWords[wordIndex] = value;
        return { ...g, words: newWords };
      }
      return g;
    });
    setEditingPuzzle(updated);
  };

  return (
    <div className="max-w-[700px] w-full mx-auto pb-12">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <Link
          href="/"
          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-sm hover:bg-gray-100"
          aria-label="חזרה"
        >
          →
        </Link>
        <h1 className="text-2xl font-bold">ניהול חידות</h1>
        <div className="w-8" />
      </header>

      {/* Toast */}
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-[#333] text-white px-4 py-2 rounded-lg text-sm shadow-lg">
          {toast}
        </div>
      )}

      {/* Editor Modal */}
      {editingPuzzle && (
        <div className="fixed inset-0 bg-black/40 z-40 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-[600px] mx-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b">
              <h2 className="text-lg font-bold">
                {isNew ? "חידה חדשה" : "עריכת חידה"}
              </h2>
              <button
                onClick={() => setEditingPuzzle(null)}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ✕
              </button>
            </div>

            <div className="px-5 py-4 space-y-5 overflow-y-auto flex-1">
              {/* Date & ID */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-xs text-gray-500 mb-1">
                    תאריך (YYYY-MM-DD)
                  </label>
                  <input
                    type="text"
                    value={editingPuzzle.date}
                    onChange={(e) =>
                      setEditingPuzzle({ ...editingPuzzle, date: e.target.value })
                    }
                    placeholder="2026-04-14"
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                    dir="ltr"
                  />
                </div>
                <div className="w-24">
                  <label className="block text-xs text-gray-500 mb-1">
                    מזהה (ID)
                  </label>
                  <input
                    type="number"
                    value={editingPuzzle.id}
                    onChange={(e) =>
                      setEditingPuzzle({
                        ...editingPuzzle,
                        id: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                    dir="ltr"
                  />
                </div>
              </div>

              {/* Groups */}
              {editingPuzzle.groups.map((group, gi) => (
                <div
                  key={gi}
                  className="rounded-lg p-4"
                  style={{
                    backgroundColor:
                      DIFFICULTY_COLORS[group.difficulty] + "30",
                    borderRight: `4px solid ${DIFFICULTY_COLORS[group.difficulty]}`,
                  }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className="inline-block w-3 h-3 rounded-full"
                      style={{
                        backgroundColor: DIFFICULTY_COLORS[group.difficulty],
                      }}
                    />
                    <span className="text-xs font-medium text-gray-600">
                      {DIFFICULTY_LABELS[group.difficulty]} ({group.difficulty})
                    </span>
                  </div>

                  <div className="mb-3">
                    <label className="block text-xs text-gray-500 mb-1">
                      קטגוריה
                    </label>
                    <input
                      type="text"
                      value={group.category}
                      onChange={(e) =>
                        handleGroupChange(gi, "category", e.target.value)
                      }
                      placeholder="שם הקטגוריה"
                      className="w-full px-3 py-2 border rounded-lg text-sm bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      מילים (4)
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {group.words.map((word, wi) => (
                        <input
                          key={wi}
                          type="text"
                          value={word}
                          onChange={(e) =>
                            handleGroupChange(
                              gi,
                              "words",
                              e.target.value,
                              wi
                            )
                          }
                          placeholder={`מילה ${wi + 1}`}
                          className="px-3 py-2 border rounded-lg text-sm bg-white"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between px-5 py-4 border-t bg-gray-50 rounded-b-xl">
              <button
                onClick={handleCopyJSON}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 underline"
              >
                העתק JSON
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingPuzzle(null)}
                  className="px-5 py-2.5 rounded-full border border-gray-300 text-sm font-medium hover:bg-gray-100"
                >
                  ביטול
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-5 py-2.5 rounded-full bg-[#5A594E] text-white text-sm font-medium
                    hover:bg-[#4A493E] disabled:opacity-50 transition-colors"
                >
                  {saving ? "שומר..." : "שמור"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Puzzle List */}
      <div className="px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-500">
            {puzzles.length} חידות
          </p>
          <button
            onClick={handleNew}
            className="px-4 py-2 rounded-full bg-[#5A594E] text-white text-sm font-medium
              hover:bg-[#4A493E] transition-colors"
          >
            + חידה חדשה
          </button>
        </div>

        {loading && (
          <p className="text-center text-gray-400 py-8">טוען...</p>
        )}

        <div className="space-y-2">
          {puzzles.map((puzzle) => (
            <button
              key={puzzle.date}
              onClick={() => handleEdit(puzzle)}
              className="w-full text-right px-4 py-3 rounded-lg bg-[#EFEFE6] hover:bg-[#E5E5DC]
                transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex gap-1.5">
                  {puzzle.groups.map((g) => (
                    <span
                      key={g.difficulty}
                      className="w-4 h-4 rounded-full inline-block"
                      style={{
                        backgroundColor: DIFFICULTY_COLORS[g.difficulty],
                      }}
                    />
                  ))}
                </div>
                <div>
                  <p className="font-medium text-sm" dir="ltr">
                    {puzzle.date}
                  </p>
                  <p className="text-xs text-gray-500">
                    #{puzzle.id}
                  </p>
                </div>
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {puzzle.groups.map((g) => (
                  <span
                    key={g.difficulty}
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor:
                        DIFFICULTY_COLORS[g.difficulty] + "40",
                    }}
                  >
                    {g.category}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
