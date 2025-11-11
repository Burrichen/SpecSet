// commonTables.js

// This file contains data tables that can be reused across different settlement types.

const hiredHands = [
  { dice: 1, name: 'Your First Contractor Type', description: 'e.g., Shoddy Builders, "Protection" Rackets, etc.' },
  { dice: 2, name: 'Your Second Contractor Type', description: 'Describe the shady service they provide.' },
  { dice: 3, name: 'Your Third Contractor Type', description: 'Describe the shady service they provide.' },
  { dice: 4, name: 'Your Fourth Contractor Type', description: 'Describe the shady service they provide.' },
];

const environmentTable = [
  { dice: 1, name: 'Coastal', description: 'The trading post is near a large body of water, such as a lake or ocean.' },
  { dice: 2, name: 'Forest', description: 'The trading post is nestled among the trees.' },
  { dice: 3, name: 'Mountains', description: 'The trading post is found on stony passes or soaring peaks.' },
  { dice: 4, name: 'Plains', description: 'The trading post is in the wide, open fields.' },
  { dice: 5, name: 'River', description: 'The trading post is near a steadily flowing stream, or other watercourse.' },
  { dice: 6, name: 'Swamp', description: 'The trading post is in, or near, a vast area of stagnant water.' },
  { dice: 7, name: 'Underground', description: 'The trading post is within a large network of caves.' },
  { dice: 8, name: 'Valley', description: 'The trading post is found within, or on the edge of, an area of recessed elevation in relation to the landscape around it.' },
  { dice: 9, name: 'Tundra', description: 'The trading post is in a very cold environment.' },
  { dice: 10, name: 'Desert', description: 'The trading post is in a dry and arid environment, likely covered with vast sand dunes.' },
];

const dispositionTable = [
    { min: 1, max: 2, name: 'Hostile', description: 'Locals seem very unfriendly toward visitors, and would likely make out-of-towners feel unwelcome. This could manifest as coldness, passive-aggressiveness, or even violence.' },
    { min: 3, max: 6, name: 'Unfriendly', description: 'Locals don\'t care much for visitors, looking upon them with contempt, fear, or suspicion.' },
    { min: 7, max: 14, name: 'Neutral', description: 'Locals are standoffish, or perhaps hard on the outside, but can be friendly, if you get to know them.' },
    { min: 15, max: 18, name: 'Friendly', description: 'Locals are generally friendly, welcoming, and slow to take offense.' },
    { min: 19, max: 20, name: 'Open', description: 'The locals actively enjoy visitors, and their culture incorporates this. Just about anyone is welcome.' },
];

const oligarchyTypeTable = [
    { dice: 1, name: 'Merchants (Plutocracy)', description: 'A council of the wealthiest merchants controls the settlement.' },
    { dice: 2, name: 'Mages (Magocracy)', description: 'A secretive group of powerful magic-users holds sway.' },
    { dice: 3, name: 'Priests (Theocracy)', description: 'The leaders of the dominant local faith are in charge.' },
    { dice: 4, name: 'Other Small Group', description: 'Another small group, such as a council of elders or a powerful family, is in control.' },
];

// We export all shared tables.
export {
  hiredHands,
  environmentTable,
  dispositionTable,
  oligarchyTypeTable,
};