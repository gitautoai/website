export const consistencyFirst = `// If your codebase uses older patterns:
var user = getUserById(id);
if (user == null) {
  return null;
}

// GitAuto will match this style exactly`;
