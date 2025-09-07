export function clearLocalStorageExcept(whitelist: Array<string> | null = null) {
  whitelist ??= [];
  const preserved: Record<string, string> = {};

  // Save the whitelisted items
  whitelist.forEach((key) => {
    const value = localStorage.getItem(key);
    if (value !== null) {
      preserved[key] = value;
    }
  });

  // Clear everything
  localStorage.clear();

  // Restore the preserved items
  Object.keys(preserved).forEach((key) => {
    localStorage.setItem(key, preserved[key]);
  });
}
