// city.js

// This file contains data tables specific to the City settlement type.

// --- NEW --- Updated the recent history table based on the new image (d20).
const cityRecentHistoryTable = [
    { min: 1, max: 1, name: 'Construction Collapse', description: 'Some element of city-sponsored construction collapsed, and several people have been killed.' },
    { min: 2, max: 2, name: 'Market Hooligans', description: 'A gang of hooligans have started making trouble around the market.' },
    { min: 3, max: 3, name: 'Tavern Fire', description: 'Adventurers visiting the city started a bar brawl, and the tavern they were in was burned down.' },
    { min: 4, max: 4, name: 'Incredible Invention', description: 'An inventor in the city came up with an incredible contraption that has dramatically impacted the lives of the city\'s residents.' },
    { min: 5, max: 5, name: 'Severe Weather', description: 'Ongoing heavy thunderstorms or blizzards are wracking the city.' },
    { min: 6, max: 6, name: 'New Craze', description: 'A visitor to the city brought something with them that has started a new craze or fashion.' },
    { min: 7, max: 7, name: 'Impending Visit', description: 'The city received word recently that a representative from a neighboring kingdom will be visiting. They should be arriving any day.' },
    { min: 8, max: 8, name: 'Mysterious Illness', description: 'Some form of illness has been sweeping through the city, and none are sure what it is, or how it started.' },
    { min: 9, max: 9, name: 'Broken Gate', description: 'The city\'s main gate has broken and needs extensive repairs. In the meantime, the gate is open and additional guards are needed to staff it at all times. If guards are not available, citizens may have been called.' },
    { min: 10, max: 10, name: 'Call for New Leadership', description: 'A group of citizens are calling for a new form of leadership. How do others in the city respond?' },
    { min: 11, max: 11, name: 'Inedible Cuisine', description: 'An item of local cuisine has suddenly been rendered inedible. Whatever is causing the problem seems to be persisting.' },
    { min: 12, max: 12, name: 'Unusual Contest', description: 'An unusual, and intriguing, contest is being held by a major figure in the community. Tryouts began a week ago, but none that have participated have mentioned what it is, whether or not they succeeded, or what\'s next.' },
    // NOTE: Filling remaining 13-20 to make it a d20 table, as per image header context
    { min: 13, max: 20, name: 'Reroll', description: 'Another recent event has occurred. Roll again on this table.' }
];

// --- NEW --- Added Noteworthy Official table for cities.
const cityOfficialsTable = [
    { dice: 1, name: 'Adviser', description: 'Second in command of the city. Can be an official, or unofficial, position.' },
    { dice: 2, name: 'Ambassador', description: 'Regularly acts as a representative for the city/nation when traveling abroad.' },
    { dice: 3, name: 'Catchpole', description: 'Catches and brings in debtors.' },
    { dice: 4, name: 'Champion', description: 'Ready to stand in for the city leadership for any martial matters, either ceremonially or officially.' },
    { dice: 5, name: 'Clerk', description: 'Recordkeeper for the city.' },
    { dice: 6, name: 'Exchequer', description: 'Responsible for taxes.' },
    { dice: 7, name: 'Guildmaster', description: 'Oversees one of the official (or underground) guilds, or factions, within the city.' },
    { dice: 8, name: 'Herald', description: 'Responsible for disseminating official edicts, and other news, to the general populace. If serving in a courtly capacity, bears responsibility for knowing the names and titles of important individuals, and announcing them, when appropriate.' },
    { dice: 9, name: 'High Priest/Druid', description: 'The primary representative of the faithful to the city leadership.' },
    { dice: 10, name: 'High Mage', description: 'The representative of the practitioners of arcane arts to the city leadership.' },
    { dice: 11, name: 'Jailer', description: 'In charge of confining prisoners.' },
    { dice: 12, name: 'Judge', description: 'Decision-maker in legal matters.' },
    { dice: 13, name: 'Liner', description: 'Determines property boundaries.' },
    { dice: 14, name: 'Master of Intelligence', description: 'Responsible for seeking and utilizing information vital for city/nation’s security.' },
    { dice: 15, name: 'Master of Revels', description: 'Lead organizer of festivals and special events.' },
    { dice: 16, name: 'Master of Stores', description: 'Oversees the city’s stores of supplies, such as grain or building materials.' },
    { dice: 17, name: 'Master of Trade', description: 'Responsible for the management of imports and exports.' },
    { dice: 18, name: 'Master of the Treasury', description: 'Responsible for the city’s expenditures and paying contracts and debts.' },
    { dice: 19, name: 'Master of the Wild', description: 'Surveys the surrounding areas, mapping the wilderness, looking for monsters or other threats, and regulating hunting.' },
    { dice: 20, name: 'Roadwarden/Dockwarden', description: 'In charge of some, or all, of the city’s transportation systems.' },
];

// --- NEW --- Added Official Competence table.
const cityOfficialCompetenceTable = [
    { min: 1, max: 1, name: 'Corrupt', description: 'Taking advantage of the position for personal gain.' },
    { min: 2, max: 3, name: 'Incompetent', description: 'Doesn’t truly understand how to execute the position.' },
    { min: 4, max: 5, name: 'Committed', description: 'Utterly committed to the job, truly feeling it is of vital importance.' },
    { min: 6, max: 6, name: 'Overqualified', description: 'Based on skills and experience, ought to be in a higher, or more challenging, position.' },
];

// --- NEW --- Added Beneath the Surface table.
const beneathTheSurfaceTable = [
    { dice: 1, name: 'Pack', description: 'A pack of particularly feral animals roams the city.' },
    { dice: 2, name: 'Monster', description: 'A monster lurks somewhere in the city.' },
    { dice: 3, name: 'Markings', description: 'Strange markings have been showing up around the city.' },
    { dice: 4, name: 'Fight Club', description: 'A fight club has started somewhere in the city, and may be gaining more participants.' },
    { dice: 5, name: 'Secret', description: 'Some portion of the populace is not as they seem.' },
    { dice: 6, name: 'Outside Contact', description: 'Someone in the city is in regular communication with an interesting external contact.' },
    { dice: 7, name: 'Tampering', description: 'Someone is interfering with forces best left alone.' },
    { dice: 8, name: 'Unsafe', description: 'There is a structural problem with a location within the city (or, possibly, the land, or environment, it is built on). The longer it goes unnoticed, the more damaging it could be.' },
    { dice: 9, name: 'Parties', description: 'A guerilla party scene has been emerging within the city, with semi-frequent, secret, invitation-only parties being held at ever-changing locations.' },
    { dice: 10, name: 'Black Market', description: 'An underground black-market has been established, dealing in the movement of illicit goods or services.' },
    { dice: 11, name: 'Races', description: 'A racing circuit has been established outside the city.' },
    { dice: 12, name: 'Haunted', description: 'The city is being haunted by some kind of spirit.' },
];

// --- NEW --- Added Beneath the Surface Awareness table.
const beneathTheSurfaceAwarenessTable = [
    { dice: 1, name: 'Utterly Oblivious', description: 'The public has not seen, or heard, any hint of whatever is going on. It will go unchecked until something triggers a change.' },
    { dice: 2, name: 'Single, Subtle Occurrence', description: 'Someone has noticed some kind of evidence, but doesn’t quite know what to make of it. They just know it’s strange.' },
    { dice: 3, name: 'Disparate, Subtle Occurrences', description: 'A few people have passively encountered some evidence of what’s going on, though they are not aware of one another, and are not sure about what they’ve encountered.' },
    { dice: 4, name: 'Many Subtle Occurrences', description: 'A fair amount of people have encountered something related to what’s going on and, while firm conclusions have not been drawn, there may be rumors.' },
    { dice: 5, name: 'Single Occurrence', description: 'Someone has noticed something, and has formed some ideas. They have started to ask questions, or poke around a bit.' },
    { dice: 6, name: 'Disparate Occurrences', description: 'A few people have noticed evidence, and are beginning to ask serious questions.' },
    { dice: 7, name: 'Many Occurrences', description: 'A fair amount of people have noticed evidence, and are beginning to ask serious questions. Some may even have found one another and pooled their knowledge.' },
    { dice: 8, name: 'Single, Direct Occurrence', description: 'Someone has had a direct, first-hand experience involving the issue, and is trying to deal with it somehow.' },
    { dice: 9, name: 'Disparate, Direct Occurrences', description: 'A few people have had direct, first-hand experiences involving the issue, and word is starting to spread. Claims have become difficult to dismiss.' },
    { dice: 10, name: 'Many Direct Occurrences', description: 'A fair amount of people have had direct, first-hand experiences involving the issue. Talk seems to be all over the place, and some of the witnesses have grouped together.' },
    { dice: 11, name: 'Willfully Ignorant', description: 'The public is fully aware of most, or all, of the issue, but deliberately avoids addressing it or dealing with it in any way.' },
    { dice: 12, name: 'Actively Aware', description: 'The public is fully aware, and actively addressing whatever is going on.' },
];


const cityOriginsTable = [
  {
    dice: 1,
    name: 'Invading Occupation',
    description: 'The builders of the city were a foreign, occupying force, who initially set up a camp. As time went on, more and more permanent structures were built. Their foothold in the region remained solid, and the settlement grew.'
  },
  {
    dice: 2,
    name: 'Tribal Home',
    description: 'The city site was originally home to a group of natives in the region. The settlement built upon itself until it became the city it is now.'
  },
  {
    dice: 3,
    name: 'Natural Progression - Trading Post',
    description: 'A small trading post steadily attracted enough business to warrant expansion. It grew into a town, but demand and traffic did not stop.'
  },
  {
    dice: 4,
    name: 'Repurposed History',
    description: 'The city was founded and built on top of ancient ruins. Standing ruins might have been left as statues and tributes to the past but, more often, they have either been used (if still stable) or incorporated into new structures.'
  },
  {
    dice: 5,
    name: 'Natural progression - Village',
    description: 'A handful of hovels, inhabited by simple folk, grew as more and more people came and made it their home too. More space was soon necessary, and the village grew into a town, then a city. Despite this expansion, evidence of its humble beginnings are likely still visible in many places.'
  },
  {
    dice: 6,
    name: 'Haven',
    description: 'The location attracted a group seeking refuge from some crisis. They could have been persecuted by some great oppressor or, perhaps, they fled a natural disaster. Conversely, they could be a society of rebels or outlaws who desired an independent settlement of their own.'
  },
  {
    dice: 7,
    name: 'Advantageous Position',
    description: 'The site was chosen to take advantage of desirable geographical features, like a strategic choke point, or an ideal high-ground posting. As the location proved itself, it grew.'
  },
  {
    dice: 8,
    name: 'Prison',
    description: 'The site was originally a holding colony for criminals. Over time, events transpired allowing the place to become a legitimate city in its own right. Was this thanks to a successful revolt? Perhaps the entity that controlled the prison colony was conquered and the colony was left to its own devices? Maybe something made the colony\'s kingdom change its mind and legitimize it?'
  },
  {
    dice: 9,
    name: 'Agriculture',
    description: 'A dense farming community attracted many people with knowledge and a strong work ethic. Production was high, at least for a while, and the area became more and more populous. Structures sprang up to house the new folks and account for the needs of its growing group of residents, until the desire for convenience, security, and comfort spurred the establishment of a proper city.'
  },
  {
    dice: 10,
    name: 'Magical',
    description: 'The city\'s inception stemmed from something magical. It may have been the influence of magical beings, the presence of magical structures, or the convergence of magical energies at that specific place. It could also have been from the deliberate influence of a specific individual.'
  },
];

const cityPriorityTable = [
    {
        dice: 1,
        name: 'Control',
        description: 'The city has established itself as a power in the region, establishing a network of patrolled roads, but also military presence, in other local settlements. The city itself is a strong and formidable presence.',
        modifiers: { lawEnforcement: 3 }
    },
    {
        dice: 2,
        name: 'Trade',
        description: 'The city was made to move goods. Coin flows from hand to hand, and the city wholeheartedly encourages this. It likely collects a tax from any trade, but the benefits should far outweigh the costs.',
        modifiers: { populationWealth: 1 }
    },
    {
        dice: 3,
        name: 'Enlightenment',
        description: 'The leadership prides itself on its intelligence and wisdom, typically making choices that preserve their society and reinforce the community\'s access to knowledge and culture.',
        rules: { districts: { free: 'Scholar' } }
    },
    {
        dice: 4,
        name: 'Entertainment',
        description: 'Whatever this place was before the city was founded properly, it was known for fun. Perhaps it was a place of grandiose performances, raucous pubs, or dancing and festivities. On the other hand, maybe it became known for more disreputable pursuits, such as underground fighting or gambling, among many other possibilities.',
        rules: { additionalLocations: { addEntertainment: true } }
    },
    {
        dice: 5,
        name: 'Production',
        description: 'This settlement was built around producing a particular good or resource. This could be raw materials, like crops or mining ore, but could also be the manufacture of a certain product or products.',
        rules: { outsideTheCity: { diceOverride: 10, rerollRange: [1, 4] } }
    },
    {
        dice: 6,
        name: 'Faith',
        description: 'The city is a nexus for the faithful. For one reason or another, folk may undertake pilgrimages here. There are likely at least a few places of worship, perhaps many more than usual. The city may have been founded around the site of a miracle or visitation. It could be the holding place of a special artifact, or the residence of a particular person of religious import. The city may be dominated by a single faith or, perhaps, multiple faiths are represented here.',
        rules: { districts: { free: 'Temple' } }
    },
];

const cityAgeTable = [
    { min: 1, max: 2, name: 'Recent', description: 'The city\'s final work was completed within the past 10 years.', modifiers: { populationDensity: -2 } },
    { min: 3, max: 4, name: 'Established', description: 'The city has been around for at least 10, but up to 100, years.', modifiers: { populationDensity: -1 } },
    { min: 5, max: 6, name: 'Mature', description: 'The city has been around at least 100, but up to 300, years.', modifiers: { populationDensity: 0 } },
    { min: 7, max: 8, name: 'Old', description: 'The city has been around for 300 to 1000 years.', modifiers: { populationDensity: 1 } },
    { min: 9, max: 10, name: 'Ancient', description: 'The city is older than living, and possibly even recorded, memory.', modifiers: { populationDensity: 2 } },
];

const citySizeTable = [
    { min: 1, max: 2, name: 'Very Small', description: 'Structures in the city are likely able to support around 8,000 people.', modifiers: { numberOfDistricts: -4 } },
    { min: 3, max: 6, name: 'Small', description: 'Structures in the city are able to support around 16,000 people.', modifiers: { numberOfDistricts: -1 } },
    { min: 7, max: 14, name: 'Medium', description: 'Structures in the city are able to support around 24,000 people.', modifiers: { numberOfDistricts: 0 } },
    { min: 15, max: 18, name: 'Large', description: 'Structures in the city are able to support around 32,000 people.', modifiers: { numberOfDistricts: 2 } },
    { min: 19, max: 20, name: 'Very Large', description: 'Structures in the city are able to support around 40,000 people or more.', modifiers: { numberOfDistricts: 6 } },
];

const outsideTheCityCountData = {
    'Very Small': 5,
    'Small': 4,
    'Medium': 3,
    'Large': 2,
    'Very Large': 1,
};

const outsideTheCityTable = [
    { min: 1, max: 4, name: 'None', description: 'If you have any remaining rolls to make on this table, proceed with them.' },
    { min: 5, max: 6, name: 'Farming [Agriculture]', description: 'A group of farms, providing food for the city, are found on the nearest hospitable land under its control.' },
    { min: 7, max: 8, name: 'Farming [Livestock]', description: 'A group of farms, providing livestock for the city, are found on the nearest hospitable land under its control.' },
    { min: 9, max: 10, name: 'Resource Harvesting', description: 'Depending on the landscape and available resources (trees, minerals, ore, stone, etc.), a logging camp, mine, or quarry, belonging to the city, has been built nearby to harvest them, which it then uses or sells.' },
    { min: 11, max: 12, name: 'Barrows', description: 'An area devoted to burial sites.' },
    { min: 13, max: 13, name: 'Caravan Community', description: 'A nomadic group of people have taken to living on the surrounding land nearby. Does the city\'s leadership have an issue with this? What about its residents?' },
    { min: 14, max: 14, name: 'Event Grounds', description: 'Tended grounds for games, duels, ceremonies, or other events.' },
    { min: 15, max: 15, name: 'Family Estate', description: 'A wealthy family\'s large estate is situated in the neighboring countryside.' },
    { min: 16, max: 16, name: 'Hermit\'s Cottage', description: 'A hermit lives near the city limits, beneath the notice of most of the inhabitants. They keep to themselves, but who are they? What do they gain by their close proximity?' },
    { min: 17, max: 18, name: 'Makeshift Settlement', description: 'A large mass of hovels, lean-tos, tents, and other improvised shelters have been built in the shadow of the city\'s walls. Why? Do the leaders and residents care?' },
    { min: 19, max: 19, name: 'Medical Camp', description: 'A set of makeshift or, depending on the nature of what is being treated, permanent structures have been erected to tend to, or even quarantine, the sick or injured.' },
    { min: 20, max: 20, name: 'Prison', description: 'Some sort of structure out here has been designated for holding prisoners or captives (for whatever reason) either temporarily or, perhaps, much longer term.' },
];

const stewardshipTable = [
    { min: 1, max: 1, name: 'Neglected', description: 'All of the fundamental elements of the city are being ignored, or are unable to be addressed.', modifiers: { condition: -7, populationWealth: -13, lawEnforcement: -9 } },
    { min: 2, max: 4, name: 'Minimal', description: 'The fundamental elements of the city are being tended to, but at the bare minimum. This may be because of inexperienced leadership, misplaced priorities, lack of resources, or simple laziness, to name a few possible reasons.', modifiers: { condition: -4, populationWealth: -6, lawEnforcement: -5 } },
    { min: 5, max: 10, name: 'Passing', description: 'The city\'s fundamental elements are taken care of to a serviceable degree, though an inequality of attention is noticeable, and some areas seem to take priority over others. It could be that resources are not plentiful enough to cover everything, but those in charge are doing the best they can.', modifiers: { condition: -1, populationWealth: -3, lawEnforcement: -2 } },
    { min: 11, max: 16, name: 'Adequate', description: 'The city\'s fundamental elements are all taken care of relatively competently, but some room for improvement still exists. Lack of capital, or involvement in more pressing matters such as external conflicts or disaster management, are possible explanations.', modifiers: { condition: 0, populationWealth: 0, lawEnforcement: 0 } },
    { min: 17, max: 19, name: 'Managed', description: 'The city\'s fundamental elements are all accounted for and well attended to. Whoever is responsible is doing an admirable job.', modifiers: { condition: 1, populationWealth: 3, lawEnforcement: 4 } },
    { min: 20, max: 20, name: 'Disciplined', description: 'The city\'s fundamental elements are firmly in hand, providing what it needs to perform at peak functionality. There is little to no room for improvement. Whoever is managing things is doing so expertly.', modifiers: { condition: 5, populationWealth: 6, lawEnforcement: 8 } },
];

const generalConditionTable = [
    { min: 1, max: 1, name: 'Squalid', description: 'The city is in a deplorable state. Things are falling apart, filthy and, to anyone who doesn\'t live there, seems positively unlivable. Most of the buildings, if not all, are likely a disgrace, or in terrible need of help.', modifiers: { districtCondition: -2 } },
    { min: 2, max: 4, name: 'Dilapidated', description: 'Things are dirty and in a widespread state of disrepair, though some token effort may have been made at cleanliness. Streets are probably packed dirt or broken stone. They may be uneven, rutted or muddy. Structures have likely received similar low levels of care, though there could be some disparity.', modifiers: { districtCondition: -1 } },
    { min: 5, max: 12, name: 'Decent', description: 'The city is passable. While not offensive to the senses of one that is well traveled, it could still be off-putting to those with lofty expectations. Structures may not be aesthetically pleasing, but are generally functional.', modifiers: { districtCondition: 0 } },
    { min: 13, max: 19, name: 'Impressive', description: 'The city is well taken care of, and cleanliness is clearly a priority. Structures are maintained, though signs of wear may still be apparent. It feels lived-in, but of a respectable quality in every regard.', modifiers: { districtCondition: 1 } },
    { min: 20, max: 20, name: 'Magnificent', description: 'The city is incredible. Cleanliness, maintenance and structural integrity are all of the highest standard. Loving attention seems to have been lavished on as many aspects as is possible.', modifiers: { districtCondition: 2 } },
];

const cityFortificationTable = [
    { min: 1, max: 1, name: 'Unfortified', description: 'The city is exposed on all sides, save for any barriers created by the presence of buildings or natural land formations.', modifiers: { disposition: -5 } },
    { min: 2, max: 8, name: 'Lightly Fortified', description: 'The city has bare-bones fortifications which are a minimal obstacle for enemy forces, but are adequate to deter wild animals. A simple gate, which can be barred in the evenings, sits astride the main road.', modifiers: { disposition: 1 } },
    { min: 9, max: 15, name: 'Fortified', description: 'The city is surrounded by a substantial wall of wood or stone. The wall is able to be patrolled by guards on a raised walkway. Visitors to the city pass through a main gate that can be barred in the evenings. A few watch towers may be placed around the city, though are likely sporadic.', modifiers: { disposition: 3 } },
    { min: 16, max: 19, name: 'Heavily Fortified', description: 'The city is surrounded by a heavy wall of wood or stone, with several watchtowers built along its length. The gate is double-thickness and reinforced with metal bands. There are additional watchtowers built at various points throughout the surrounding countryside.', modifiers: { disposition: 5 } },
    { min: 20, max: 20, name: 'Extremely Fortified', description: 'The city is surrounded by an imposing wall of wood or stone, with many fully-staffed watchtowers at regular intervals along its length. The gate is double-thickness, reinforced with metal bands, augmented with a portcullis, and is always manned. A supplementary wall of wood or stone encompasses the surrounding countryside, with its own watchtowers. Nothing goes in or out without the watch\'s knowledge or permission.', modifiers: { disposition: 7 } },
];

const cityMarketSquareTable = [
    { min: 1, max: 2, name: 'Tight', description: 'Only room for a few vendor stalls.' },
    { min: 3, max: 4, name: 'Ample', description: 'Room for a fair number of vendor stalls.' },
    { min: 5, max: 6, name: 'Spacious', description: 'Room for lots of vendor stalls.' },
];

const cityVendorStallAcquisitionTable = [
    { dice: 1, name: 'First Come, First Served - No Fee', description: 'Merchants line up prior to market day. Those at the front of the line are given the spaces. No fees are charged.' },
    { dice: 2, name: 'First Come, First Served - Fee', description: 'Merchants line up prior to market day. Those at the front of the line are given first pick of the available stall spaces, provided they can pay the fee for the day.' },
    { dice: 3, name: 'Lease', description: 'Merchants pay in advance (sometimes far in advance) for the right to a space in the market square.' },
    { dice: 4, name: 'Bid', description: 'Prior to market day, the spaces are auctioned off.' },
];

const cityMerchantOverflowTable = [
    { dice: 1, name: 'Banned', description: 'Excess vendors are not allowed to set up stalls outside the town. City guards will enforce this.', modifiers: { lawEnforcement: 1 } },
    { dice: 2, name: 'Unpatrolled', description: 'Excess vendors are allowed to set up stalls but, as the city watch do not patrol or monitor these areas, the risk is higher. The spaces available are unkempt.' },
    { dice: 3, name: 'Monitored', description: 'Excess vendors are allowed to set up stalls, and the city watch patrols through regularly, but the areas themselves are less-maintained and traffic is lighter.' },
    { dice: 4, name: 'Encouraged', description: 'Excess vendors are encouraged to set up stalls outside the city, if they are unable to get a spot in the square. There are maintained areas available for use, and provided on a first-come, first-served basis. When in use by vendors, this area is regularly patrolled, if law enforcement personnel can be spared.' },
];

const undergroundPassagesTable = [
    { min: 1, max: 8, name: 'None', description: 'There are no significant passages underneath the city.' },
    { min: 9, max: 14, name: 'Sewers', description: 'A network of drains, pipes, and trenches lies beneath the city. Base the sewer\'s condition upon that of the settlement, if they were built concurrently. They may pre-date the current city.' },
    { min: 15, max: 17, name: 'Natural Caves', description: 'Below the city, natural cave systems can be found that may, or may not, have been discovered yet.' },
    { min: 18, max: 19, name: 'Tunnels', description: 'A series of tunnels exist beneath the city. This could be for maintenance, defensive, or clandestine purposes and may or may not, have been purpose-built for the current settlement. They could potentially have been dug by enemy forces, either recently or long ago.' },
    { min: 20, max: 20, name: 'Forgotten Crypts', description: 'Old burial chambers and tombs are housed deep beneath the city, likely unknown to the general populace.' },
];

const cityPopulationDensityTable = [
    { min: 1, max: 2, name: 'Skeleton', description: 'The city only has enough people to function at its most basic level.', modifiers: { nightActivity: -2 } },
    { min: 3, max: 6, name: 'Sparse', description: 'Folk live in the city, but it would never be called bustling. Walking down the street, you\'ll typically only see a few people.', modifiers: { nightActivity: -1 } },
    { min: 7, max: 14, name: 'Populous', description: 'A moderate amount of people live in the city. Walking through the streets, you will see plenty of people, but never so many that it would feel cramped.', modifiers: { nightActivity: 0 } },
    { min: 15, max: 18, name: 'Dense', description: 'There is a large amount of people living in the city. There are few, if any, vacant buildings. In high traffic areas, one generally has elbow room, but not much more.', modifiers: { nightActivity: 1 } },
    { min: 19, max: 20, name: 'Crowded', description: 'The city is filled with jostling throngs. Practically all structures are occupied. Some may even camp outside the walls. Moving about can be difficult, and bumping into other people is typical in higher traffic areas.', modifiers: { nightActivity: 2 } },
];

const cityPopulationWealthTable = [
    { min: 1, max: 2, name: 'Destitute', description: 'Nearly everyone in the city consistently lacks the barest essentials of what they need to survive.', modifiers: { crime: -2 } },
    { min: 3, max: 6, name: 'Impoverished', description: 'Around half of the city struggles to carve out even a meager existence.', modifiers: { crime: -1 } },
    { min: 7, max: 14, name: 'Average', description: 'Most of the city\'s population have enough to live a modest life. Those without are a minority.', modifiers: { crime: 0 } },
    { min: 15, max: 17, name: 'Prosperous', description: 'The majority have enough to live a good life and, of them, a fair amount can even live comfortably.', modifiers: { crime: -1 } },
    { min: 18, max: 19, name: 'Wealthy', description: 'Nearly everyone is able to live well, and some are very prosperous.', modifiers: { crime: -2 } },
    { min: 20, max: 20, name: 'Affluent', description: 'The entire city is able to live comfortably, with a significant portion living in luxury.', modifiers: { crime: -3 } },
];

const cityVisitorTrafficTable = [
    { min: 1, max: 2, name: 'Mostly Locals', description: 'On any given day, there are typically a few from outside the city, though not enough to impact congestion.', modifiers: { nightActivity: 0 } },
    { min: 3, max: 6, name: 'Groups', description: 'There are generally a fair amount of visitors to the city. May slightly increase congestion.', modifiers: { nightActivity: 1 } },
    { min: 7, max: 12, name: 'Crowds', description: 'A noticeable amount of people come through the city on a regular basis. Congestion is increased.', modifiers: { nightActivity: 2 } },
    { min: 13, max: 17, name: 'Droves', description: 'Large groups of people regularly frequent the city. Congestion is significantly increased.', modifiers: { nightActivity: 3 } },
    { min: 18, max: 19, name: 'Masses', description: 'Huge groups of people always seem to be visiting. Congestion could cause difficulties if the city is unable to cope with very large amounts of people.', modifiers: { nightActivity: 4 } },
    { min: 20, max: 20, name: 'Multitudes', description: 'Massive groups of people throng the streets, likely spilling out onto the roads outside the city. Congestion is an ever-present reality, and a regular issue.', modifiers: { nightActivity: 5 } },
];

const cityNightActivityTable = [
    { min: 1, max: 1, name: 'Dark', description: 'By the time the sun goes down, the streets are nearly empty and the city closes up. All is quiet and peaceful. If the city has a gate, it is closed and barred. Guards may, or may not, allow night travelers inside.' },
    { min: 2, max: 3, name: 'Quiet', description: 'Everything is closed except for inns and taverns, which remain open until around midnight. Late guests would have to wake an innkeeper to get a room. If the city has a gate, it is closed and barred. Guards will usually let visitors in, but will discourage wandering.' },
    { min: 4, max: 12, name: 'Slow', description: 'Almost everything is closed except for taverns, which may be open until early morning, and inns, which stay open perpetually. If the city has a gate, it is closed, but guards will generally be ready to open it, as needed.' },
    { min: 13, max: 17, name: 'Active', description: 'Inns and taverns remain open perpetually. Some shops and services may be open, catering to late travelers or night owls. A fair amount of establishments may still be closed. If the city has a gate, it is kept open, but guarded, ready to be closed, if needed.' },
    { min: 18, max: 19, name: 'Lively', description: 'There is little difference between day and night traffic. There are always people on the streets and it may seem like no one ever sleeps. Most shops and services remain open constantly. If the city has a gate, it remains open and is only closed under the most dire of circumstances.' },
    { min: 20, max: 20, name: 'Raucous', description: 'When the day ends, the city truly comes to life. Inns and taverns have customers coming and going at all hours. Parties, and other commotion, can often be heard. One might expect things to close down after dark but, in this city, there are locations that only open in the evenings. There is likely a sort of ‘night market’ throughout the city, with goods, services, or curiosities of all kinds available for those keep alternative hours (or scoff at the need for sleep).' },
];

const cityLeadershipTable = [
    { min: 1, max: 15, name: 'Elected Council', description: 'Prominent members of the community were chosen to lead the city collectively.' },
    { min: 16, max: 30, name: 'Mayor', description: 'The locals democratically voted for their current leader.' },
    { min: 31, max: 45, name: 'Hereditary', description: 'A non-elected leader is in power, by virtue of their bloodline.' },
    { min: 46, max: 60, name: 'Merchant Monarch', description: 'The wealthiest merchant in the city leads by default. (Regardless of population wealth, they are, at least, considered wealthy.)', rules: { districts: { free: 'Market' } } },
    { min: 61, max: 75, name: 'Military Officer', description: 'The city is controlled by a current or ex-leader of a military group.', modifiers: { lawEnforcement: 1 } },
    { min: 76, max: 90, name: 'Oligarchy', description: 'A few top individuals hold sway, collectively, over the city.', subTable: 'oligarchy', rules: { districts: { chooseFitting: true } } },
    { min: 91, max: 99, name: 'Underworld or Criminal Enterprise', description: 'A criminal, or group of criminals, either publicly, or privately, controls the city.', modifiers: { crime: -2 }, rules: { crime: { forceOrganizedCrime: true } } },
    { min: 100, max: 100, name: 'Anarcho-Syndicalist Commune', description: 'The members of the city take turns as a sort of executive officer for the week.' },
];

const cityLawEnforcementTable = [
    { min: 1, max: 1, name: 'None', description: 'If not openly opposed by the collective population, crime can easily run amok. This could manifest itself in subtle or obvious ways.', modifiers: { crime: -5 } },
    { min: 2, max: 4, name: 'Skeleton City Watch', description: 'Run by a sergeant, a minimal staff is able to man the gates and watchtowers in shifts.', modifiers: { crime: -3 } },
    { min: 5, max: 11, name: 'City Watch', description: 'Run by a single captain, the watch has sufficient strength to cover key points, as well as establish a patrol once or twice a day.', modifiers: { crime: -1 } },
    { min: 12, max: 17, name: 'Robust City Watch', description: 'Run by a captain and two sergeants, the watch are able to place extra support at key points, as well as establish three or four patrols a day.', modifiers: { crime: 0 } },
    { min: 18, max: 20, name: 'Extensive City Watch', description: 'Run by a captain and several sergeants, all key points are thoroughly guarded. The city perimeter is patrolled constantly, and city patrols happen regularly.', modifiers: { crime: 2 } },
];

const cityGeneralCrimeTable = [
    { min: 1, max: 2, name: 'Dangerous', description: 'The streets are crawling with crime. Having things stolen is the least of folks\' worries. Vandalism and muggings are a daily occurrence, and discoveries of bodies are not what one would call ‘rare’.', modifiers: { urbanEncounter: 4 }, rules: { crime: { hasOrganizedCrime: true } } },
    { min: 3, max: 6, name: 'Frequent', description: 'The streets are unsafe, and a purse in plain sight is almost sure to be stolen. Vandalism and muggings are fairly regular. It’s dangerous to travel alone.', modifiers: { urbanEncounter: 4 }, rules: { crime: { hasOrganizedCrime: true } } },
    { min: 7, max: 14, name: 'Common', description: 'Most are used to hearing about some sort of trouble every day or two. Everyone knows someone who’s been a victim of crime, either a theft or, sometimes, even a mugging, or worse.', modifiers: { urbanEncounter: 3 }, rules: { crime: { hasOrganizedCrime: true } } },
    { min: 15, max: 18, name: 'Uncommon', description: 'Theft or mild violence happens from time to time. Best to keep an eye out, just in case.', modifiers: { urbanEncounter: 2 } },
    { min: 19, max: 20, name: 'Infrequent', description: 'Most don’t believe there is any crime, and certainly haven’t experienced any.', modifiers: { urbanEncounter: 1 } },
];

const cityOrganizedCrimeTable = [
    { min: 1, max: 2, name: 'Completely Secret', description: 'The organization has operated incognito, beneath any form of public notice. Any contacts with public officials are dealt with through redundant channels, always maintaining multiple degrees of separation. Remaining unknown is of paramount importance.' },
    { min: 3, max: 6, name: 'Whispers', description: 'There are hushed rumors of criminal organization, but most folks keep these suspicions to themselves, for fear of ridicule, or reprisal. The organization has a few operatives within the city and they work hard to keep a very low profile.' },
    { min: 7, max: 14, name: 'Talk', description: 'Enough incidents have occurred that most folk don’t have trouble believing there is an organized criminal element in the city. They operate quietly but ambitiously, carrying out frequent high-profile jobs. They could also have ties to government officials, or may even attempt to control elements of the city itself.' },
    { min: 15, max: 18, name: 'Barely Hidden', description: 'The organization is a looming shadow within the city. None are entirely sure where it is based, or who their operators are, but it’s clear that the organization is real. Obstacles that would be contrary to the ‘hypothetical’ organization’s interests are quickly resolved. Bodies are found, messages sent and, one way or another, their will is always made known.' },
    { min: 19, max: 20, name: 'Open', description: 'Though key members may be unknown, the presence of the organization is common knowledge and, though it may not have been fully proved, it’s clear they have a direct hand in running the city. They operate with impunity, with little fear of reprisal or repercussion, likely taking no steps to mask their presence to ensure compliance, such as with a sigil on a sealed envelope. How did it get to this point? How do the people of the city feel about this?' },
];

const numberOfDistrictsTable = [
    { min: 1, max: 2, name: '2', value: 2 },
    { min: 3, max: 10, name: '3', value: 3 },
    { min: 11, max: 15, name: '4', value: 4 },
    { min: 16, max: 19, name: '5', value: 5 },
    { min: 20, max: 20, name: '6', value: 6 },
];

const districtTypeTable = [
    { dice: 1, name: 'Administration', description: 'This district has a focus on government and civil matters.' },
    { dice: 2, name: 'Arcane', description: 'This district has a focus on magical matters.' },
    { dice: 3, name: 'Botanical', description: 'This district has a focus on nature.' },
    { dice: 4, name: 'Craft', description: 'This district has a focus on the creation of different goods.' },
    { dice: 5, name: 'Docks', description: 'This district has a focus on all naval and seafaring matters. (reroll if your city is not adjacent to water)' },
    { dice: 6, name: 'Industrial', description: 'This district has a focus on large-scale production facilities.' },
    { dice: 7, name: 'Market', description: 'This district has a focus on the sale of practical goods.' },
    { dice: 8, name: 'Merchant', description: 'This district has a focus on business and non-essential goods.' },
    { dice: 9, name: 'Scholar', description: 'This district has a focus on education and the pursuit of knowledge.' },
    { dice: 10, name: 'Slums', description: 'This district is an area where those with lesser means might live.', rules: { condition: { diceOverride: 4 } }, modifiers: { quality: -1 } },
    { dice: 11, name: 'Temple', description: 'This district has a focus on religion and/or spiritual enlightenment.' },
    { dice: 12, name: 'Upper Class', description: 'This district is an area where those with greater means might live.', modifiers: { districtCondition: 3, quality: 3 } },
];

const districtConditionTable = [
    { min: 1, max: 3, name: 'Far Worse', description: '2 steps worse than general condition level.', step: -2, modifiers: { quality: -2 } },
    { min: 4, max: 7, name: 'Worse', description: '1 step worse than general condition level.', step: -1, modifiers: { quality: -1 } },
    { min: 8, max: 13, name: 'Equal', description: 'Same as general condition level.', step: 0, modifiers: { quality: 0 } },
    { min: 14, max: 17, name: 'Better', description: '1 step better than general condition level.', step: 1, modifiers: { quality: 1 } },
    { min: 18, max: 20, name: 'Far Better', description: '2 steps better than general condition level.', step: 2, modifiers: { quality: 2 } },
];

const districtConditionCrimeModifiers = {
    'Squalid': -2,
    'Dilapidated': -1,
    'Decent': 0,
    'Impressive': -1,
    'Magnificent': -2,
};

const districtEntryTable = [
    { min: 1, max: 4, name: 'Open', description: 'Entrance to the district is unrestricted.', modifiers: { districtCrime: 0 } },
    { min: 5, max: 7, name: 'Lightly Guarded', description: 'The district entrance has a token guard presence.', modifiers: { districtCrime: 1 } },
    { min: 8, max: 10, name: 'Guarded', description: 'The district entrance has a strong guard presence.', modifiers: { districtCrime: 2 } },
    { min: 11, max: 12, name: 'Gated & Guarded', description: 'The district entrance is barred by a gate with guards.', modifiers: { districtCrime: 3 } },
];

const districtCrimeTable = [
    { min: 1, max: 3, name: 'Far Worse', description: '2 steps worse than the city\'s general crime level.', step: -2 },
    { min: 4, max: 7, name: 'Worse', description: '1 step worse than the city\'s general crime level.', step: -1 },
    { min: 8, max: 13, name: 'Equal', description: 'Same as the city\'s general crime level.', step: 0 },
    { min: 14, max: 17, name: 'Better', description: '1 step better than the city\'s general crime level.', step: 1 },
    { min: 18, max: 20, name: 'Far Better', description: '2 steps better than the city\'s general crime level.', step: 2 },
];

const crimeDegreesData = {
    'Dangerous': { urbanEncounter: 5 },
    'Frequent': { urbanEncounter: 4 },
    'Common': { urbanEncounter: 3 },
    'Uncommon': { urbanEncounter: 2 },
    'Infrequent': { urbanEncounter: 1 },
};

const housingTable = [
    { min: 1, max: 5, name: 'None', description: 'No one lives in this district.' },
    { min: 6, max: 9, name: 'Limited', description: 'Only a few live here; the district may be predominantly a place of business or functionality, or perhaps people avoid living here for another, less innocent reason.' },
    { min: 10, max: 11, name: 'Moderate', description: 'A fair amount of the buildings in the district house residents.' },
    { min: 12, max: 12, name: 'Extensive', description: 'A significant amount of the district’s buildings are housing for residents.' },
];

const districtNotableLocationsTable = [
    { min: 1, max: 1, name: 'None', description: 'There are no notable locations in the district.', value: 0 },
    { min: 2, max: 5, name: 'One', description: 'The first additional location in the district is notable.', value: 1 },
    { min: 6, max: 9, name: 'Two', description: 'Up to the first 2 additional locations in the district are notable.', value: 2 },
    { min: 10, max: 10, name: 'Three', description: 'Up to the first 3 additional locations in the district are notable.', value: 3 },
];

export {
  cityRecentHistoryTable,
  cityOfficialsTable,
  cityOfficialCompetenceTable,
  beneathTheSurfaceTable,
  beneathTheSurfaceAwarenessTable,
  cityOriginsTable,
  cityPriorityTable,
  cityAgeTable,
  citySizeTable,
  outsideTheCityCountData,
  outsideTheCityTable,
  stewardshipTable,
  generalConditionTable,
  cityFortificationTable,
  cityMarketSquareTable,
  cityVendorStallAcquisitionTable,
  cityMerchantOverflowTable,
  undergroundPassagesTable,
  cityPopulationDensityTable,
  cityPopulationWealthTable,
  cityVisitorTrafficTable,
  cityNightActivityTable,
  cityLeadershipTable,
  cityLawEnforcementTable,
  cityGeneralCrimeTable,
  cityOrganizedCrimeTable,
  numberOfDistrictsTable,
  districtTypeTable,
  districtConditionTable,
  districtConditionCrimeModifiers,
  districtEntryTable,
  districtCrimeTable,
  crimeDegreesData,
  housingTable,
  districtNotableLocationsTable,
};