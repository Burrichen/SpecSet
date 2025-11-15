// town.js

// This file contains data tables specific to the Town settlement type.

const townOriginsTable = [
  { dice: 1, name: 'Accidental', description: 'The town was never meant to be anything more than a camp or minor settlement, at most. Fate saw to it that things happened differently. Outsiders found the place, some stayed, some left and told others and, over time, more and more came, more and more stayed, and the place grew.' },
  { dice: 2, name: 'Decree', description: 'It was decided by some authority that a town was needed here, funds and materials were set aside for its founding, and it was established.' },
  { dice: 3, name: 'Exodus or Exile', description: 'A group of settlers left (or were forced to leave) their home. They found this place and decided to build.' },
  { dice: 4, name: 'Key Crossroads', description: 'The town was established on a crossroads frequented by travelers from all over.' },
  { dice: 5, name: 'Military Camp', description: 'A deployment wound up lasting longer than anticipated, so the camp began building more solid fortifications in an increasingly permanent fashion. Either the original members of the encampment still reside here, or it was otherwise occupied after they departed.' },
  { dice: 6, name: 'Port', description: 'The town established itself on the water where none had done so previously, sprouting worn piers and roads taken by merchants and travelers alike. (The environment your port is in is [d6]: 1-3: coastal, 4-6: river.)' },
  { dice: 7, name: 'Rapid', description: 'Fueled by ambition, strong will and, perhaps, access to certain excellent products or resources, a group of people set their minds to creating this town in an important location. Witnesses express how it almost seemed to spring up overnight.' },
  { dice: 8, name: 'Steady', description: 'Built piece by piece over time, this town was a labor of commitment and devotion. It may have taken years, or even decades, until it reached fruition, but now it stands, such as it is.' },
];

const magicShopSubTable = [
    { dice: 1, name: 'Magic Shop - Armor' },
    { dice: 2, name: 'Magic Shop - Books' },
    { dice: 3, name: 'Magic Shop - Clothing' },
    { dice: 4, name: 'Magic Shop - Jewelry' },
    { dice: 5, name: 'Magic Shop - Weapons' },
    { dice: 6, name: 'Magic Shop - Misc. & Curiosities' },
];

const industrySubTable = [
    { min: 1, max: 2, name: 'Mill' },
    { min: 3, max: 4, name: 'Textile Production' },
    { min: 5, max: 6, name: 'Foundry/Smelting' },
];

const townPriorityTable = [
    { dice: 1, name: 'Military', description: 'The town prioritizes defenses and law enforcement.', modifiers: { fortification: 1, lawEnforcement: 1 } },
    { dice: 2, name: 'Government', description: 'The town prioritizes structure, and law.', modifiers: { lawEnforcement: 1 }, rules: { leadership: { rerollRange: [91, 100] } }, freeLocation: { category: 'Non-Commercial', name: 'Place of Government' } },
    { dice: 3, name: 'Production', description: 'The town prioritizes generation and movement of resources.', rules: { specialty: { diceOverride: 4 } } },
    { dice: 4, name: 'Economic', description: 'The town prioritizes their market, ensuring a large area, wide streets, more shops, and lodging.', modifiers: { marketSquare: 2 }, rules: { commercialLocations: { sizeCategoryIncrease: 1 } } },
    { dice: 5, name: 'Religious', description: 'The town contains substantial temples in prominent locations.', modifiers: { placeOfWorshipSize: 5 }, freeLocation: { category: 'Non-Commercial', name: 'Place of Worship' } },
    { dice: 6, name: 'Magic', description: 'The town is focused on some form of magical pursuit.', freeLocation: { category: 'Shop', subTable: magicShopSubTable } },
];

const townSpecialtyTable = [
    { dice: 1, name: 'Craft', description: 'The town is known for being a place to find high-quality, hand-crafted goods.' },
    { dice: 2, name: 'Farming or Resource Gathering', description: 'The town is known for the resource(s) it produces. Base this on what kind of environment and climate the town is in. If farming wouldn\'t work as well, perhaps they mine or harvest lumber instead.', modifiers: { farmsAndResources: 1 }, rules: { farmsAndResources: { rerollRange: [1, 8] } } },
    { dice: 3, name: 'Industry', description: 'This town is known for certain industrial processes such as milling, textiles, or smelting.', freeLocation: { category: 'Shop', subTable: industrySubTable } },
    { dice: 4, name: 'Unique Shipping Methods', description: 'These people know how to get things from one place to another by strange or innovative means.' },
    { dice: 5, name: 'Connections', description: 'This town is full of people who can find and obtain almost anything (or, perhaps, anyone).' },
    { dice: 6, name: 'Drink', description: 'The town is known for having a wide variety of (or excellent quality) beverages available throughout.' },
    { dice: 7, name: 'Education', description: 'The town is known as the location of a widely-renowned educational institution.', freeLocation: { category: 'Non-Commercial', name: 'Place of Education' } },
    { dice: 8, name: 'Hospitality', description: 'The town is known as a welcoming, desirable place to stay.', rules: { defaultInnQuality: { roll: 'd6', map: { '1-3': 'good', '4-6': 'fine' } } } },
];

const townAgeTable = [
    { min: 1, max: 2, name: 'Recent', description: 'Established within the past year, the town has not been around long. Awareness has likely not spread beyond the immediate surrounding area.', modifiers: { populationDensity: -2 } },
    { min: 3, max: 4, name: 'Established', description: 'The town has been around for a few years. Folk within a few dozen miles may have heard of it. It has most likely been added to major official maps.', modifiers: { populationDensity: -1 } },
    { min: 5, max: 6, name: 'Mature', description: 'The town has been around for decades, and may have developed some sort of reputation, depending on its community, location, and what goes on in the town.', modifiers: { populationDensity: 0 } },
    { min: 7, max: 8, name: 'Old', description: 'The town has been around near enough to a century, or so. Families have grown up here. Some businesses have grown, folded, and been replaced by new ones. Features have likely been added, or it may have expanded outwards. It may also have seen through many events that could have altered the town\'s course.', modifiers: { populationDensity: 1 } },
    { min: 9, max: 10, name: 'Ancient', description: 'The town is hundreds of years old, or more. It may still be thriving, or in ruins, remaining much like it has always been, or may have drastically changed, for better or worse.', modifiers: { populationDensity: 2 } },
];

const townSizeTable = [
    { min: 1, max: 2, name: 'Very Small', description: 'Up to a few hundred standing structures in an area able to support up to around 1000 people.', modifiers: { populationOverflow: 2 } },
    { min: 3, max: 6, name: 'Small', description: 'Up to 500 standing structures in an area able to support around 2000 people.', modifiers: { populationOverflow: 1 } },
    { min: 7, max: 14, name: 'Medium', description: 'Up to 1000 standing structures in an area able to support around 4000 people.', modifiers: { populationOverflow: 0 } },
    { min: 15, max: 18, name: 'Large', description: 'Up to 1500 standing structures in an area able to support around 6000 people.', modifiers: { populationOverflow: -1 } },
    { min: 19, max: 20, name: 'Very Large', description: 'Up to 2000 standing structures in an area able to support around 8000 people.', modifiers: { populationOverflow: -2 } },
];

const townConditionTable = [
    { min: 1, max: 1, name: 'Derelict', description: 'Buildings may be coming down, or in ruins. Refuse may line the streets, which, if they were ever maintained to begin with, are nigh unrecognizable now. Everything seems broken, filthy, or both. This place might benefit from complete destruction and a re-build. The smells are, likely, vile.', modifiers: { populationWealth: -6 } },
    { min: 2, max: 4, name: 'Lousy', description: 'Things are in rough shape. Most structures seem unsound, or are just in poor condition. Windows, if there are any, may be broken or boarded up. Walls are stained, and streets are rutted or cracked. The smells are an affront to the senses.', modifiers: { populationWealth: -3 } },
    { min: 5, max: 12, name: 'Moderate', description: 'Structures seem sound enough though are, perhaps, not attractive. It is likely that most homes keep occupants dry. Roads are relatively clear, if not clean. The smells are not pleasant, but tolerable.', modifiers: { populationWealth: 0 } },
    { min: 13, max: 19, name: 'Robust', description: 'Buildings in the town appear solid. Beams protruding from structure walls look to be sturdy and hard-wearing. While possibly lacking in true refinement, the town bears a strength and sense of reliability. Roads are maintained, though not obsessed over, and are largely free of refuse and filth. The smells are those of smoke and sawdust, leather and sweat.', modifiers: { populationWealth: 3 } },
    { min: 20, max: 20, name: 'Superb', description: 'The town is exemplary in all aspects. The buildings are built with exquisite skill and flair, leaving no doubt as to their quality. The roads are immaculately kept, with little to no detritus anywhere. The smells are those of fresh air and flowers, grass and trees, or cool sea mist.', modifiers: { populationWealth: 6 } },
];

const townProsperityTable = [
    { min: 1, max: 1, name: 'Abysmal Failure', description: 'The town has had little to no business, or has been very unfortunate.', modifiers: { visitorTraffic: -8, populationWealth: -13 } },
    { min: 2, max: 4, name: 'Failure', description: 'The town has struggled to generate meaningful wealth or notoriety.', modifiers: { visitorTraffic: -6, populationWealth: -6 } },
    { min: 5, max: 10, name: 'Mildly Successful', description: 'The town has attained a mild degree of success and visibility.', modifiers: { visitorTraffic: -1, populationWealth: -3 } },
    { min: 11, max: 16, name: 'Successful', description: 'The town is functional and generates a modest to good amount of coin.', modifiers: { visitorTraffic: 0, populationWealth: 0 } },
    { min: 17, max: 19, name: 'Very Successful', description: 'The town has achieved real financial success and attracts a large number of visitors.', modifiers: { visitorTraffic: 2, populationWealth: 3 } },
    { min: 20, max: 20, name: 'Incredibly Successful', description: 'The town attracts huge amounts of wealth for its citizens and visitors flock to be part of it.', modifiers: { visitorTraffic: 6, populationWealth: 6 } },
];

const marketSquareTable = [
    { min: 1, max: 2, name: 'Tight', description: 'Only room for a few, key vendor stalls.' },
    { min: 3, max: 4, name: 'Ample', description: 'Room for a fair number of vendor stalls.' },
    { min: 5, max: 6, name: 'Spacious', description: 'Room for lots of vendor stalls.' },
];

const vendorStallAcquisitionTable = [
    { dice: 1, name: 'First Come, First Served - No Fee', description: 'Merchants line up prior to market day. Those at the front of the line are given the spaces. No fees are charged.' },
    { dice: 2, name: 'First Come, First Served - Fee', description: 'Merchants line up prior to market day. Those at the front of the line are given first pick of the available stall spaces, provided they can pay the fee for the day.' },
    { dice: 3, name: 'Lease', description: 'Merchants pay in advance (sometimes far in advance) for the right to a space in the market square.' },
    { dice: 4, name: 'Bid', description: 'Prior to market day, the spaces are auctioned off.' },
];

const overflowTable = [
    { dice: 1, name: 'Banned', description: 'Excess vendors are not allowed to set up stalls outside the town. Town guards will enforce this.', modifiers: { lawEnforcement: 1 } },
    { dice: 2, name: 'Unpatrolled', description: 'Excess vendors are allowed to set up stalls but, as the town guard do not patrol or monitor these areas, the risk is higher. The spaces available are unkempt.' },
    { dice: 3, name: 'Monitored', description: 'Excess vendors are allowed to set up stalls, and the town guard patrols through regularly, but the areas themselves are less-maintained and traffic is lighter.' },
    { dice: 4, name: 'Encouraged', description: 'Excess vendors are encouraged to set up stalls outside the town, if they are unable to get a spot in the square. There are maintained areas available for use, and provided on a first-come, first-served basis. When in use by vendors, this area is regularly patrolled, if law enforcement personnel can be spared.' },
];

const fortificationTable = [
    { min: 1, max: 1, name: 'Unfortified', description: 'The town\'s perimeter is open, allowing entry from almost any point.', modifiers: { disposition: -5 } },
    { min: 2, max: 8, name: 'Lightly Fortified', description: 'The town proper is surrounded by a light wall of wood or stacked stone. The fortifications pose only a mild inconvenience to outside forces, but they easily keep out wild animals.', modifiers: { disposition: 1 } },
    { min: 9, max: 15, name: 'Fortified', description: 'The town proper is surrounded by a substantial wall of wood or stone. The wall is able to be patrolled by guards on a raised walkway. Visitors to the city pass through a main gate that can be barred in the evenings. A few watch towers may be placed around the town, though they are likely sporadic.', modifiers: { disposition: 3 } },
    { min: 16, max: 19, name: 'Heavily Fortified', description: 'The town proper is surrounded by a heavy wall of wood or stone, with several watchtowers built along its length. The gate is double-thickness and reinforced with metal bands. There are additional watchtowers at various points throughout the surrounding countryside.', modifiers: { disposition: 5 } },
    { min: 20, max: 20, name: 'Extremely Fortified', description: 'The town proper is surrounded by an imposing wall of wood or stone, with many fully-staffed watchtowers at regular intervals along its length. The gate is double-thickness, reinforced with metal bands, augmented with a portcullis, and is always manned. A supplementary wall of wood or stone encompasses the surrounding countryside, with its own watchtowers. Nothing goes in or out without the watch\'s knowledge or permission.', modifiers: { disposition: 7 } },
];

const townPopulationDensityTable = [
    { min: 1, max: 2, name: 'Skeleton', description: 'The town only has enough people to function at its most basic level.', modifiers: { populationOverflow: -2, nightActivity: -2 } },
    { min: 3, max: 6, name: 'Sparse', description: 'Folk live here, but it would never be called bustling. Walking down the street, you\'ll typically only see a few people.', modifiers: { populationOverflow: -1, nightActivity: -1 } },
    { min: 7, max: 14, name: 'Populous', description: 'A moderate amount of people live here. Walking through the streets, you will see plenty of people, but never so many that it would feel cramped.', modifiers: { populationOverflow: 0, nightActivity: 0 } },
    { min: 15, max: 18, name: 'Dense', description: 'There is a large amount of people living here. There are few, if any, vacant buildings. In high traffic areas, one generally has elbow room, but not much more.', modifiers: { populationOverflow: 1, nightActivity: 1 } },
    { min: 19, max: 20, name: 'Crowded', description: 'The town is filled with jostling throngs. Practically all structures are occupied. Some may even camp outside town. Moving about can be difficult, and bumping into other people is typical in higher traffic areas.', modifiers: { populationOverflow: 2, nightActivity: 2 } },
];

const populationOverflowTable = [
    { min: 1, max: 1, name: '<10%', description: 'Less than a tenth of the town\'s population is outside the town proper. This typically means that the only people who live outside the town are those that do so out of necessity, due to requirement of duties (such as owning a farm).' },
    { min: 2, max: 4, name: '10%', description: 'A tenth of the town\'s population is outside the town proper.' },
    { min: 5, max: 12, name: '20%', description: 'A fifth of the town\'s population is outside the town proper.' },
    { min: 13, max: 17, name: '30%', description: 'A third of the town\'s population is outside the town proper.' },
    { min: 18, max: 19, name: '40%', description: 'Just under half the town\'s population is outside the town proper.' },
    { min: 20, max: 20, name: '50%', description: 'Around half the town\'s population is outside the town proper.' },
];

const farmsAndResourcesCountData = {
    'Very Small': 1,
    'Small': 2,
    'Medium': 2,
    'Large': 3,
    'Very Large': 3,
};

const farmsAndResourcesTable = [
    { min: 1, max: 4, name: 'None', description: 'If you have any remaining rolls to make on this table, proceed with them.' },
    { min: 5, max: 11, name: 'Farming [Agriculture]', description: 'A group of farms, which provide food, are found on the nearest hospitable land under the town\'s control.' },
    { min: 12, max: 16, name: 'Farming [Livestock]', description: 'A group of farms, which provide livestock, are found on the nearest hospitable land under the town\'s control.' },
    { min: 17, max: 20, name: 'Resource Harvesting', description: 'Depending on the landscape and available resources (trees, minerals, ore, stone, etc.), a logging camp, mine, or quarry belonging to the town has been built nearby to harvest resources for use or sale.' },
];

const townVisitorTrafficTable = [
    { min: 1, max: 3, name: 'Mostly Locals', description: 'On any given day, there are typically a few from out-of-town, though not enough to impact congestion.', modifiers: { nightActivity: 0 } },
    { min: 4, max: 9, name: 'Groups', description: 'There are generally a fair amount of visitors. May slightly increase congestion.', modifiers: { nightActivity: 1 } },
    { min: 10, max: 14, name: 'Crowds', description: 'A noticeable amount of people come through town on a regular basis. Congestion is increased.', modifiers: { nightActivity: 2 } },
    { min: 15, max: 17, name: 'Droves', description: 'Large groups of people regularly frequent the town. Congestion is significantly increased.', modifiers: { nightActivity: 3 } },
    { min: 18, max: 19, name: 'Masses', description: 'Huge groups of people always seem to be visiting. Congestion could cause difficulties, if the town is unable to cope with very large amounts of people.', modifiers: { nightActivity: 4 } },
    { min: 20, max: 20, name: 'Multitudes', description: 'Massive groups of people throng the streets, likely spilling out onto the roads outside town. Congestion is an ever-present reality, and a regular issue.', modifiers: { nightActivity: 5 } },
];

const nightActivityTable = [
    { min: 1, max: 2, name: 'Dark', description: 'By the time the sun goes down, the streets are nearly empty and the town closes up. All is quiet and peaceful. If the town has a gate, it is closed and barred. Guards may, or may not, allow night travelers inside.' },
    { min: 3, max: 6, name: 'Quiet', description: 'Everything is closed except for inns and taverns, which remain open until midnight. Late guests would have to wake an innkeeper to get a room. If the town has a gate, it is closed and barred. Guards will usually let visitors in, but will discourage wandering.' },
    { min: 7, max: 14, name: 'Slow', description: 'Almost everything is closed except for taverns, which may be open until early morning, and inns, which stay open perpetually. If the town has a gate, it is closed, but guards will generally be ready to open it, as needed.' },
    { min: 15, max: 18, name: 'Active', description: 'Inns and taverns remain open perpetually. Some shops and services may be open, catering to late travelers or night owls. A fair amount of establishments may still be closed. If the town has a gate, it is kept open, but guarded, ready to be closed, if needed.' },
    { min: 19, max: 20, name: 'Lively', description: 'There is little difference between day and night traffic. There are always people on the streets and it may seem like no one ever sleeps. Most shops and services remain open constantly. If the town has a gate, it remains open and is only closed under the most dire of circumstances.' },
];

const townLeadershipTable = [
    { min: 1, max: 15, name: 'Town Council', description: 'Prominent members of the community were chosen to lead the town collectively.', freeLocation: { category: 'Non-Commercial', name: 'Town Hall' } },
    { min: 16, max: 30, name: 'Mayor', description: 'The locals democratically voted for their current leader.' },
    { min: 31, max: 45, name: 'Hereditary', description: 'A non-elected leader is in power, by virtue of their bloodline.' },
    { min: 46, max: 60, name: 'Merchant Monarch', description: 'The wealthiest shop owner in the town leads by default.', modifiers: { commercialLocations: 2 } },
    { min: 61, max: 75, name: 'Military Rule', description: 'The town is controlled by a current or ex-leader of a military group.', modifiers: { lawEnforcement: 1 } },
    { min: 76, max: 90, name: 'Oligarchy', description: 'A few individuals hold sway, collectively, over the town.', subTable: 'oligarchy' },
    { min: 91, max: 99, name: 'Underworld or Criminal Enterprise', description: 'A criminal, or group of criminals, either publicly, or privately, controls the town.', modifiers: { crime: -1 } },
    { min: 100, max: 100, name: 'Anarcho-Syndicalist Commune', description: 'The members of the town take turns as a sort of executive officer for the week.' },
];

const townLawEnforcementTable = [
    { min: 1, max: 1, name: 'None', description: 'This could be good or bad, depending on one\'s point of view. Good if the folk here are trustworthy, but bad if a situation gets out of hand.', modifiers: { crime: -8 } },
    { min: 2, max: 4, name: 'Sheriff', description: 'A sheriff, as well as a handful of deputies, is sanctioned by the town\'s governing entity.', modifiers: { crime: -4 } },
    { min: 5, max: 9, name: 'Small Town Watch', description: 'The watch is run by a nominated captain, and employs a small number of guards. Presence may be scattered, or lacking, at times.', modifiers: { crime: -2 } },
    { min: 10, max: 16, name: 'Town Watch', description: 'The watch is run by an appointed captain, with one lieutenant, and enough guards, to adequately guard key points in the town with token patrols.', modifiers: { crime: 0 } },
    { min: 17, max: 19, name: 'Strong Town Watch', description: 'The watch is run by a seasoned captain with two lieutenants, a few corporals, and an ample quantity of boots on the ground. Presence allows for extra patrols and well-rested guards.', modifiers: { crime: 4 } },
    { min: 20, max: 20, name: 'Extensive Town Watch', description: 'The watch is overseen by a decorated captain with three lieutenants, several corporals and more than enough guards. Presence allows for the watch to maintain an ever-present appearance. A guard is never more than a shout away.', modifiers: { crime: 8 } },
];

const townPopulationWealthTable = [
    { min: 1, max: 2, name: 'Destitute', description: 'Nearly everyone in town consistently lacks the barest essentials of what they need to survive.', modifiers: { crime: -4, quality: -2 } },
    { min: 3, max: 6, name: 'Impoverished', description: 'Around half of the town struggles to carve out even a meager existence.', modifiers: { crime: -2, quality: -1 } },
    { min: 7, max: 14, name: 'Average', description: 'Most of the town\'s population have enough to live a modest life. Those without are a minority.', modifiers: { crime: 0, quality: 0 } },
    { min: 15, max: 17, name: 'Prosperous', description: 'The majority have enough to live a good life and, of them, a fair amount can even live comfortably.', modifiers: { crime: -1, quality: 1 } },
    { min: 18, max: 19, name: 'Wealthy', description: 'Nearly everyone has what they need to live comfortably, many are able to live well, and some are very prosperous.', modifiers: { crime: -2, quality: 2 } },
    { min: 20, max: 20, name: 'Affluent', description: 'The entire town is able to live comfortably, with a significant portion living in luxury.', modifiers: { crime: -3, quality: 3 } },
];

const townCrimeTable = [
    { min: 1, max: 2, name: 'Regular', description: 'The streets are crawling with criminals, and a purse unstowed is almost sure to be snatched.', modifiers: { urbanEncounter: 4 } },
    { min: 3, max: 6, name: 'Common', description: 'Most are used to hearing about trouble every day or two. Everyone knows someone who\'s been a victim of crime.', modifiers: { urbanEncounter: 3 } },
    { min: 7, max: 14, name: 'Average', description: 'Theft or mild violence can happen from time to time. Best to keep an eye out.', modifiers: { urbanEncounter: 2 } },
    { min: 15, max: 18, name: 'Uncommon', description: 'Crime does not occur often but, when it does, it is a noteworthy occurrence.', modifiers: { urbanEncounter: 1 } },
    { min: 19, max: 20, name: 'Rare', description: 'Most in the town have had no personal experience of crime in the town, and know few people that have.', modifiers: { urbanEncounter: 0 } },
];

const nonCommercialCountData = {
    'Very Small': 1,
    'Small': 2,
    'Medium': 3,
    'Large': 4,
    'Very Large': 5,
};

const nonCommercialLocationTypeTable = [
    { dice: 1, name: 'Place of Education' },
    { dice: 2, name: 'Place of Gathering' },
    { dice: 3, name: 'Place of Government' },
    { dice: 4, name: 'Place of Worship' },
];

const placesOfEducationTable = [
    { dice: 1, name: 'Academy/University', description: 'A conservatory devoted to the pursuit of higher knowledge, sometimes of a specific area of study.' },
    { dice: 2, name: 'Archives/Library', description: 'A structure devoted to housing records and written information.' },
    { dice: 3, name: 'Forum', description: 'A place designated for the use of intellectual debate and discussion.' },
    { dice: 4, name: 'Schoolhouse', description: 'An institution focused on educating children.' },
];

const townPlacesOfGatheringTable = [
    { dice: 1, name: 'Amphitheater', description: 'Outdoor space with a stage and tiered seating.' },
    { dice: 2, name: 'Dance Hall', description: 'Location for dances and festive events.' },
    { dice: 3, name: 'Gathering Hall', description: 'General, open-use building, such as a community center, used for local activities, or where locals may simply socialize on a day-to-day basis.' },
    { dice: 4, name: 'Outdoor Recreational Area', description: 'A tended space where locals might eat, take leisure time, or duel to the death...' },
];

const placesOfGovernmentTable = [
    { dice: 1, name: 'Chancery', description: 'Used as an office for official documentation and administrative tasks.' },
    { dice: 2, name: 'Courthouse', description: 'Used to hold trials or dispense justice.' },
    { dice: 3, name: 'Town Hall', description: 'Used for official town business, audiences, and meetings.' },
    { dice: 4, name: 'Treasury', description: 'Used as a centralised place to manage the town\'s funds.' },
];

const townPlaceOfWorshipSizeTable = [
    { min: 1, max: 1, name: 'Secret', description: 'The place of worship\'s size is unclear, as the location is not publicly known.' },
    { min: 2, max: 5, name: 'Altar', description: 'A small shrine or, perhaps, a tiny shack, usually evincing some various items or images relating to that which the faith venerates.' },
    { min: 6, max: 10, name: 'Oratory', description: 'A modest building with seating for attendees, appointed with various items or images relating to that which the faith venerates.' },
    { min: 11, max: 16, name: 'Sanctuary', description: 'A large, well-appointed structure, able to comfortably accommodate up to a few hundred people.' },
    { min: 17, max: 19, name: 'Temple', description: 'A grand building, replete with elements like high ceilings, plush furnishings, and other impressive ornamental and/or architectural features. It can hold nearly a thousand attendees.' },
    { min: 20, max: 20, name: 'Great Temple', description: 'An awe-inspiring structure, devoted to that which it venerates. No expense was spared in its construction. It might display such elements as stunning frescos, elaborate stained-glass scenes, and towering, gilded statues. Walking into a great temple is a rare and striking experience for those who do not live near one.' },
];

const townFervencyTable = [
    { min: 1, max: 1, name: 'Unseen', description: 'To those outside the following, it is not clear that the group exists.' },
    { min: 2, max: 5, name: 'Quiet', description: 'Adherents to the faith are inconspicuous, unless one knows what to look for (perhaps particular gestures, items of clothing, or phrases).' },
    { min: 6, max: 10, name: 'Subtle', description: 'Followers of the faith may be identifiable, but remain very reserved.' },
    { min: 11, max: 16, name: 'Moderate', description: 'The pious are confident and unafraid to display their faith openly, but do not encroach upon the wider populus uncalled for.' },
    { min: 17, max: 19, name: 'Fervent', description: 'Followers are outspoken, with little or no fear of reproach. They may sing or speak to the masses.' },
    { min: 20, max: 20, name: 'Zealous', description: 'Adherents are utterly and unthinkingly devout, forcing their doctrine upon their surroundings and peers, or taking actions that further their cause regardless of personal cost. Though typically seen as negative, this could also be a positive, such as a church of light rising up in an evil kingdom, helping those in need, even if it puts themselves in peril.' },
];

const alignmentOfTheFaithTable = [
    { min: 1, max: 1, name: 'Evil' },
    { min: 2, max: 5, name: 'Neutral' },
    { min: 6, max: 10, name: 'Good' },
];

const commercialCountData = {
    'Very Small': 4,
    'Small': 6,
    'Medium': 8,
    'Large': 10,
    'Very Large': 12,
};

const shopOrServiceTable = [
    { min: 1, max: 3, name: 'Shop' },
    { min: 4, max: 6, name: 'Service' },
];

const townRecentHistoryTable = [
    { dice: 1, name: 'Defended', description: 'There was a failed attack on the town by a local force.' },
    { dice: 2, name: 'Pickpockets', description: 'Invisible, sticky hands at work? Many reports have surfaced of pickpockets in the market, but none have been found.' },
    { dice: 3, name: 'No Adventurers', description: 'Get out! A tavern in town has instituted a no-adventurer policy, after sustaining one bar fight too many.' },
    { dice: 4, name: 'Asleep', description: 'Working hard, or hardly working? One of the guards manning the main gate was found asleep at his post.' },
    { dice: 5, name: 'Spiders', description: 'One of the local children has been catching and breeding spiders. The spiders have grown very large, broken out, and have scattered all over town. Townspeople are finding them in homes, businesses... everywhere.' },
    { dice: 6, name: 'Tunnel', description: 'What\'s this then? On the outskirts, someone has discovered a tunnel leading towards town. Even stranger, it\'s incomplete; not even reaching halfway. Who has dug the tunnel? Why?' },
    { dice: 7, name: 'Obstruction', description: 'If a tree falls on the road, and no one\'s around to hear it, does it stop market day? News has reached that a massive tree, stone, or other big natural object, fell and is blocking the main route to town a few miles away.' },
    { dice: 8, name: 'Event Night', description: 'To boost town morale, the local leader has proposed ‘a night on the town,’ a sanctioned date-night for all locals where sponsored food and entertainment vendors provide deep discounts to romantic couples who visit their establishments.' },
];

const marketDayEventsTable = [
    { dice: 1, name: 'Monkeys!', description: 'A merchant selling lively, little monkeys has arrived, and whipped both the local, and visiting, children into an excited frenzy.' },
    { dice: 2, name: 'Rain', description: 'It\'s raining. Hard. Many of the vendors are fighting to get their wares covered so they remain unspoiled.' },
    { dice: 3, name: 'Half Price', description: 'Fruits and vegetables have been in easy supply recently, so are being sold at half the usual price.' },
    { dice: 4, name: 'Loose Cows', description: 'A cattle merchant\'s pen has broken, and cows now roam all over town. The merchant is trying their best to round them up.' },
    { dice: 5, name: 'Fire!', description: 'A cookfire has sparked a blaze, setting one of the stalls alight, and is now threatening to spread to neighboring tables.' },
    { dice: 6, name: 'Puppet Show', description: 'A traveling puppet show is in town, performing a political parody of some famous regional figures to rapturous applause.' },
    { dice: 7, name: 'Bandits', description: 'Bandits, posing as merchants, are stealing goods from the other, legitimate merchants nearby.' },
    { dice: 8, name: 'Apple Thief', description: 'A small child has swiped an apple from a fruit cart. The merchant has noticed, and is yelling after the small, fleeing figure, calling for someone to catch them.' },
    { dice: 9, name: 'Wedding', description: 'A local wedding is taking place in town, and the reception is being set up alongside the merchants in the square, supplementing all the hubbub with happy music and dancing.' },
    { dice: 10, name: 'Tavern Special', description: 'One of the taverns, facing onto the market square, has announced a market day special, and now has an ever-growing line out their door.' },
    { dice: 11, name: 'Injured Guard', description: 'An injured guard has ridden into the marketplace, looking around frantically. They have promptly passed out, falling from their horse.' },
    { dice: 12, name: 'Infestation', description: 'One of the merchants\' wagon loads is infested with some kind of pest, and the guards are working to remove the cart and its cargo to be burnt outside of town, before it spreads. The merchant is arguing loudly and desperately.' },
];

export {
  townOriginsTable,
  townPriorityTable,
  magicShopSubTable,
  industrySubTable,
  townSpecialtyTable,
  townAgeTable,
  townSizeTable,
  townConditionTable,
  townProsperityTable,
  marketSquareTable,
  vendorStallAcquisitionTable,
  overflowTable,
  fortificationTable,
  townPopulationDensityTable,
  populationOverflowTable,
  farmsAndResourcesCountData,
  farmsAndResourcesTable,
  townVisitorTrafficTable,
  nightActivityTable,
  townLeadershipTable,
  townLawEnforcementTable,
  townPopulationWealthTable,
  townCrimeTable,
  nonCommercialCountData,
  nonCommercialLocationTypeTable,
  placesOfEducationTable,
  townPlacesOfGatheringTable,
  placesOfGovernmentTable,
  townPlaceOfWorshipSizeTable,
  townFervencyTable,
  alignmentOfTheFaithTable,
  commercialCountData,
  shopOrServiceTable,
  townRecentHistoryTable,
  marketDayEventsTable,
};