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

const capitalStewardshipTable = [
    { min: 1, max: 1, name: 'Neglected', description: 'All of the fundamental elements of the capital are being ignored, or are unable to be addressed.', modifiers: { condition: -7, populationWealth: -13, lawEnforcement: -9 } },
    { min: 2, max: 4, name: 'Minimal', description: 'The fundamental elements of the capital are being tended to, but at the bare minimum.', modifiers: { condition: -4, populationWealth: -6, lawEnforcement: -5 } },
    { min: 5, max: 10, name: 'Passing', description: 'The capital’s fundamental elements are taken care of to a serviceable degree, though an inequality of attention is noticeable.', modifiers: { condition: -1, populationWealth: -3, lawEnforcement: -2 } },
    { min: 11, max: 16, name: 'Adequate', description: 'The capital’s fundamental elements are all taken care of relatively competently, but some room for improvement still exists.', modifiers: { condition: 0, populationWealth: 0, lawEnforcement: 0 } },
    { min: 17, max: 19, name: 'Managed', description: 'The capital’s fundamental elements are all accounted for and well attended to. Whoever is responsible is doing an admirable job.', modifiers: { condition: 1, populationWealth: 3, lawEnforcement: 4 } },
    { min: 20, max: 20, name: 'Disciplined', description: 'The capital’s fundamental elements are firmly in hand, providing what it needs to perform at peak functionality.', modifiers: { condition: 5, populationWealth: 6, lawEnforcement: 8 } },
];

const capitalGeneralConditionTable = [
    { min: 1, max: 1, name: 'Squalid', description: 'The capital is in a deplorable state. Things are falling apart, filthy and, to anyone who doesn’t live there, seems positively unlivable.', modifiers: { districtCondition: -2 } },
    { min: 2, max: 4, name: 'Dilapidated', description: 'Things are dirty and in a widespread state of disrepair, though some token effort may have been made at cleanliness.', modifiers: { districtCondition: -1 } },
    { min: 5, max: 12, name: 'Decent', description: 'The capital is passable. While not offensive to the senses of one that is well traveled, it could still be off-putting to those with lofty expectations.', modifiers: { districtCondition: 0 } },
    { min: 13, max: 19, name: 'Impressive', description: 'The capital is well taken care of, and cleanliness is clearly a priority. Structures are maintained, though signs of wear may still be apparent.', modifiers: { districtCondition: 1 } },
    { min: 20, max: 20, name: 'Magnificent', description: 'The capital is incredible. Cleanliness, maintenance and structural integrity are all of the highest standard.', modifiers: { districtCondition: 2 } },
];

const capitalFortificationTable = [
    { min: 1, max: 1, name: 'Unfortified', description: 'The capital is exposed on all sides, save for any barriers created by the presence of buildings or natural land formations.', modifiers: { disposition: -5 } },
    { min: 2, max: 8, name: 'Lightly Fortified', description: 'The capital has bare-bones fortifications which are a minimal obstacle for enemy forces, but are adequate to deter wild animals. A simple gate, which can be barred in the evenings, sits astride the main road.', modifiers: { disposition: 1 } },
    { min: 9, max: 15, name: 'Fortified', description: 'The capital is surrounded by a substantial wall of wood or stone. The wall is able to be patrolled by guards on a raised walkway.', modifiers: { disposition: 3 } },
    { min: 16, max: 19, name: 'Heavily Fortified', description: 'The capital is surrounded by a heavy wall of wood or stone with several watchtowers built along its length. The gate is double-thickness.', modifiers: { disposition: 5 } },
    { min: 20, max: 20, name: 'Extremely Fortified', description: 'The capital is surrounded by an imposing wall of wood or stone, with many fully-staffed watchtowers at regular intervals along its length.', modifiers: { disposition: 7 } },
];

const capitalMarketSquareTable = [
    { min: 1, max: 2, name: 'Tight', description: 'Only room for a few vendor stalls.' },
    { min: 3, max: 4, name: 'Ample', description: 'Room for a fair number of vendor stalls.' },
    { min: 5, max: 6, name: 'Spacious', description: 'Room for lots of vendor stalls.' },
];

const capitalVendorStallAcquisitionTable = [
    { dice: 1, name: 'First Come, First Served - No Fee', description: 'Merchants line up prior to market day. Those at the front of the line are given the spaces. No fees are charged.' },
    { dice: 2, name: 'First Come, First Served - Fee', description: 'Merchants line up prior to market day. Those at the front of the line are given first pick... provided they can pay the fee.' },
    { dice: 3, name: 'Lease', description: 'Merchants pay in advance (sometimes far in advance) for the right to a space in the market square.' },
    { dice: 4, name: 'Bid', description: 'Prior to market day, the spaces are auctioned off.' },
    { dice: 5, name: 'Sponsored Referral Only - No Fee', description: 'A stall may only be acquired if the vendor is sponsored by a citizen of the capital.' },
    { dice: 6, name: 'Sponsored Referral Only - Fee', description: 'A stall may only be acquired once the vendor pays a fee AND is sponsored by a citizen of the capital.' },
];

const capitalMerchantOverflowTable = [
    { dice: 1, name: 'Banned', description: 'Excess vendors are not allowed to set up stalls outside the town. City guards will enforce this.', modifiers: { lawEnforcement: 1 } },
    { dice: 2, name: 'Unpatrolled', description: 'Excess vendors are allowed to set up stalls but, as the city watch do not patrol or monitor these areas, the risk is higher. The spaces available are unkempt.' },
    { dice: 3, name: 'Monitored', description: 'Excess vendors are allowed to set up stalls, and the city watch patrols through regularly, but the areas themselves are less-maintained and traffic is lighter.' },
    { dice: 4, name: 'Encouraged', description: 'Excess vendors are encouraged to set up stalls outside the capital, if they are unable to get a spot in the square.' },
];

const capitalUndergroundPassagesTable = [
    { min: 1, max: 4, name: 'None', description: 'There are no significant passages underneath the capital.' },
    { min: 5, max: 14, name: 'Sewers', description: 'A network of drains, pipes, and trenches lies beneath the capital.' },
    { min: 15, max: 17, name: 'Natural Caves', description: 'Below the capital, natural cave systems can be found that may, or may not, have been discovered yet.' },
    { min: 18, max: 19, name: 'Tunnels', description: 'A series of tunnels exist beneath the capital. This could be for maintenance, defensive, or clandestine purposes.' },
    { min: 20, max: 20, name: 'Forgotten Crypts', description: 'Old burial chambers and tombs are housed deep beneath the capital, likely unknown to the general populace.' },
];

const capitalLeadershipTable = [
    { min: 1, max: 15, name: 'Elected Council', description: 'Prominent members of the community were chosen to lead the capital collectively.' },
    { min: 16, max: 30, name: 'Governor', description: 'The locals democratically voted for their current leader.' },
    { min: 31, max: 45, name: 'Hereditary', description: 'A non-elected leader is in power, by virtue of their bloodline.' },
    { min: 46, max: 60, name: 'Merchant Monarch', description: 'The wealthiest merchant in the capital leads by default.', rules: { districts: { free: 'Merchant' } } },
    { min: 61, max: 75, name: 'Military Officer', description: 'The capital is controlled by a current or ex-leader of a military group.', modifiers: { lawEnforcement: 1 } },
    { min: 76, max: 90, name: 'Oligarchy', description: 'A few top individuals hold sway, collectively, over the capital.', subTable: 'oligarchy', rules: { districts: { chooseFitting: true } } },
    { min: 91, max: 99, name: 'Underworld or Criminal Enterprise', description: 'A criminal, or group of criminals, either publicly, or privately, controls the capital.', modifiers: { crime: -2 }, rules: { crime: { forceOrganizedCrime: true } } },
    { min: 100, max: 100, name: 'Anarcho-Syndicalist Commune', description: 'The members of the capital take turns as a sort of executive officer for the week.' },
];

const capitalUnityTable = [
    { min: 1, max: 1, name: 'Rank Animosity', description: 'There is open and blatant hostility. Outbursts, threats, and physical violence are possible.' },
    { min: 2, max: 3, name: 'Thinly-Veiled Discord', description: 'There is barely disguised hostility. Muttering, sarcasm, and spiteful comments are likely.' },
    { min: 4, max: 6, name: 'Strained', description: 'Tension can be felt in the room, and overly polite disagreements are frequent.' },
    { min: 7, max: 9, name: 'Uneasy', description: 'Something feels off, but it may just be that someone is having a bad day.' },
    { min: 10, max: 14, name: 'Calm', description: 'Things are peaceful.' },
    { min: 15, max: 17, name: 'Close-Knit', description: 'Communication is open. Disagreements are constructive.' },
    { min: 18, max: 19, name: 'Accord', description: 'Most of those involved are on the same wavelength, and can often anticipate one another.' },
    { min: 20, max: 20, name: 'United', description: 'The bond between those in power is pretty ironclad. They are all of one mind.' },
];

const capitalPriorityTable = [
    { dice: 1, name: 'Humanitarian', description: 'The leadership’s goal is to truly do right by its people. Care and compassion are their highest priorities.' },
    { dice: 2, name: 'Control', description: 'Absolute control is of utmost importance. All decisions are made with the aim of maintaining an iron grip.', modifiers: { militaryForce: 1 } },
    { dice: 3, name: 'Isolationist', description: 'The capital has no desire to get involved in the dealings of other sovereign entities.' },
    { dice: 4, name: 'Expansionist', description: 'The capital wishes to expand its reach, bringing more regions into itself.', modifiers: { militaryForce: 1 } },
    { dice: 5, name: 'Cloak & Dagger', description: 'The government heavily favors pursuing its goals through the liberal use of secrecy and intrigue.', rules: { spyNetwork: { range: [1, 16], result: 'Few' } } },
    { dice: 6, name: 'Economic', description: 'The capital’s leadership concerns itself largely with economic prosperity.', rules: { districts: { free: 'Market' } } },
    { dice: 7, name: 'Enlightenment', description: 'The leadership prides itself on intelligence and wisdom, preserving culture and heritage.', rules: { districts: { free: 'Scholar' } } },
    { dice: 8, name: 'Industry & Innovation', description: 'Those in charge are intent on staying ahead of the curve, pursuing modernization and new ideas.', rules: { districts: { free: 'Industrial' } } },
    { dice: 9, name: 'Release', description: 'Those at the top do not actually want to be in power. Perhaps they inherited it or were elected by momentum.' },
    { dice: 10, name: 'Religious', description: 'The leadership is dedicated to a deity (or deities) and to following their tenets.', rules: { districts: { free: 'Temple' } } },
];

const capitalPriorityApproachTable = [
    { min: 1, max: 1, name: 'Peaceable (Strong)', description: 'An agreeable stance is taken, preferring to avoid conflict whenever possible.' },
    { min: 2, max: 4, name: 'Peaceable (Moderate)', description: 'An agreeable stance is taken unless heavily provoked.' },
    { min: 5, max: 7, name: 'Aggressive (Moderate)', description: 'A defensive stance is taken, though opportunity is provided for good faith.' },
    { min: 8, max: 8, name: 'Aggressive (Strong)', description: 'A defensive stance is taken, assuming and preparing for conflict at all times.' },
];

const capitalPrioritySuccessTable = [
    { min: 1, max: 1, name: 'Failing', description: 'The leadership has been unsuccessful in achieving anything meaningful in relation to their priority.' },
    { min: 2, max: 4, name: 'Mediocre', description: 'The leadership has made small steps in realizing its priority, achieving, perhaps, a single milestone.' },
    { min: 5, max: 14, name: 'Successful', description: 'The leadership has been successful at pursuing its priority, achieving several of its overall goals.' },
    { min: 15, max: 19, name: 'Very Successful', description: 'The leadership has made great strides at achieving its initial vision.' },
    { min: 20, max: 20, name: 'Incredibly Successful', description: 'The leadership has gone above and beyond in pursuit of its priority.' },
];

const capitalLifestyleTable = [
    { min: 1, max: 2, name: 'Humble', description: 'The leader requires only what is necessary to live and function basically.', modifiers: { residence: -6 } },
    { min: 3, max: 10, name: 'Respectable', description: 'The leader’s lifestyle is unassuming, but comfortable.', modifiers: { residence: 0 } },
    { min: 11, max: 15, name: 'Distinguished', description: 'The leader aspires to quality and high-functionality, but without concern for needless luxury.', modifiers: { residence: 0 } },
    { min: 16, max: 17, name: 'Exquisite', description: 'The leader quietly enjoys the luxuries afforded to one in their lofty position.', modifiers: { residence: 1 } },
    { min: 18, max: 19, name: 'Luxurious', description: 'The leader takes unrestrained advantage of the comforts and luxuries available.', modifiers: { residence: 2 } },
    { min: 20, max: 20, name: 'Ostentatious', description: 'The leader revels in comfort and luxury, probably to excess.', modifiers: { residence: 3 } },
];

const capitalResidenceTable = [
    { dice: 1, name: 'Modest House', description: 'Just enough to accommodate their needs.' },
    { dice: 2, name: 'Large House', description: 'Large enough to make an impression and, potentially, have some spare rooms.' },
    { dice: 3, name: 'Small Mansion', description: 'Likely has several spare rooms, as well as space for a recreational room or two.' },
    { dice: 4, name: 'Large Mansion', description: 'Likely has many spare rooms, as well as plenty of space for recreational rooms.' },
    { dice: 5, name: 'Small Estate (Inside the Capital)', description: 'Notable, and on a small amount of land.' },
    { dice: 6, name: 'Small Estate (Outside the Capital)', description: 'Notable, with generous grounds, large enough to graze livestock or ride for leisure.' },
    { dice: 7, name: 'Large Estate (Inside the Capital)', description: 'Substantial, and surrounded by modest grounds.' },
    { dice: 8, name: 'Large Estate (Outside the Capital)', description: 'Substantial, with considerable grounds large enough to graze large quantities of livestock.' },
    { dice: 9, name: 'Palace (Inside the Capital)', description: 'Grand and palatial, with a great many opulent and comfortable rooms.' },
    { dice: 10, name: 'Palace (Outside the Capital)', description: 'Grand and palatial, with a great many opulent and comfortable rooms, as well as massive amounts of land.' },
];

const capitalIntentTable = [
    { min: 1, max: 8, name: 'Genuine', description: 'The individual lives this lifestyle because they truly believe it is good/right/acceptable.' },
    { min: 9, max: 13, name: 'Positive Deception', description: 'The individual would not typically live this lifestyle, but is doing so because they believe it will have a positive impact.' },
    { min: 14, max: 18, name: 'Negative Deception', description: 'The individual would not typically live this lifestyle, but is doing so out of selfish motives.' },
    { min: 19, max: 20, name: 'Unknown Alternative', description: 'The individual is living this lifestyle because they simply do not really know how to live any other way.' },
];

const capitalSpyNetworkTable = [
    { min: 1, max: 10, name: 'None', description: 'The capital is not engaged in any intelligence gathering operations.' },
    { min: 11, max: 16, name: 'Modest', description: 'The capital has up to a few spies working outside its borders.' },
    { min: 17, max: 19, name: 'Adequate', description: 'The capital has up to a dozen spies working outside its borders.' },
    { min: 20, max: 20, name: 'Ample', description: 'The capital has over a dozen spies working outside its borders.' }
];

const capitalInfiltrationDepthTable = [
    { min: 1, max: 10, name: 'General', description: 'Gathering general intelligence involving identification of key places, figures, routines and infrastructure.' },
    { min: 11, max: 15, name: 'Deep', description: 'Ingratiating selves with individual targets, monitoring and noting relationships and actively guarded information.' },
    { min: 16, max: 19, name: 'Immersed', description: 'Establishing and building deeper connections with key figures.' },
    { min: 20, max: 20, name: 'Embroiled', description: 'Deep cover into the heart of the target’s operations, gaining the highest levels of trust.' }
];

const capitalCounterintelligenceTable = [
    { min: 1, max: 10, name: 'None', description: 'The capital does not have counterintelligence operatives working within its borders.' },
    { min: 11, max: 16, name: 'Modest', description: 'The capital has up to a few operatives working within its borders.' },
    { min: 17, max: 19, name: 'Adequate', description: 'The capital has up to a dozen operatives working within its borders.' },
    { min: 20, max: 20, name: 'Ample', description: 'The capital has over a dozen operatives working within its borders.' }
];

const capitalCounterintelligenceWatchfulnessTable = [
    { min: 1, max: 10, name: 'Passing', description: 'Obvious threats to the capital are found and dealt with. Threats with any serious degree of subtlety go undetected.' },
    { min: 11, max: 15, name: 'Wary', description: 'Efforts are diligent and concerted, though not taken to extreme. Moderate efforts at secrecy are often caught and dealt with.' },
    { min: 16, max: 19, name: 'Vigilant', description: 'Pursuit of threats is ongoing and thorough. Skilled efforts at secrecy are often caught and dealt with.' },
    { min: 20, max: 20, name: 'Paranoid', description: 'Caution could not be higher. All potential threats are taken seriously and investigated with utmost dedication.' }
];

const capitalNotableVisitorCountTable = [
    { dice: 1, name: 'One', value: 1 },
    { dice: 2, name: 'Two', value: 2 },
    { dice: 3, name: 'Three', value: 3 },
    { dice: 4, name: 'Four', value: 4 }
];

const capitalVisitorRoleTable = [
    { dice: 1, name: 'Escaped Prisoner' },
    { dice: 2, name: 'Ambassador' },
    { dice: 3, name: 'Banker' },
    { dice: 4, name: 'Ruler’s Child' },
    { dice: 5, name: 'Ruler’s Spouse' },
    { dice: 6, name: 'Ruler' },
    { dice: 7, name: 'Explorer' },
    { dice: 8, name: 'Assassin' },
    { dice: 9, name: 'Famed Craftsperson' },
    { dice: 10, name: 'Priest or Priestess' },
    { dice: 11, name: 'Adventurer' },
    { dice: 12, name: 'Scribe' },
    { dice: 13, name: 'Bard/Storyteller' },
    { dice: 14, name: 'Military Commander' },
    { dice: 15, name: 'Soldier' },
    { dice: 16, name: 'Messenger' },
    { dice: 17, name: 'Spy' },
    { dice: 18, name: 'Sentient Small Monster' },
    { dice: 19, name: 'Sentient Large Monster' },
    { dice: 20, name: 'Otherworldly Being' }
];

const capitalVisitorReasonTable = [
    { dice: 1, name: 'Escape', description: 'They are trying to get away from something.' },
    { dice: 2, name: 'Diplomacy', description: 'They are here to negotiate some kind of agreement.' },
    { dice: 3, name: 'Looking for Fun', description: 'They came here to enjoy themselves.' },
    { dice: 4, name: 'An Important Meeting', description: 'They are here for a critical meeting with an individual or group.' },
    { dice: 5, name: 'Grudge', description: 'They are here looking to settle a score.' },
    { dice: 6, name: 'Tricked', description: 'They wound up here after being deceived.' },
    { dice: 7, name: 'Visiting an Old Friend', description: 'They are in the capital to meet with someone they haven’t seen in a long time.' },
    { dice: 8, name: 'In Need of Help', description: 'They are beset by a problem and have come here looking for aid.' },
    { dice: 9, name: 'Lost', description: 'They wound up here trying to find their way somewhere else.' },
    { dice: 10, name: 'Took Wrong Transportation', description: 'They wound up here thinking they were traveling to another location. They’re now lost.' },
    { dice: 11, name: 'Angry', description: 'They’re upset about something, and are looking to deal with it.' },
    { dice: 12, name: 'Interesting Place', description: 'Word of a noteworthy place reached them, and they mean to see it.' },
    { dice: 13, name: 'Seeking Advice', description: 'They are here to gain understanding about an issue that has been affecting them.' },
    { dice: 14, name: 'Following Prophecy', description: 'They are here because they feel they were meant to be.' },
    { dice: 15, name: 'Had a Vision', description: 'They saw something in a dream that involved coming here.' },
    { dice: 16, name: 'Lost a Bet', description: 'The visitor is here for some particular, unpleasant reason as the losing penalty of a wager.' },
    { dice: 17, name: 'Doing a Favor', description: 'A friend or loved one asked them to come here and resolve some kind of business.' },
    { dice: 18, name: 'Collecting a Debt', description: 'Someone owes the visitor (or someone connected to them), and it’s time to collect.' },
    { dice: 19, name: 'Looking for a Change', description: 'They are here because they want to change something significant in their life.' },
    { dice: 20, name: 'On the Hunt', description: 'They are in pursuit of someone or something.' }
];

// --- MILITARY TABLES (Keep these from previous step) ---
const capitalMilitaryForceTable = [
    { min: 1, max: 2, name: 'No', description: 'The capital does not employ its own military force.', hasMilitary: false },
    { min: 3, max: 6, name: 'Yes', description: 'The capital has some kind of military force.', hasMilitary: true }
];

const capitalMilitaryStandingTable = [
    { min: 1, max: 3, name: 'Disbanded', description: 'When the military is not on active campaign, it disbands.' },
    { min: 4, max: 6, name: 'Standing', description: 'The capital’s military is ever at the ready and active.' }
];

const capitalMilitaryRecruitmentTable = [
    { dice: 1, name: 'Mercenary', description: 'The force is bought and paid for until such time as their contract ends.' },
    { dice: 2, name: 'Mandatory', description: 'Law states all able-bodied citizens must spend a certain amount of time serving.' },
    { dice: 3, name: 'Volunteer', description: 'Forces are made up of individuals who joined up willingly.' },
    { dice: 4, name: 'Hand-Picked', description: 'The capital hand picks individuals from its populace, based on certain criteria.' },
    { dice: 5, name: 'Criminals', description: 'Convicts are enlisted, either as a compulsory part of their sentence or voluntarily.' },
    { dice: 6, name: 'Conscripted', description: 'Troops are levied from regions owing fealty to the capital.' }
];

const capitalMilitarySizeTable = [
    { min: 1, max: 4, name: 'Insignificant', description: 'The force’s size is extremely small, likely requiring few commanding officers.' },
    { min: 5, max: 10, name: 'Modest', description: 'The force’s size is respectable, but not what anyone would call large.' },
    { min: 11, max: 16, name: 'Strong', description: 'The force’s size is large, and likely solid enough to consider going into battle.' },
    { min: 17, max: 19, name: 'Grand', description: 'The force’s size is considerable. As massing these kinds of numbers is uncommon, it would likely have a numerical advantage.' },
    { min: 20, max: 20, name: 'Vast', description: 'The force’s size is staggering and awe-inspiring.' }
];

const capitalMilitarySpecializationTable = [
    { min: 1, max: 9, name: 'None', description: 'No specific specialization.' },
    { min: 10, max: 10, name: 'Mounted', description: 'A section of the military force is most effective while riding.' },
    { min: 11, max: 11, name: 'Engineering', description: 'A section uses knowledge of materials and structure to exploit enemy weaknesses.' },
    { min: 12, max: 12, name: 'Berserker', description: 'A section is made up of warriors that hurl themselves fearlessly into the fray.' },
    { min: 13, max: 13, name: 'Covert', description: 'A section is trained in subtlety, going behind enemy lines.' },
    { min: 14, max: 14, name: 'Theatrics', description: 'A section uses display to distract enemy attention and sow chaos.' },
    { min: 15, max: 15, name: 'Magical', description: 'A section is made up of magic-users, or arcane specialists.' },
    { min: 16, max: 16, name: 'Biological', description: 'A section has expert knowledge of diseases and chemicals.' },
    { min: 17, max: 17, name: 'Calculation', description: 'A section of experts at analysis and coordination.' },
    { min: 18, max: 18, name: 'Unconventional', description: 'A section employs unorthodox thinking and methods.' },
    { min: 19, max: 19, name: 'Transport-Based', description: 'A section is trained in warfare from a particular type of craft.' },
    { min: 20, max: 20, name: 'Defensive', description: 'A section is weighted towards strong defense as the best offense.' }
];

const capitalMilitaryFacilitiesTable = [
    { dice: 1, name: 'Temporary Shelters Outside the Capital', description: 'Tents and few, quickly-built minimal structures.' },
    { dice: 2, name: 'Simple Structures Outside the Capital', description: 'Bunkhouses for troops, and quarters for officers.' },
    { dice: 3, name: 'Moderate Structures Outside the Capital', description: 'Barracks for the troops, and separate structures for officers. Training grounds equipped with light walls.' },
    { dice: 4, name: 'Simple Structures Inside the Capital', description: 'Barracks facilities for the troops, and quarters for officers.' },
    { dice: 5, name: 'Moderate Structures Inside the Capital', description: 'Well-equipped and outfitted barracks facilities. Training grounds are well-maintained.' },
    { dice: 6, name: 'Robust Structures Inside the Capital', description: 'Extremely well-equipped and outfitted barracks facilities. Training grounds are expansive.' }
];

// --- NOBILITY TABLES ---

const capitalNobilityTypeTable = [
    { dice: 1, name: 'Egalitarian', description: 'The nobility is comprised of self-made people. Theoretically, anyone could attain this degree of nobility.' },
    { dice: 2, name: 'Blood', description: 'Title and status are hereditary, passed down by birth or through marriage.' },
    { dice: 3, name: 'Deeds', description: 'Status is granted in relation to deeds accomplished, or values displayed.' },
    { dice: 4, name: 'Wealth/Possessions', description: 'Those granted noble status are the wealthiest citizens.', modifiers: { populationWealth: 2 } }
];

const capitalNobilityRelationTable = [
    { min: 1, max: 1, name: 'Rancorous', description: 'The nobility openly loathe and revile the leadership with impunity.' },
    { min: 2, max: 3, name: 'Opposed', description: 'The nobility are in contention with the current leadership, making the job of ruling even more difficult.' },
    { min: 4, max: 6, name: 'Disliked', description: 'The nobility are not fond of the leadership, but have yet to truly cause a problem.' },
    { min: 7, max: 9, name: 'Tolerated', description: 'The nobility put up with the leadership, at least for the moment.' },
    { min: 10, max: 14, name: 'Liked', description: 'The nobility like the leadership well enough; some may even be friends.' },
    { min: 15, max: 17, name: 'Supported', description: 'The nobility support what the leadership is doing, and generally agree with their goals and priorities.' },
    { min: 18, max: 19, name: 'Defended', description: 'The nobility not only support the leadership, but actively seek to subdue any who would challenge them.' },
    { min: 20, max: 20, name: 'Loved', description: 'The nobility are devoted to the leadership, and stand ever-ready to do their bidding.' }
];

const capitalNobleCountTable = [
    { min: 1, max: 1, name: '2 Nobles', value: 2 },
    { min: 2, max: 3, name: '3 Nobles', value: 3 },
    { min: 4, max: 6, name: '4 Nobles', value: 4 },
    { min: 7, max: 10, name: '5 Nobles', value: 5 },
    { min: 11, max: 14, name: '6 Nobles', value: 6 },
    { min: 15, max: 17, name: '7 Nobles', value: 7 },
    { min: 18, max: 19, name: '8 Nobles', value: 8 },
    { min: 20, max: 20, name: '9 Nobles', value: 9 }
];

export {
    // ... [Previous exports] ...
    capitalOriginsTable,
    capitalAgeTable,
    capitalSizeTable,
    outsideTheCapitalCountData,
    outsideTheCapitalTable,
    capitalStewardshipTable,
    capitalGeneralConditionTable,
    capitalFortificationTable,
    capitalMarketSquareTable,
    capitalVendorStallAcquisitionTable,
    capitalMerchantOverflowTable,
    capitalUndergroundPassagesTable,
    capitalLeadershipTable,
    capitalUnityTable,
    capitalPriorityTable,
    capitalPriorityApproachTable,
    capitalPrioritySuccessTable,
    capitalLifestyleTable,
    capitalResidenceTable,
    capitalIntentTable,
    capitalSpyNetworkTable,
    capitalInfiltrationDepthTable,
    capitalCounterintelligenceTable,
    capitalCounterintelligenceWatchfulnessTable,
    capitalNotableVisitorCountTable,
    capitalVisitorRoleTable,
    capitalVisitorReasonTable,
    capitalMilitaryForceTable,
    capitalMilitaryStandingTable,
    capitalMilitaryRecruitmentTable,
    capitalMilitarySizeTable,
    capitalMilitarySpecializationTable,
    capitalMilitaryFacilitiesTable,
    // --- NEW EXPORTS ---
    capitalNobilityTypeTable,
    capitalNobilityRelationTable,
    capitalNobleCountTable
};