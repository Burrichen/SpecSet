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
  { dice: 3, name: 'Atypical Shipping Methods', description: 'It is known for having unique ways to move goods.' },
  { dice: 4, name: 'Information', description: 'It is known as a source for information.' },
  { dice: 5, name: 'Purchasing Connections', description: 'It is known for having folks who can find particular things.' },
  { dice: 6, name: 'Hospitality', description: 'The main inn here is particularly good.'},
];

const foodAndDrink = [
  { dice: 1, name: 'Food', description: 'Excellent or unqiue food.' },
  { dice: 2, name: 'Drink', description: 'Plentiful and varied high-quality deverages' },
];

const tradingPostAges = [
  { dice: 1, name: 'Recent', description: 'It was established within the past year.', modifiers: { visitorTraffic: -1 } },
  { dice: 2, name: 'Established', description: 'It has been around for at least a couple of years.', modifiers: { visitorTraffic: 0 } },
  { dice: 3, name: 'Mature', description: 'It was originally built decades ago.', modifiers: { visitorTraffic: 1 } },
  { dice: 4, name: 'Old', description: 'It was build around 100 years ago.', modifiers: { visitorTraffic: 2 } },
  { dice: 5, name: 'Ancient', description: 'It was built hundereds of years ago.', modifiers: { visitorTraffic: 3 } },
  { dice: 6, name: 'Unknown', description: 'No one knows when it was established.', modifiers: { visitorTraffic: 3 } },
];

const tradingPostConditions = [
  { min: 1, max: 2, name: 'Ramshackle', description: 'A few buildings look to be falling down. There are no formal roads.', modifiers: { populationWealth: -6 } },
  { min: 3, max: 6, name: 'Poor', description: 'The buildings and surrondings are rough and dirty. Roads are uneven and dust.', modifiers: { populationWealth: -3 } },
  { min: 7, max: 14, name: 'Fair', description: 'The buildings are clean but sparsely decorated. Roads are flattened earth, possibly gravel.', modifiers: { populationWealth: 0 } },
  { min: 15, max: 18, name: 'Good', description: 'Most buildings are exceptionally well kept, and moderately decorated. Roads are cobble, or cheap brick.', modifiers: { populationWealth: 3 } },
  { min: 19, max: 20, name: 'Immaculate', description: 'The buildings are spotless, well-adorned, with tasteful decorations. Roads are made of well-placed flagstones.', modifiers: { populationWealth: 6 } },
];

const visitorTrafficTable = [
  { min: 1, max: 2, name: 'Vacant', description: 'No one seems to be visiting this place.', modifiers: { size: 0, crime: 2 } },
  { min: 3, max: 6, name: 'Groups', description: 'Visitors are a rarity, though a few might be around.', modifiers: { size: 1, crime: 1 } },
  { min: 7, max: 14, name: 'Crowds', description: 'It is typical to see some new visitors most days.', modifiers: { size: 2, crime: 0 } },
  { min: 15, max: 18, name: 'Droves', description: 'There are lots of new faces on a regular basis.', modifiers: { size: 3, crime: -1 } },
  { min: 19, max: 20, name: 'Masses', description: 'New people are everywhere, coming and going at all times.', modifiers: { size: 4, crime: -2 } },
];

const tradingPostSizeTable = [
  { min: 1, max: 2, name: 'Very Small', description: 'Up to 20 standing structures.' },
  { min: 3, max: 6, name: 'Small', description: 'Up to 40 standing structures.' },
  { min: 7, max: 14, name: 'Medium', description: 'Up to 60 standing structures.' },
  { min: 15, max: 18, name: 'Large', description: 'Up to 80 standing structures.' },
  { min: 19, max: 20, name: 'Very Large', description: 'Up to 100 standing structures.' },
];

const residentPopulationTable = [
    { min: 1, max: 2, name: 'Nearly Deserted', description: 'There are many empty houses and businesses.', modifiers: { crime: 2 } },
    { min: 3, max: 6, name: 'Sparse', description: 'There are some empty houses and businesses.', modifiers: { crime: 1 } },
    { min: 7, max: 14, name: 'Appropriate', description: 'Homes and businesses are comfortably populated.', modifiers: { crime: 0 } },
    { min: 15, max: 18, name: 'Congested', description: 'Movement is difficult. Homes and common buildings are often at capacity.', modifiers: { crime: -1 } },
    { min: 19, max: 20, name: 'Overwhelmed', description: 'The trading post cannot support this many people. Movement is extremely difficult. Tent and shanty towns have cropped up along the outskirts of the settlement.', modifiers: { crime: -2 } },
];

const lawEnforcementTable = [
    { min: 1, max: 2, name: 'None', description: 'This could be good or bad, depending on one\'s point of view. Good, if the folk here are just that. Bad when mob justice is carried out on a petty thief.', modifiers: { crime: -8 } },
    { min: 3, max: 6, name: 'Sheriff', description: 'A single sheriff and a deputy keep things civil.', modifiers: { crime: -4 } },
    { min: 7, max: 14, name: 'Small Local Watch', description: 'A sheriff, a deputy, and a handful of volunteer residents make up a token watch presence.', modifiers: { crime: 0 } },
    { min: 15, max: 18, name: 'Well-Equipped', description: 'Law enforcement is very common.', modifiers: { crime: 4 } },
    { min: 19, max: 20, name: 'Overwhelming Presence', description: 'Law enforcement is always around in public, no matter what.', modifiers: { crime: 8 } },
];

const leadershipTable = [
    { min: 1, max: 1, name: 'No Leader', description: 'The trading post operates with no leadership, which could lead to unresolved disputes.' },
    { min: 2, max: 4, name: 'Hereditary', description: 'A non-elected leader is in power, by virtue of their bloodline.' },
    { min: 5, max: 7, name: 'Merchant Monarch', description: 'The wealthiest shop owner in the trading post leads by default.' },
    { min: 8, max: 10, name: 'Underworld or Criminal Enterprise', description: 'A criminal, or group of criminals, either publicly, or privately, controls the trading post.' },
    { min: 11, max: 13, name: 'Oligarchy', description: 'A few individuals hold sway, collectively, over the trading post.' },
    { min: 14, max: 16, name: 'Local Council', description: 'Prominent members of the community were chosen to lead the trading post collectively.' },
    { min: 17, max: 19, name: 'Single, elected leader', description: 'The locals democratically voted for their current leader.' },
    { min: 20, max: 20, name: 'Anarcho-Syndicalist Commune', description: 'The members of the trading post take turns as a sort of executive officer for the week.' },
];

const populationWealthTable = [
    { min: 1, max: 2, name: 'Destitute', description: 'Most of the population consistently lacks the barest essentials of what they need to survive.', modifiers: { crime: -4, quality: -2 } },
    { min: 3, max: 6, name: 'Impoverished', description: 'Around half of the population struggles to carve out even a meager existence.', modifiers: { crime: -2, quality: -1 } },
    { min: 7, max: 14, name: 'Average', description: 'Most of the population have enough to live a modest life.', modifiers: { crime: 0, quality: 0 } },
    { min: 15, max: 17, name: 'Prosperous', description: 'Most of the population has enough to live a good life and, of them, a fair amount can even live comfortably.', modifiers: { crime: -1, quality: 0 } },
    { min: 18, max: 19, name: 'Wealthy', description: 'Nearly everyone has what they need to live comfortably, many are able to live well, and some are very prosperous.', modifiers: { crime: -2, quality: 2 } },
    { min: 20, max: 20, name: 'Affluent', description: 'Nearly everyone is able to live comfortably, with a significant portion living in luxury.', modifiers: { crime: -4, quality: 3 } },
];

const crimeTable = [
    { min: 1, max: 2, name: 'Regular', description: 'The streets are crawling with criminals, and a purse unstowed is almost sure to be snatched.', modifiers: { urbanEncounter: 4 } },
    { min: 3, max: 6, name: 'Common', description: 'Most are used to hearing about trouble every day or two. Everyone knows someone who\'s been a victim of crime.', modifiers: { urbanEncounter: 3 } },
    { min: 7, max: 14, name: 'Average', description: 'Theft or mild violence can happen from time to time. Best to keep an eye out.', modifiers: { urbanEncounter: 2 } },
    { min: 15, max: 18, name: 'Uncommon', description: 'Some in the trading post have run into a pickpocket or heard about a robbery but, when they do, it\'s a noteworthy occurrence.', modifiers: { urbanEncounter: 1 } },
    { min: 19, max: 20, name: 'Rare', description: 'Most in the trading post have had no personal experience of crime, and know few people that have.', modifiers: { urbanEncounter: 0 } },
];

const shopLocationsData = {
    'Very Small': { dieCount: 1, dieSize: 8, bonus: 2 },
    'Small':      { dieCount: 1, dieSize: 8, bonus: 4 },
    'Medium':     { dieCount: 1, dieSize: 8, bonus: 6 },
    'Large':      { dieCount: 1, dieSize: 8, bonus: 8 },
    'Very Large': { dieCount: 1, dieSize: 8, bonus: 10 },
};

const shopsTable = [
    { min: 1, max: 4, name: 'Baker (B)', description: 'Bakes and sells fresh bread and, possibly, pastries.' },
    { min: 5, max: 8, name: 'Butcher (B)', description: 'Processes and sells fresh and/or dried meat.' },
    { min: 9, max: 12, name: 'Cooper (B)', description: 'Crafts wooden vessels held together with metal hoops, including barrels, buckets, etc.' },
    { min: 13, max: 16, name: 'Carpenter (B)', description: 'Builds with or carves wood, as well as carrying out repairs.' },
    { min: 17, max: 24, name: 'General Store (B)', description: 'Sells basic supplies, groceries, and various odds and ends.' },
    { min: 25, max: 28, name: 'Herbalist (B)', description: 'Sells common herbs and natural, non-magical remedies.' },
    { min: 29, max: 36, name: 'Smithy (B)', description: 'Sells and crafts metal tools and equipment, including very basic weapons and armor.' },
    { min: 37, max: 40, name: 'Tailor (B)', description: 'Makes and sells of clothing, including hats and cloaks. Also sells general items made from cloth, such as blankets, and carries out repairs and alterations of cloth goods.' },
    { min: 41, max: 44, name: 'Tanner/Taxidermist (B)', description: 'Processes animal hides for practical or ornamental purposes.' },
    { min: 45, max: 48, name: 'Thatcher (B)', description: 'Builds roofs using layers of dried straw, reeds, rushes, etc.' },
    { min: 49, max: 52, name: 'Wainwright (B)', description: 'Builds carts and wagons.' },
    { min: 53, max: 56, name: 'Weaver (B)', description: 'Weaves raw fabric and baskets.' },
    { min: 57, max: 59, name: 'Alchemist (S)', description: 'Brews and sells potions, as well as mundane herbs and alchemical ingredients.' },
    { min: 60, max: 62, name: 'Artist (S)', description: 'Encompasses painter, sculptor or other visual art as appropriate.' },
    { min: 63, max: 65, name: 'Bank & Exchange (S)', description: 'Encompasses auctions, banking, and the specific selling of gems or exchange of currency.' },
    { min: 66, max: 68, name: 'Cobbler (S)', description: 'Makes and mends boots and shoes.' },
    { min: 69, max: 71, name: 'Foundry/Smelting (S)', description: 'Ore processing and metal fabrication.' },
    { min: 72, max: 74, name: 'Mill (S)', description: 'Facilities for milling grain.' },
    { min: 75, max: 77, name: 'Textile Production (S)', description: 'Larger scale than a single weaver, offering a wider array of materials in larger quantities.' },
    { min: 78, max: 80, name: 'Shipwright (S)', description: 'Builds and launches boats and/or ships. [Reroll if settlement is not bordering a significant source of water]' },
    { min: 81, max: 82, name: 'Rare Botanicals (E)', description: 'Cultivates and sells herbs rare to the region.' },
    { min: 83, max: 84, name: 'Luxury Furnishings (E)', description: 'Procures and sells all manner of home items for fine living, including furniture, art, and other high-quality goods.' },
    { min: 85, max: 86, name: 'Rare Libations & Fare (E)', description: 'Sells (and, perhaps, makes or brews) drinks and/or food of surpassing quality or rarity to the region.' },
    { min: 87, max: 88, name: 'Rare Trade Goods (E)', description: 'Procures and sells items and materials, such as ores or textiles, that are rare to the region.' },
    { min: 89, max: 90, name: 'Magic Shop - Armor (E)', description: 'Sells magical items with a focus on armor and protective equipment.' },
    { min: 91, max: 92, name: 'Magic Shop - Books (E)', description: 'Sells magical items with a focus on literature, arcane tomes and lore. They may also carry books and documents (such as maps and records) of a rare and significant nature, though non-magical.' },
    { min: 93, max: 94, name: 'Magic Shop - Clothing (E)', description: 'Sells magical items with a focus on clothing of all types which bear magical properties.' },
    { min: 95, max: 96, name: 'Magic Shop - Jewelry (E)', description: 'Sells magical items with a focus on enchanted, or otherwise magically imbued, jewelry.' },
    { min: 97, max: 98, name: 'Magic Shop - Weapons (E)', description: 'Sells magical items with a focus on weapons with mystic properties and, perhaps, shields.' },
    { min: 99, max: 100, name: 'Magic Shop - Miscellaneous & Curiosities (E)', description: 'Procures and sells strange and rare artifacts of a wondrous or intriguing nature.' },
];


export {
  tradingPostOrigins,
  tradingPostSpecialties,
  foodAndDrink,
  tradingPostAges,
  tradingPostConditions,
  visitorTrafficTable,
  tradingPostSizeTable,
  residentPopulationTable,
  lawEnforcementTable,
  leadershipTable,
  populationWealthTable,
  crimeTable,
  shopLocationsData,
  shopsTable,
};