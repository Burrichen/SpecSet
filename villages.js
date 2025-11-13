// villages.js

// This file contains data tables specific to the Village settlement type.

const villageAges = [
  { min: 1, max: 5, name: 'Recent', description: 'The village was established within the past year. Those within the village are newly settled.', modifiers: { populationDensity: -5, hardshipLikelihood: -4 } },
  { min: 6, max: 10, name: 'Established', description: 'The village has been settled for a few years. They have been able to successfully sustain themselves, and the families have started to grow.', modifiers: { populationDensity: -2, hardshipLikelihood: -2 } },
  { min: 11, max: 14, name: 'Mature', description: 'The village has been around close to a decade or so. Production has been honed, and practices are optimized. Children born in the settlement may be old enough to start to lend a hand.', modifiers: { populationDensity: 0, hardshipLikelihood: 0 } },
  { min: 15, max: 18, name: 'Old', description: 'The village was founded decades ago. Production has reached peak performance, with the elder members of the community being old hands at the work. There are many adults in the village who were born there.', modifiers: { populationDensity: 0, hardshipLikelihood: 2 } },
  { min: 19, max: 20, name: 'Ancient', description: 'The village was established near to, or more than, a century ago.', modifiers: { populationDensity: 0, hardshipLikelihood: 4 } },
];

const hardshipLikelihoodTable = [
    { min: 1, max: 2, name: 'No Hardship', description: 'The village has been lucky, and nothing has troubled it so far.', count: 0 },
    { min: 3, max: 6, name: 'One Hardship', description: 'The village has experienced one notable time of difficulty.', count: 1 },
    { min: 7, max: 14, name: 'Two Hardships', description: 'The village has gone through a couple of hardships.', count: 2 },
    { min: 15, max: 18, name: 'Three Hardships', description: 'The village has experienced three difficult situations.', count: 3 },
    { min: 19, max: 20, name: 'Four Hardships', description: 'The village has been beset by four trying times.', count: 4 },
];

const hardshipTypeTable = [
    { dice: 1, name: 'Plague', description: 'The community fell victim to disease.', modifiedAttributes: ['populationDensity'] },
    { dice: 2, name: 'Bandits on the Road', description: 'On the way to or from market, the village\'s caravan was set upon by bandits.', modifiedAttributes: ['populationWealth'] },
    { dice: 3, name: 'Raid', description: 'The village was raided by marauders.', modifiedAttributes: ['size', 'populationWealth', 'populationDensity'] },
    { dice: 4, name: 'Famine / Food Shortage', description: 'If the village normally produces some kind of food, it did not produce. If they typically get their food from the market, they had difficulties doing.', modifiedAttributes: ['populationDensity'] },
    { dice: 5, name: 'Harsh Weather', description: 'The region was beset by nature\'s wrath.', modifiedAttributes: ['condition', 'size'] },
    { dice: 6, name: 'Inter-Community Conflict/Violence', description: 'A conflict between members of the community broke out and split the village, with dire consequences.', modifiedAttributes: ['populationDensity', 'disposition'] },
    { dice: 7, name: 'Loss of Community Leader', description: 'A key member of the community died or went missing.', modifiedAttributes: ['disposition'] },
    { dice: 8, name: 'Victim of War', description: 'The village was struck by the ravages of war (passing armies, collateral battle damage, disease from war-related issues).', modifiedAttributes: ['condition', 'size', 'populationDensity'] },
];

const hardshipOutcomeTable = [
    { min: 1, max: 2, name: 'Catastrophic Losses', description: 'The village\'s losses were brutal, and excruciatingly difficult, or even impossible, to recover from.', modifier: -5 },
    { min: 3, max: 4, name: 'Terrible Losses', description: 'The village\'s losses were crushing, and incredibly difficult to recover from.', modifier: -4 },
    { min: 5, max: 6, name: 'Heavy Losses', description: 'The village\'s losses were awful, and recovery is proving difficult.', modifier: -3 },
    { min: 7, max: 8, name: 'Moderate Losses', description: 'The village\'s losses were rough but recovery is likely, though may be tough.', modifier: -2 },
    { min: 9, max: 10, name: 'Minimal Losses', description: 'The village\'s losses were as little as could have been hoped for, and recovery should be very possible, even inevitable.', modifier: -1 },
];

const villageSizeTable = [
    { min: 1, max: 2, name: 'Very Small', description: 'Up to a dozen standing structures.' },
    { min: 3, max: 6, name: 'Small', description: 'Up to 30 standing structures.' },
    { min: 7, max: 14, name: 'Medium', description: 'Up to 60 standing structures.' },
    { min: 15, max: 18, name: 'Large', description: 'Up to 90 standing structures.' },
    { min: 19, max: 20, name: 'Very Large', description: 'Up to 120 standing structures.' },
];

const villageConditionTable = [
    { min: 1, max: 2, name: 'Ruined', description: 'The village is little but rubble and debris with, perhaps, a few exceptions.', modifiers: { populationWealth: -6 } },
    { min: 3, max: 6, name: 'Dilapidated', description: 'The village is in a state of disrepair. Some buildings may be coming down, or may have been built in a shoddy fashion. Cleanliness is not a priority.', modifiers: { populationWealth: -3 } },
    { min: 7, max: 14, name: 'Simple', description: 'Most buildings are organized and seem sturdy enough, though there is nothing remarkable. The streets are clear enough to move through, but may be uneven.', modifiers: { populationWealth: 0 } },
    { min: 15, max: 18, name: 'Hearty', description: 'Everything here appears to be well-built and robust. The village seems mindful of cleanliness and upkeep. Roads and paths are well-groomed and flattened.', modifiers: { populationWealth: 3 } },
    { min: 19, max: 20, name: 'Immaculate', description: 'The village is very well organized, and there is clearly a concerted effort to keep it in the best shape possible. Cleanliness is a priority, as is maintenance. Roads and paths are plainly surfaced and clean.', modifiers: { populationWealth: 6 } },
];

const villageSpecialtyTable = [
    { dice: 1, name: 'None', description: 'The village is unremarkable, or not widely known for any particular thing.' },
    { dice: 2, name: 'Food or Drink', description: 'Someone in the village makes a particular food or drink that has gained some notoriety. They may own an establishment, but could easily just sell it out of their home.' },
    { dice: 3, name: 'Location Proximity', description: 'The village itself may not be very special, but it is near somewhere that is, such as a stunning vista, or a site of historical significance.' },
    { dice: 4, name: 'Livestock', description: 'The village is known for breeding strong and healthy (perhaps, even pedigree) animals, such as horses, cattle, sheep, etc.' },
    { dice: 5, name: 'Crop', description: 'The village is known for a particularly notable crop. This could mean rare, high-quality, plentiful, or a mix of the three.' },
    { dice: 6, name: 'Crafted Goods', description: 'The village is known for the craft of a certain item, or type of goods, widely liked and highly valued.' },
];

const villageResourceTable = [
    { dice: 1, name: 'Crops', description: 'The village is surrounded by fields or orchards that produce wheat, barley, grapes, vegetables, fruit, etc. These are harvested in their raw forms, and the excess is sold or traded. Location(s): farm(s), mill(s) and/or storage locations (silos or barns).' },
    { dice: 2, name: 'Dairy', description: 'Pastures contain cows, goats, or sheep for milk, or chickens (or similar) for eggs. Additional animals may also be bred for sale. Due to milk\'s tendency to spoil quickly, it might only be sold at nearby towns or markets. If the produce needs to travel longer distances, perhaps the village makes butter, cream, or cheese instead. Location(s): cellar, creamery, field/barn/coop.' },
    { dice: 3, name: 'Herbs', description: 'Herbs grown in the village are used for alchemy, medicine or, simply, cooking, and are typically tended by an individual, due to their more specialized, and potentially dangerous, nature. The individual may have had some degree of medical, or arcane, training. Note: Unless the village is extremely small, it is unlikely that herbs are a village\'s sole focus. Location(s): herbalist\'s hut and gardens.' },
    { dice: 4, name: 'Fishing', description: 'The villagers utilize the bounty of the nearest stream, river, lake, or ocean. The village\'s proximity to neighboring settlements dictates how the fish can be sold. If remote, the fish might be dried and salted; if nearby, they could be sold fresh. Location(s): fisherman\'s stand, wharf/pier.' },
    { dice: 5, name: 'Livestock (Labor)', description: 'Animals are bred here to perform a particular job. These include plough and war horses, donkeys, cattle, and oxen. The breeding and raising of these animals can be a long process, so trade is likely seasonal, and the animals expensive. Location(s): stable or barn.' },
    { dice: 6, name: 'Livestock (Meat and Hides)', description: 'Animals are raised to be slaughtered for meat, including cattle, pigs, and sheep. Some may be kept to feed the village, but excess animals (live or butchered) would be sold or traded. Location(s): barn or pens, small butcher\'s shop.' },
    { dice: 7, name: 'Livestock (Shearing)', description: 'Llamas, sheep, goats, and/or yaks are shorn in the village, the wool bundled and taken to market. The village may also produce its own woolen goods for sale. Location(s): shearing shed, storage, fields/barn, small stall/shop.' },
    { dice: 8, name: 'Logging and Lumber', description: 'Trees are planted and harvested, sustainably. Harvested trees are hand-trimmed of branches, and logs are used, traded, and sold. Villagers may also process wood to craft wooden goods. Location(s): logging camp, carpenters workshop.' },
    { dice: 9, name: 'Mining', description: 'Raw metal ores are excavated from the ground, cleaned and sorted, and then used, traded, or sold. It is possible the mine is owned by a noble or kingdom, who sends transport to pick up excavated materials. Ores may be processed in the village and turned into metal goods. Location(s): foreman\'s station, mine, smithy.' },
    { dice: 10, name: 'Quarrying and Masonry', description: 'Stone is removed from the landscape in either raw, unrefined pieces, or cut into blocks for various purposes. It is possible the quarry is owned by a noble or kingdom, who sends transport to pick up excavated materials. A local mason may build using the excavated stone. Location(s): mason or foreman\'s station.' },
];

const villageHistoryTable = [
    { dice: 1, name: 'Animal Issues', description: 'Livestock, or pets, may have been ravaged by local wildlife, or monsters, or animals may have been struck by sickness or pestilence.' },
    { dice: 2, name: 'Attacks', description: 'Members of the community have been attacked, either by brigands or, perhaps, monsters.' },
    { dice: 3, name: 'Bumper Production', description: 'A staple resource of the village has yielded very well, recently.' },
    { dice: 4, name: 'Out of Favor', description: 'The village has been subject to the ire of a nearby ruler, or entity.' },
    { dice: 5, name: 'Entertainment', description: 'A certain form of entertainment is proving popular, whether a game or pastime, the arrival of a storyteller or musician, etc.' },
    { dice: 6, name: 'Fear', description: 'Something unnerving, or frightening, has happened recently.' },
    { dice: 7, name: 'Good Fortune', description: 'The village has received favorable notice from a nearby ruler, or entity of note.' },
    { dice: 8, name: 'Infestation', description: 'Some form of vermin, or pest, has recently beset the village, and has become an ongoing issue.' },
    { dice: 9, name: 'Poor Production', description: 'A staple resource of the village has yielded poorly of late.' },
    { dice: 10, name: 'Power Vacuum', description: 'The death, or absence, of a local leadership figure, or figures, has led to internal strife within the community.' },
    { dice: 11, name: 'Safe Haven', description: 'The village has become a sanctuary for refugees, or those in need.' },
    { dice: 12, name: 'Wartorn', description: 'The village was occupied by military forces, and suffered damages, during wartime in the recent past.' },
];

const villagePopulationDensityTable = [
    { min: 1, max: 2, name: 'Skeleton', description: 'There are only enough people here for the village to function at its most basic level.', modifiers: { crime: 2 } },
    { min: 3, max: 6, name: 'Sparse', description: 'People are living here, but not many. They are able to handle all tasks that need doing but, perhaps, with some difficulty.', modifiers: { crime: 1 } },
    { min: 7, max: 14, name: 'Populous', description: 'There are enough people here for the village to manage all tasks without difficulty.', modifiers: { crime: 0 } },
    { min: 15, max: 18, name: 'Dense', description: 'The village seems to have a large amount of people for its size. There are many hands available to help with any work that needs doing.', modifiers: { crime: -1 } },
    { min: 19, max: 20, name: 'Congested', description: 'The village has as many people in it as it can hold, and camps may be cropping up on the outskirts. There are plenty of hands available to help with work, with many unemployed.', modifiers: { crime: -2 } },
];

const villageLawEnforcementTable = [
    { min: 1, max: 3, name: 'None', description: 'This could be good or bad, depending on one\'s point of view. Good if the folk are honest enough that policing is unnecessary, but bad when you need to call for help.', modifiers: { crime: -2 } },
    { min: 4, max: 10, name: 'Disorganized Rabble', description: 'The quintessential village mob, with little to no organization. This is usually formed on the spur-of-the-moment to address a particular issue.', modifiers: { crime: -1 } },
    { min: 11, max: 14, name: 'Organized Rabble', description: 'Perhaps better than the alternative, this group has guidance and leadership in the form of an individual, or small group. They may or may not be competent.', modifiers: { crime: 0 } },
    { min: 15, max: 18, name: 'Sheriff', description: 'A single, officially sanctioned sheriff looks to maintaining order within the village. If they require additional help, they request it from the villagers, who may assist in a temporary capacity.', modifiers: { crime: 1 } },
    { min: 19, max: 20, name: 'Sheriff and Deputies', description: 'A sheriff and a handful of deputies, who are officially sanctioned authorities, maintain a firm hold on the village. They maintain civility in an official capacity.', modifiers: { crime: 2 } },
];

const villageLeadershipTable = [
    { dice: 1, name: 'No Leader', description: 'The village operates with no leadership, which could lead to unresolved disputes.' },
    { dice: 2, name: 'Natural Village Elder', description: 'The village recognizes a wise individual, and informally acknowledges them as an authority figure.' },
    { dice: 3, name: 'External Ruler', description: 'The village owes fealty to a ruler who is located outside the village itself.' },
    { dice: 4, name: 'Local Council', description: 'Prominent members of the community were chosen to lead the village collectively.' },
    { dice: 5, name: 'Single, Elected Leader', description: 'The locals democratically voted for their current leader.' },
    { dice: 6, name: 'Anarcho-Syndicalist Commune', description: 'The members of the village take turns as a sort of executive officer for the week.' },
];

const villagePopulationWealthTable = [
    { min: 1, max: 2, name: 'Destitute', description: 'Most of the population consistently lacks the barest essentials of what they need to survive.', modifiers: { crime: -2 } },
    { min: 3, max: 6, name: 'Impoverished', description: 'Around half of the population struggles to carve out even a meager existence.', modifiers: { crime: -1 } },
    { min: 7, max: 14, name: 'Average', description: 'Most of the population have enough to live a modest life.', modifiers: { crime: 0 } },
    { min: 15, max: 17, name: 'Prosperous', description: 'Most of the population has enough to live a good life and, of them, a fair amount can even live comfortably.', modifiers: { crime: -1 } },
    { min: 18, max: 19, name: 'Wealthy', description: 'The villagers are well off, perhaps even able to indulge once in a while.', modifiers: { crime: -2 } },
    { min: 20, max: 20, name: 'Affluent', description: 'The villagers have plenty of disposable income and want for absolutely nothing.', modifiers: { crime: -3 } },
];

const villageCrimeTable = [
    { min: 1, max: 2, name: 'Average', description: 'Theft or violence can happen from time to time. Best to keep an eye out.', modifiers: { urbanEncounter: 3 } },
    { min: 3, max: 5, name: 'Uncommon', description: 'Crime does not occur often but, when it does, it is a noteworthy occurrence.', modifiers: { urbanEncounter: 2 } },
    { min: 6, max: 10, name: 'Rare', description: 'Most villagers have had no personal experience with crime, and few know people that have.', modifiers: { urbanEncounter: 1 } },
    { min: 11, max: 20, name: 'Little-to-None', description: 'Most, or all, of the villagers believe the village is totally safe, and certainly haven\'t experienced any crime personally.', modifiers: { urbanEncounter: 0 } },
];

// --- NEW TABLES ---

const placesOfWorshipCountData = {
    'Very Small': 1,
    'Small / Medium': { dieCount: 1, dieSize: 2, bonus: 0 },
    'Large / Very Large': { dieCount: 1, dieSize: 2, bonus: 1 },
};

const villagePlaceOfWorshipSizeTable = [
    { min: 1, max: 1, name: 'Secret', description: 'The place of worship\'s size is unclear, as the location is not publicly known.' },
    { min: 2, max: 7, name: 'Altar', description: 'A small shrine or, perhaps, a tiny shack, usually evincing some various items or images relating to that which the faith venerates.' },
    { min: 8, max: 14, name: 'Oratory', description: 'A modest building with seating for attendees, appointed with various items or images relating to that which the faith venerates.' },
    { min: 15, max: 17, name: 'Sanctuary', description: 'A large, well-appointed structure, able to comfortably accommodate up to a few hundred people.' },
    { min: 18, max: 19, name: 'Temple', description: 'A grand building, replete with elements like high ceilings, plush furnishings, and other impressive ornamental and/or architectural features. It can hold nearly a thousand attendees.' },
    { min: 20, max: 20, name: 'Great Temple', description: 'An awe-inspiring structure, devoted to that which it venerates. No expense was spared in its construction. It might display such elements as stunning frescos, elaborate stained-glass scenes, and towering, gilded statues. Walking into a great temple is a rare and striking experience for those who do not live near one.' },
];

export {
  villageAges,
  hardshipLikelihoodTable,
  hardshipTypeTable,
  hardshipOutcomeTable,
  villageSizeTable,
  villageConditionTable,
  villageSpecialtyTable,
  villageResourceTable,
  villageHistoryTable,
  villagePopulationDensityTable,
  villageLawEnforcementTable,
  villageLeadershipTable,
  villagePopulationWealthTable,
  villageCrimeTable,
  placesOfWorshipCountData,
  villagePlaceOfWorshipSizeTable,
};