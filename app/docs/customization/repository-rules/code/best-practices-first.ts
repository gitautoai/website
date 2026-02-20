export const bestPracticesFirst = `// GitAuto will prefer modern patterns like:
const user = await fetchUser(id);
if (!user) return null;

// But will match your existing style if you use:
fetchUser(id).then(user => {
  if (!user) return null;
  // ...
});`;
