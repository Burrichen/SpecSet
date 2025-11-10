// commonTables.js

// This file contains data tables that can be reused across different settlement types.

const hiredHands = [
  { dice: 1, name: 'Your First Contractor Type', description: 'e.g., Shoddy Builders, "Protection" Rackets, etc.' },
  { dice: 2, name: 'Your Second Contractor Type', description: 'Describe the shady service they provide.' },
  { dice: 3, name: 'Your Third Contractor Type', description: 'Describe the shady service they provide.' },
  { dice: 4, name: 'Your Fourth Contractor Type', description: 'Describe the shady service they provide.' },
];

// We export the data so any file in our project can import and use it.
export { hiredHands };