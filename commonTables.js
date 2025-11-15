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

const servicesTable = [
    { min: 1, max: 8, name: 'Barber', description: 'Provides grooming services, such as haircuts or shaves.' },
    { min: 9, max: 16, name: 'Bathhouse', description: 'Provides spaces for bathing.' },
    { min: 17, max: 24, name: 'Doctor/Apothecary', description: 'Provides medical care.' },
    { min: 25, max: 32, name: 'House of Leisure', description: 'Provides entertainment and/or relaxation (GM may decide what kind).' },
    { min: 33, max: 44, name: 'Inn', description: 'Provides accommodation, as well as a place to have a bath and a decent meal.' },
    { min: 45, max: 52, name: 'Club', description: 'Provides entertainment via comedic, dramatic or musical performance.' },
    { min: 53, max: 60, name: 'Soothsayer', description: 'Provides magical prediction and prophecy - sayers of sooth!' },
    { min: 61, max: 68, name: 'Stable', description: 'Provides boarding accommodation for mounts, as well as selling carts, animals, and their tack.' },
    { min: 69, max: 80, name: 'Tavern', description: 'Provides food and drink.' },
    { min: 81, max: 82, name: 'Hired Help - Brutes and Brawlers', description: 'Thugs, ruffians and muscle.' },
    { min: 83, max: 84, name: 'Hired Help - Cloak and Dagger', description: 'Assassins, thieves and spies.' },
    { min: 85, max: 86, name: 'Hired Help - Bows and Slings', description: 'Archers and ranged attack specialists.' },
    { min: 87, max: 88, name: 'Hired Help - Scribes and Clerks', description: 'Masters of history, literature, mathematics and/or business.' },
    { min: 89, max: 90, name: 'Hired Help - Guides and Trackers', description: 'Scouts, rangers and wilderness experts.' },
    { min: 91, max: 92, name: 'Hired Help - Caravan and Mount', description: 'Specialists in transportation and journeys to various locations as well as expedition organization and management.' },
    { min: 93, max: 94, name: 'Hired Help - Arcane Academics', description: 'Experts in matters of magic and lore (may also be natural magic or something else; it need not be exclusively arcane).' },
    { min: 95, max: 96, name: 'Hired Help - Magic Mercenaries', description: 'Specialists trained the use of arcane or non-divine magic in combat and practical mission scenarios.' },
    { min: 97, max: 98, name: 'Hired Help - Priestly Guidance', description: 'Sages offering counsel in all matters of religion and the divine.' },
    { min: 99, max: 100, name: 'Hired Help - Hands of the Divine', description: 'Specialists trained in the use of divine magic in combat and practical mission scenarios.' },
];

const hiredHelpSizeTable = [
    { min: 1, max: 6, name: 'Individual Person', description: 'The hired help is a single person hiring out their services.' },
    { min: 7, max: 10, name: 'Team', description: 'The hired help is a team of individuals who work together.' },
    { min: 11, max: 12, name: 'Guild', description: 'An organized guild is hiring out their services. When hired, a portion of the guild\'s members handle the job, not the entire guild (unless the job is very large).' },
];

const fervencyTable = [
    { min: 1, max: 3, name: 'Unseen', description: 'To those outside the following, it is not clear that the group exists.' },
    { min: 4, max: 7, name: 'Quiet', description: 'Adherents to the faith are inconspicuous, unless one knows what to look for (perhaps particular gestures, items of clothing, or phrases).' },
    { min: 8, max: 12, name: 'Subtle', description: 'Followers of the faith may be identifiable, but remain very reserved.' },
    { min: 13, max: 16, name: 'Moderate', description: 'The pious are confident and unafraid to display their faith openly, but do not encroach upon the wider populus uncalled for.' },
    { min: 17, max: 19, name: 'Fervent', description: 'Followers are outspoken, with little or no fear of reproach. They may sing or speak to the masses.' },
    { min: 20, max: 20, name: 'Zealous', description: 'Adherents are utterly and unthinkingly devout, forcing their doctrine upon their surroundings and peers, or taking actions that further their cause regardless of personal cost. Though typically seen as negative, this could also be a positive, such as a church of light rising up in an evil kingdom, helping those in need, even if it puts themselves in peril.' },
];

const officialsTable = [
    { dice: 1, name: 'Catchpole', description: 'Catches and brings in debtors.' },
    { dice: 2, name: 'Clerk', description: 'Recordkeeper for the town.' },
    { dice: 3, name: 'Exchequer', description: 'Responsible for taxes.' },
    { dice: 4, name: 'Jailer', description: 'In charge of confining prisoners.' },
    { dice: 5, name: 'Judge', description: 'Decision-maker in legal matters.' },
    { dice: 6, name: 'Liner', description: 'Determines property boundaries.' },
    { dice: 7, name: 'Master of Revels', description: 'Lead organizer of festivals and special events.' },
    { dice: 8, name: 'Master of Stores', description: 'Oversees the town\'s stores of supplies such as grain or building materials.' },
];

const officialCompetenceTable = [
    { dice: 1, name: 'Corrupt', description: 'Taking advantage of the position for personal gain.' },
    { min: 2, max: 3, name: 'Incompetent', description: 'Doesn\'t truly understand how to execute the position.' },
    { min: 4, max: 5, name: 'Committed', description: 'Utterly committed to the job, truly feeling it is of vital importance.' },
    { dice: 6, name: 'Overqualified', description: 'Based on skills and experience, ought to be in a higher or more challenging position.' },
];

export {
  hiredHands,
  environmentTable,
  dispositionTable,
  oligarchyTypeTable,
  servicesTable,
  hiredHelpSizeTable,
  fervencyTable,
  officialsTable,
  officialCompetenceTable,
};