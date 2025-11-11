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
  { dice: 1, name: 'Food & Drink', description: 'It is known for..' },
  { dice: 2, name: 'Hired Hands', description: 'It is known for having people who can get just about anything done...' },
  { dice: 3, name: 'Your Third Specialty', description: 'Describe the unique goods or services found here.' },
  { dice: 4, name: 'Your Fourth Specialty', description: 'Describe the unique goods or services found here.' },
  { dice: 5, name: 'Your Fifth Specialty', description: 'Describe the unique goods or services found here.' },
  { dice: 6, name: 'Your Sixth Specialty', description: 'Describe the unique goods or services found here.' },
];

const foodAndDrink = [
  { dice: 1, name: 'Food', description: 'Excellent or unqiue food.' },
  { dice: 2, name: 'Drink', description: 'Plentiful and varied high-quality deverages' },
];

const tradingPostAges = [
  { dice: 1, name: 'Recent', description: 'It was established within the past year.' },
  { dice: 2, name: 'Established', description: 'It has been around for at least a couple of years.' },
  { dice: 3, name: 'Mature', description: 'It was originally built decades ago.' },
  { dice: 4, name: 'Old', description: 'It was build around 100 years ago.' },
  { dice: 5, name: 'Ancient', description: 'It was built hundereds of years ago.' },
  { dice: 6, name: 'Unknown', description: 'No one knows when it was established.' },
];


export {
  tradingPostOrigins,
  tradingPostSpecialties,
  foodAndDrink, // <-- NAME UPDATED HERE
  tradingPostAges,
};