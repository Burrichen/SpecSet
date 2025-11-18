// capital.js

// This file contains data tables specific to the Capital settlement type.

const capitalOriginsTable = [
    { dice: 1, name: 'First Settlement', description: 'This location was the first one settled in the region, and continued to grow as a central location, outpacing all others.' },
    { dice: 2, name: 'Holy City', description: 'The site was of religious significance, and was settled with the intent of growing it into a capital.' },
    { dice: 3, name: 'Military Camp', description: 'A force, with a lengthy posting in the region, struck their tents in favor of permanent structures.' },
    { dice: 4, name: 'Invading Occupation', description: 'The settlement was previously smaller and of little significance. It was sacked and conquered by an invading force, who chose to make the place their own centre of operations, for better or worse.' },
    { dice: 5, name: 'Natural Progression - Trading Post', description: 'The capital was originally a trading post which attracted enough business to warrant expansion. It managed to grow to the point where it held commercial power over the entire region.' },
    { dice: 6, name: 'Resurrected Ruins', description: 'The capital is built on the bones of an ancient capital city. Those first exploring pioneers knew of its former glory, and sought to use the remnants of history to their advantage.' },
    { dice: 7, name: 'Homegrown Inspiration', description: 'A tiny village gradually blossomed into a great community. They became a beacon, looked to by all others in the region.' },
    { dice: 8, name: 'Haven', description: 'The location attracted multitudes of people seeking refuge from external crisis. They could have been persecuted by some great oppressor or, perhaps, they fled a natural disaster. Conversely, the newcomers could have been a society of rebels or pirates who desired an independent settlement of their own.' },
    { dice: 9, name: 'Advantageous Position', description: 'The site was chosen to take advantage of desirable geographical features, like a strategic choke point, or an ideal high-ground posting. As the location proved itself, it grew which, in turn, created a stronger hold, and so on.' },
    { dice: 10, name: 'Prison', description: 'The site was originally a holding colony for criminals but, over time, events transpired allowing the place to become a legitimate city in its own right. Was this thanks to a successful revolt? Or perhaps the kingdom that held the prison colony was conquered and the colony was left to its own devices? Maybe something made the colony’s kingdom change its mind and legitimize it?' },
    { dice: 11, name: 'Agriculture', description: 'Once a dense farming community, its production was such that wealth and population rapidly grew, necessitating the need for a larger presence.' },
    { dice: 12, name: 'Magical', description: 'The capital was founded around something related to magic (perhaps a theory, rumor, or massive spell event). The draw of the original idea proved to be very strong indeed.' },
];

const capitalAgeTable = [
    { min: 1, max: 2, name: 'Recent', description: 'The capital’s final work was completed within the past 10 years.', modifiers: { populationDensity: -2 } },
    { min: 3, max: 4, name: 'Established', description: 'The capital has been around for at least 10, but up to 100, years.', modifiers: { populationDensity: -1 } },
    { min: 5, max: 6, name: 'Mature', description: 'The capital has been around at least 100, but up to 300, years.', modifiers: { populationDensity: 0 } },
    { min: 7, max: 8, name: 'Old', description: 'The capital has been around for 300 to 1000 years.', modifiers: { populationDensity: 1 } },
    { min: 9, max: 10, name: 'Ancient', description: 'The capital is older than living, and possibly even recorded, memory.', modifiers: { populationDensity: 2 } },
];

const capitalSizeTable = [
    { min: 1, max: 2, name: 'Very Small', description: 'Structures in the capital are likely able to support up to 20,000 people.', modifiers: { numberOfDistricts: -4 } },
    { min: 3, max: 6, name: 'Small', description: 'Structures in the capital are able to support around 35,000 people.', modifiers: { numberOfDistricts: -1 } },
    { min: 7, max: 14, name: 'Medium', description: 'Structures in the capital are able to support around 50,000 people.', modifiers: { numberOfDistricts: 0 } },
    { min: 15, max: 18, name: 'Large', description: 'Structures in the capital are able to support around 100,000 people.', modifiers: { numberOfDistricts: 2 } },
    { min: 19, max: 20, name: 'Very Large', description: 'Structures in the capital are able to support over 150,000 people or more.', modifiers: { numberOfDistricts: 6 } },
];

const outsideTheCapitalCountData = {
    'Very Small': 5,
    'Small': 4,
    'Medium': 3,
    'Large': 2,
    'Very Large': 1,
};

const explorationSubTable = [
    { min: 1, max: 3, text: "The exploration is still active." },
    { min: 4, max: 6, text: "It has been abandoned/completed." }
];

const warrensSubTable = [
    { min: 1, max: 3, text: "It is known to the capital." },
    { min: 4, max: 6, text: "It is not known about." }
];

const outsideTheCapitalTable = [
    { min: 1, max: 20, name: 'None', description: 'If you have any remaining rolls to make on this table, proceed with them.' },
    { min: 21, max: 30, name: 'Farming [Agriculture]', description: 'A group of farms, providing food grown for the capital, are found on the nearest hospitable land under its control.' },
    { min: 31, max: 40, name: 'Farming [Livestock]', description: 'A group of farms, providing livestock for the capital, are found on the nearest hospitable land under its control.' },
    { min: 41, max: 50, name: 'Resource Harvesting', description: 'Depending on the landscape and available resources (trees, minerals, ore, stone, etc.), a logging camp, mine, or quarry, belonging to the capital, has been built nearby to harvest them, which it then uses or sells.' },
    { min: 51, max: 55, name: 'Barrows', description: 'An area devoted to burial sites.' },
    { min: 56, max: 59, name: 'Caravan Community', description: 'A nomadic group of people have taken to living on the surrounding land nearby. Does the capital’s leadership have an issue with this? What about its residents?' },
    { min: 60, max: 64, name: 'Event Grounds', description: 'Tended grounds for games, duels, ceremonies, or other events.' },
    { min: 65, max: 68, name: 'Exploration', description: 'Explorers have been investigating something at this site, a fair distance outside the capital.', subTable: explorationSubTable, subTableDice: 6 },
    { min: 69, max: 73, name: 'Family Estate', description: 'A wealthy family’s large estate is situated in the neighboring countryside.' },
    { min: 74, max: 78, name: 'Makeshift Settlement', description: 'A large mass of hovels, lean-tos, tents, and other improvised shelters have been built in the shadow of the capital’s walls. Why? Do the leaders and residents care?' },
    { min: 79, max: 82, name: 'Medical Camp', description: 'A set of makeshift or, depending on the nature of what is being treated, permanent structures have been erected to tend to, or even quarantine, the sick or injured.' },
    { min: 83, max: 87, name: 'Prison', description: 'Some sort of structure out here has been designated for holding prisoners or captives (for whatever reason) either temporarily, or much longer term.' },
    { min: 88, max: 91, name: 'Subterranean Warrens', description: 'Something is under the capital (below even the sewer system, if the capital has one). These could be the ruins of another city, the crude dwelling place of simple beasts, or the residence of another active civilization.', subTable: warrensSubTable, subTableDice: 6 },
    { min: 92, max: 95, name: 'Tended Nature', description: 'An area of nature outside the capital has been preserved and tended to. This may be a park, preserved forest, animal reserve, or something else. It may, or may not, be controlled by the capital.' },
    { min: 96, max: 99, name: 'Training Grounds', description: 'Land was set aside for the training of large groups of people. If the capital has its own military force, they may use this. It could also be under the leadership of a mercenary company.' },
    { min: 100, max: 100, name: 'Unusable', description: 'This area cannot be used, for some reason. There may have been a disaster with lingering effects, or perhaps a past enemy has salted the ground. There may be foul beasts or monsters residing there, or some magical deterrent. One way or another, folks don’t come here anymore.' },
];

export {
    capitalOriginsTable,
    capitalAgeTable,
    capitalSizeTable,
    outsideTheCapitalCountData,
    outsideTheCapitalTable,
};