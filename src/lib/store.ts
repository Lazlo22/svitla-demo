/**
 * Generate a unique name by appending a counter if the name already exists
 */
export function generateUniqueName(name: string, existingNames: Set<string>): string {
  if (!existingNames.has(name.toLowerCase())) {
    return name;
  }
  
  let counter = 1;

  while (existingNames.has(`${name} (${counter})`.toLowerCase())) {
    counter++;
  }
  
  return `${name} (${counter})`;
}

/**
 * Get a set of lowercase names from a list of items
 */
export function getExistingNames<T>(items: T[], getName: (item: T) => string): Set<string> {
  return new Set(items.map((item) => getName(item).toLowerCase()));
}
