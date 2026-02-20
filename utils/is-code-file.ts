/**
 * Check if a file is a code file based on extension whitelist (same logic as gitauto schedule handler)
 */
export function isCodeFile(filename: string): boolean {
  if (!filename || typeof filename !== "string") return false;

  if (!filename.includes(".")) return false;

  const extension = filename.split(".").pop()?.toLowerCase();
  if (!extension) return false;

  const codeExtensions = new Set([
    // Web technologies
    "js",
    "jsx",
    "ts",
    "tsx",
    "vue",
    "svelte",
    // Backend languages
    "py",
    "java",
    "kt",
    "scala",
    "groovy",
    "cs",
    "vb",
    "fs",
    "php",
    "rb",
    "go",
    "rs",
    "swift",
    "c",
    "cpp",
    "cc",
    "cxx",
    "h",
    "hpp",
    // Mobile development
    "dart",
    "m",
    "mm",
    "kts",
    // Functional languages
    "hs",
    "elm",
    "clj",
    "cljs",
    "ml",
    "ex",
    "exs",
    "erl",
    "hrl",
    // Other languages
    "r",
    "jl",
    "lua",
    "pl",
    "pm",
    "sql",
    "graphql",
    "proto",
    "vim",
    "asm",
    "s",
    "pas",
    "pp",
    "f",
    "f90",
    "f95",
    "cobol",
    "cob",
    "cbl",
    "ada",
    "adb",
    "ads",
    "tcl",
    "vhdl",
    "vhd",
    "v",
    "sv",
  ]);

  return codeExtensions.has(extension);
}
