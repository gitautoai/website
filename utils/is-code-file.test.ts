import { isCodeFile } from "./is-code-file";

describe("isCodeFile", () => {
  describe("web technologies", () => {
    it("should identify web technology files as code files", () => {
      expect(isCodeFile("app.js")).toBe(true);
      expect(isCodeFile("component.jsx")).toBe(true);
      expect(isCodeFile("main.ts")).toBe(true);
      expect(isCodeFile("component.tsx")).toBe(true);
      expect(isCodeFile("app.vue")).toBe(true);
      expect(isCodeFile("component.svelte")).toBe(true);
    });
  });

  describe("backend languages", () => {
    it("should identify backend language files as code files", () => {
      expect(isCodeFile("main.py")).toBe(true);
      expect(isCodeFile("App.java")).toBe(true);
      expect(isCodeFile("Main.kt")).toBe(true);
      expect(isCodeFile("service.scala")).toBe(true);
      expect(isCodeFile("build.groovy")).toBe(true);
      expect(isCodeFile("Program.cs")).toBe(true);
      expect(isCodeFile("Module.vb")).toBe(true);
      expect(isCodeFile("script.fs")).toBe(true);
      expect(isCodeFile("index.php")).toBe(true);
      expect(isCodeFile("app.rb")).toBe(true);
      expect(isCodeFile("main.go")).toBe(true);
      expect(isCodeFile("lib.rs")).toBe(true);
      expect(isCodeFile("ViewController.swift")).toBe(true);
    });
  });

  describe("c family languages", () => {
    it("should identify C family language files as code files", () => {
      expect(isCodeFile("main.c")).toBe(true);
      expect(isCodeFile("app.cpp")).toBe(true);
      expect(isCodeFile("lib.cc")).toBe(true);
      expect(isCodeFile("module.cxx")).toBe(true);
      expect(isCodeFile("header.h")).toBe(true);
      expect(isCodeFile("header.hpp")).toBe(true);
    });
  });

  describe("mobile development", () => {
    it("should identify mobile development files as code files", () => {
      expect(isCodeFile("app.dart")).toBe(true);
      expect(isCodeFile("ViewController.m")).toBe(true);
      expect(isCodeFile("ViewController.mm")).toBe(true);
      expect(isCodeFile("script.kts")).toBe(true);
    });
  });

  describe("functional languages", () => {
    it("should identify functional language files as code files", () => {
      expect(isCodeFile("main.hs")).toBe(true);
      expect(isCodeFile("app.elm")).toBe(true);
      expect(isCodeFile("core.clj")).toBe(true);
      expect(isCodeFile("frontend.cljs")).toBe(true);
      expect(isCodeFile("module.ml")).toBe(true);
      expect(isCodeFile("server.ex")).toBe(true);
      expect(isCodeFile("script.exs")).toBe(true);
      expect(isCodeFile("gen_server.erl")).toBe(true);
      expect(isCodeFile("header.hrl")).toBe(true);
    });
  });

  describe("other languages", () => {
    it("should identify other language files as code files", () => {
      expect(isCodeFile("analysis.r")).toBe(true);
      expect(isCodeFile("compute.jl")).toBe(true);
      expect(isCodeFile("script.lua")).toBe(true);
      expect(isCodeFile("parser.pl")).toBe(true);
      expect(isCodeFile("Module.pm")).toBe(true);
      expect(isCodeFile("query.sql")).toBe(true);
      expect(isCodeFile("schema.graphql")).toBe(true);
      expect(isCodeFile("service.proto")).toBe(true);
      expect(isCodeFile("config.vim")).toBe(true);
      expect(isCodeFile("boot.asm")).toBe(true);
      expect(isCodeFile("init.s")).toBe(true);
    });
  });

  describe("legacy languages", () => {
    it("should identify legacy language files as code files", () => {
      expect(isCodeFile("program.pas")).toBe(true);
      expect(isCodeFile("unit.pp")).toBe(true);
      expect(isCodeFile("compute.f")).toBe(true);
      expect(isCodeFile("module.f90")).toBe(true);
      expect(isCodeFile("lib.f95")).toBe(true);
      expect(isCodeFile("payroll.cobol")).toBe(true);
      expect(isCodeFile("batch.cob")).toBe(true);
      expect(isCodeFile("report.cbl")).toBe(true);
      expect(isCodeFile("package.ada")).toBe(true);
      expect(isCodeFile("body.adb")).toBe(true);
      expect(isCodeFile("spec.ads")).toBe(true);
      expect(isCodeFile("script.tcl")).toBe(true);
      expect(isCodeFile("design.vhdl")).toBe(true);
      expect(isCodeFile("entity.vhd")).toBe(true);
      expect(isCodeFile("module.v")).toBe(true);
      expect(isCodeFile("testbench.sv")).toBe(true);
    });
  });

  describe("case insensitive", () => {
    it("should handle case insensitive extensions", () => {
      expect(isCodeFile("APP.PY")).toBe(true);
      expect(isCodeFile("Main.JS")).toBe(true);
      expect(isCodeFile("Component.TSX")).toBe(true);
      expect(isCodeFile("Service.JAVA")).toBe(true);
      expect(isCodeFile("module.CPP")).toBe(true);
    });
  });

  describe("non-code extensions", () => {
    it("should reject non-code file extensions", () => {
      expect(isCodeFile("README.md")).toBe(false);
      expect(isCodeFile("notes.txt")).toBe(false);
      expect(isCodeFile("config.json")).toBe(false);
      expect(isCodeFile("data.xml")).toBe(false);
      expect(isCodeFile("settings.yml")).toBe(false);
      expect(isCodeFile("docker.yaml")).toBe(false);
      expect(isCodeFile("data.csv")).toBe(false);
      expect(isCodeFile("index.html")).toBe(false);
      expect(isCodeFile("style.css")).toBe(false);
      expect(isCodeFile("icon.svg")).toBe(false);
      expect(isCodeFile("image.png")).toBe(false);
      expect(isCodeFile("photo.jpg")).toBe(false);
      expect(isCodeFile("picture.jpeg")).toBe(false);
      expect(isCodeFile("animation.gif")).toBe(false);
      expect(isCodeFile("favicon.ico")).toBe(false);
      expect(isCodeFile("document.pdf")).toBe(false);
      expect(isCodeFile("package.lock")).toBe(false);
      expect(isCodeFile("environment.env")).toBe(false);
    });
  });

  describe("files without extension", () => {
    it("should reject files without extensions", () => {
      expect(isCodeFile("README")).toBe(false);
      expect(isCodeFile("Makefile")).toBe(false);
      expect(isCodeFile("Dockerfile")).toBe(false);
      expect(isCodeFile("LICENSE")).toBe(false);
    });
  });

  describe("multiple dots", () => {
    it("should handle files with multiple dots correctly", () => {
      expect(isCodeFile("config.test.js")).toBe(true);
      expect(isCodeFile("component.spec.ts")).toBe(true);
      expect(isCodeFile("data.backup.py")).toBe(true);
      expect(isCodeFile("file.min.js")).toBe(true);
      expect(isCodeFile("archive.tar.gz")).toBe(false);
      expect(isCodeFile("backup.sql.bak")).toBe(false);
    });
  });

  describe("edge cases", () => {
    it("should handle edge cases", () => {
      expect(isCodeFile("")).toBe(false);
      expect(isCodeFile(".")).toBe(false);
      expect(isCodeFile("..")).toBe(false);
      expect(isCodeFile(".py")).toBe(true);
      expect(isCodeFile(".js")).toBe(true);
      expect(isCodeFile("file.")).toBe(false);
    });
  });

  describe("invalid input", () => {
    it("should handle invalid input types", () => {
      expect(isCodeFile(null as any)).toBe(false);
      expect(isCodeFile(123 as any)).toBe(false);
      expect(isCodeFile([] as any)).toBe(false);
      expect(isCodeFile({} as any)).toBe(false);
      expect(isCodeFile(true as any)).toBe(false);
    });
  });

  describe("with paths", () => {
    it("should handle files with paths", () => {
      expect(isCodeFile("src/main.py")).toBe(true);
      expect(isCodeFile("utils/helper.js")).toBe(true);
      expect(isCodeFile("lib/module.rb")).toBe(true);
      expect(isCodeFile("package/file.go")).toBe(true);
      expect(isCodeFile("very/long/path/to/deeply/nested/file.cpp")).toBe(true);
      expect(isCodeFile("src/components/Button.tsx")).toBe(true);
    });
  });

  describe("real world examples", () => {
    it("should handle real world file examples", () => {
      expect(isCodeFile("services/webhook/merge_handler.py")).toBe(true);
      expect(isCodeFile("utils/files/is_code_file.py")).toBe(true);
      expect(isCodeFile("config/database.yml")).toBe(false);
      expect(isCodeFile("README.md")).toBe(false);
      expect(isCodeFile("package-lock.json")).toBe(false);
    });
  });
});
