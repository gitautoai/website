import { isCodeFile } from './is-code-file';

describe('isCodeFile', () => {
  describe('Web technologies', () => {
    it('should identify JavaScript files as code files', () => {
      expect(isCodeFile('app.js')).toBe(true);
      expect(isCodeFile('utils.jsx')).toBe(true);
    });

    it('should identify TypeScript files as code files', () => {
      expect(isCodeFile('app.ts')).toBe(true);
      expect(isCodeFile('component.tsx')).toBe(true);
      expect(isCodeFile('types.d.ts')).toBe(true); // Declaration files are still code files
    });

    it('should identify Vue and Svelte files as code files', () => {
      expect(isCodeFile('App.vue')).toBe(true);
      expect(isCodeFile('Component.svelte')).toBe(true);
    });
  });

  describe('Backend languages', () => {
    it('should identify Python files as code files', () => {
      expect(isCodeFile('main.py')).toBe(true);
    });

    it('should identify Java files as code files', () => {
      expect(isCodeFile('Main.java')).toBe(true);
      expect(isCodeFile('User.kt')).toBe(true);
    });

    it('should identify C# files as code files', () => {
      expect(isCodeFile('Program.cs')).toBe(true);
      expect(isCodeFile('Module.vb')).toBe(true);
    });

    it('should identify other backend languages as code files', () => {
      expect(isCodeFile('server.php')).toBe(true);
      expect(isCodeFile('app.rb')).toBe(true);
      expect(isCodeFile('main.go')).toBe(true);
      expect(isCodeFile('lib.rs')).toBe(true);
    });
  });

  describe('Mobile development', () => {
    it('should identify mobile development files as code files', () => {
      expect(isCodeFile('main.dart')).toBe(true);
      expect(isCodeFile('ViewController.m')).toBe(true);
      expect(isCodeFile('ViewController.mm')).toBe(true);
    });
  });

  describe('C/C++ files', () => {
    it('should identify C/C++ files as code files', () => {
      expect(isCodeFile('main.c')).toBe(true);
      expect(isCodeFile('main.cpp')).toBe(true);
      expect(isCodeFile('main.cc')).toBe(true);
      expect(isCodeFile('header.h')).toBe(true);
      expect(isCodeFile('header.hpp')).toBe(true);
    });
  });

  describe('Shell scripts', () => {
    it('should identify shell scripts as code files', () => {
      expect(isCodeFile('deploy.sh')).toBe(true);
      expect(isCodeFile('setup.bash')).toBe(true);
      expect(isCodeFile('install.ps1')).toBe(true);
    });
  });

  describe('Other languages', () => {
    it('should identify SQL and GraphQL files as code files', () => {
      expect(isCodeFile('schema.sql')).toBe(true);
      expect(isCodeFile('queries.graphql')).toBe(true);
      expect(isCodeFile('types.proto')).toBe(true);
    });
  });

  describe('Non-code files', () => {
    it('should not identify non-code files as code files', () => {
      expect(isCodeFile('README.md')).toBe(false);
      expect(isCodeFile('package.json')).toBe(false);
      expect(isCodeFile('style.css')).toBe(false);
      expect(isCodeFile('index.html')).toBe(false);
      expect(isCodeFile('image.png')).toBe(false);
      expect(isCodeFile('document.pdf')).toBe(false);
      expect(isCodeFile('')).toBe(false);
      expect(isCodeFile('file-without-extension')).toBe(false);
    });
  });
});