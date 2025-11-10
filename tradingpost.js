// tradingpost.js

const tradingPostOrigins = [
  { dice: 1, name: 'Accidental', description: 'It came about due to an accident, such as a caravan breaking down.' },
  { dice: 2, name: 'Business Venture', description: 'It was established by a wealthy entrepreneur specifically to be a trading post.' },
  { dice: 3, name: 'Crossroads', description: 'It is at the intersection of more than one trade route.' },
  { dice: 4, name: 'Military Outpost', description: 'It was built on the remnants of an old fortress or watchtower, that has been repurposed.' },
  { dice: 5, name: 'No Mans Land', description: 'It was established as a neutral place where opposing forces could purchase goods.' },
  { dice: 6, name: 'Native', description: 'It was started by someone native to the area, who saw potential.'},
  { dice: 7, name: 'Overnight Stop', description: 'It was originally a single, large house for overnight stays.'},
  { dice: 8, name: 'Wilderness Expert', description: 'It was started when a trapper, hunter or guide set up camp.'},
];

const tradingPostSpecialties = [
  { dice: 1, name: 'Food & Drink', description: 'It is known for a particular kind of food or drink.' },
  { dice: 2, name: 'Hired Hands', description: 'It is a haven for shady guilds and mercenaries.' },
  { dice: 3, name: 'Your Third Specialty', description: 'Describe the unique goods or services found here.' },
  { dice: 4, name: 'Your Fourth Specialty', description: 'Describe the unique goods or services found here.' },
  { dice: 5, name: 'Your Fifth Specialty', description: 'Describe the unique goods or services found here.' },
  { dice: 6, name: 'Your Sixth Specialty', description: 'Describe the unique goods or services found here.' },
];

const foodAndDrink = [
  { dice: 1, name: 'Your First Food/Drink', description: 'e.g., A rare vintage, a potent spirit, a delicious pie.' },
  { dice: 2, name: 'Your Second Food/Drink', description: 'Describe the special consumable.' },
  { dice: 3, name: 'Your Third Food/Drink', description: 'Describe the special consumable.' },
  { dice: 4, name: 'Your Fourth Food/Drink', description: 'Describe the special consumable.' },
];

const tradingPostAges = [
  { dice: 1, name: 'Your First Age', description: 'e.g., Ancient, Established, Recent, New.' },
  { dice: 2, name: 'Your Second Age', description: 'Describe the age of the settlement.' },
  { dice: 3, name: 'Your Third Age', description: 'Describe the age of the settlement.' },
  { dice: 4, name: 'Your Fourth Age', description: 'Describe the age of the settlement.' },
  { dice: 5, name: 'Your Fifth Age', description: 'Describe the age of the settlement.' },
  { dice: 6, name: 'Your Sixth Age', description: 'Describe the age of the settlement.' },
];


export {
  tradingPostOrigins,
  tradingPostSpecialties,
  foodAndDrink, // <-- NAME UPDATED HERE
  tradingPostAges,
};