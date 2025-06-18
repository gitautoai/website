/**
 * Code file extensions (whitelist approach)
 * Only includes files that typically contain testable logic
 */
const CODE_EXTENSIONS = [
  // Web technologies (except HTML and CSS)
  "js",
  "jsx",
  "ts",
  "tsx",
  "vue", // Vue SFC contains logic
  "svelte", // Svelte components contain logic

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
  "dart", // Flutter
  "m", // Objective-C
  "mm", // Objective-C++
  "kts", // Kotlin script (Android)

  // Functional languages
  "hs",
  "elm",
  "clj",
  "cljs",
  "ml",
  "fs",
  "ex", // Elixir
  "exs", // Elixir script
  "erl", // Erlang
  "hrl", // Erlang header

  // Shell and scripts
  "sh",
  "bash",
  "zsh",
  "fish",
  "ps1",
  "bat",
  "cmd",

  // Other languages
  "r",
  "jl", // Julia
  "lua",
  "pl", // Perl
  "pm", // Perl module
  "sql", // SQL can have testable logic
  "graphql",
  "proto",
  "vim", // Vim script
  "asm", // Assembly
  "s", // Assembly
  "pas", // Pascal
  "pp", // Pascal
  "f", // Fortran
  "f90", // Fortran 90
  "f95", // Fortran 95
  "cobol", // COBOL
  "cob", // COBOL
  "cbl", // COBOL
  "ada", // Ada
  "adb", // Ada body
  "ads", // Ada spec
  "tcl", // Tcl
  "vhdl", // VHDL
  "vhd", // VHDL
  "v", // Verilog
  "sv", // SystemVerilog
];

/**
 * Check if a file is a code file based on extension
 */
export function isCodeFile(filePath: string): boolean {
  const extension = filePath.split(".").pop()?.toLowerCase();
  return extension ? CODE_EXTENSIONS.includes(extension) : false;
}
