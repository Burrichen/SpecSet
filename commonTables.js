// commonTables.js

const environmentTable = [
    { dice: 1, name: 'Arctic', description: 'The settlement is in a cold, snowy region.' },
    { dice: 2, name: 'Coastal', description: 'The settlement is near a large body of saltwater.' },
    { dice: 3, name: 'Desert', description: 'The settlement is in a dry, arid region.' },
    { dice: 4, name: 'Forest', description: 'The settlement is surrounded by dense woods.' },
    { dice: 5, name: 'Jungle', description: 'The settlement is in a hot, humid, and overgrown region.' },
    { dice: 6, name: 'Mountain', description: 'The settlement is in a high-altitude, rocky area.' },
    { dice: 7, name: 'Plains', description: 'The settlement is on a flat, grassy expanse.' },
    { dice: 8, name: 'River', description: 'The settlement is located on the banks of a river.' },
    { dice: 9, name: 'Swamp', description: 'The settlement is in a marshy, waterlogged area.' },
    { dice: 10, name: 'Underground', description: 'The settlement is located beneath the earth\'s surface.' },
];

const dispositionTable = [
    { min: 1, max: 2, name: 'Hostile', description: 'The locals are openly aggressive towards outsiders.' },
    { min: 3, max: 6, name: 'Unfriendly', description: 'The locals are suspicious and unwelcoming.' },
    { min: 7, max: 14, name: 'Neutral', description: 'The locals are indifferent to strangers.' },
    { min: 15, max: 18, name: 'Friendly', description: 'The locals are welcoming and helpful to visitors.' },
    { min: 19, max: 20, name: 'Open', description: 'The locals are extremely friendly and eager to interact with newcomers.' },
];

const hiredHelpSizeTable = [
    { min: 1, max: 3, name: 'Small Group (1-3)' },
    { min: 4, max: 7, name: 'Medium Group (4-6)' },
    { min: 8, max: 10, name: 'Large Group (7-10)' },
    { min: 11, max: 12, name: 'Small Company (11-20)' },
];

const servicesTable = [
    { min: 1, max: 3, name: 'Barber', description: 'Offers haircuts, shaves, and minor medical procedures.' },
    { min: 4, max: 6, name: 'Bathhouse', description: 'A public place for bathing and socializing.' },
    { min: 7, max: 10, name: 'Doctor/Apothecary', description: 'Provides medical care and sells remedies.' },
    { min: 11, max: 15, name: 'House of Leisure', description: 'An establishment for entertainment and relaxation.' },
    { min: 16, max: 25, name: 'Inn', description: 'Provides lodging for travelers.' },
    { min: 26, max: 30, name: 'Club', description: 'A private establishment for members.' },
    { min: 31, max: 35, name: 'Soothsayer', description: 'Offers glimpses into the future.' },
    { min: 36, max: 45, name: 'Stable', description: 'Boards and cares for horses.' },
    { min: 46, max: 60, name: 'Tavern', description: 'A place to drink and socialize.' },
    { min: 61, max: 100, name: 'Hired Help', description: 'A place to find mercenaries or laborers for hire.' }
];

const oligarchyTypeTable = [
    { dice: 1, name: 'Wealthy Elite', description: 'The richest members of the community rule.' },
    { dice: 2, name: 'Elders', description: 'The oldest and most respected members lead.' },
    { dice: 3, name: 'Merchants', description: 'A council of the most successful merchants holds power.' },
    { dice: 4, name: 'Warlords', description: 'The strongest military leaders control the settlement.' },
    { dice: 5, name: 'Priests (Theocracy)', description: 'Religious leaders govern the community.' },
    { dice: 6, name: 'Mages', description: 'A cabal of powerful magic-users is in charge.' }
];

const fervencyTable = [
    { min: 1, max: 3, name: 'Lax', description: 'Faith is a personal matter, not openly displayed.' },
    { min: 4, max: 10, name: 'Steady', description: 'Most are moderately religious and attend services regularly.' },
    { min: 11, max: 15, name: 'Fervent', description: 'The community is deeply religious, with faith playing a major role in daily life.' },
    { min: 16, max: 18, name: 'Fanatical', description: 'The populace is zealous, possibly to an extreme.' },
    { min: 19, max: 20, name: 'Divided', description: 'There are strong opposing beliefs within the community.' },
];

const officialsTable = [
    { dice: 1, name: 'Adviser', description: 'Second in command of the settlement. Can be an official, or unofficial, position.' },
    { dice: 2, name: 'Ambassador', description: 'Regularly acts as a representative for the settlement/nation when traveling abroad.' },
    { dice: 3, name: 'Catchpole', description: 'Catches and brings in debtors.' },
    { dice: 4, name: 'Champion', description: 'Ready to stand in for the leadership for any martial matters, either ceremonially or officially.' },
    { dice: 5, name: 'Clerk', description: 'Recordkeeper for the settlement.' },
    { dice: 6, name: 'Exchequer', description: 'Responsible for taxes.' },
    { dice: 7, name: 'Guildmaster', description: 'Oversees one of the official (or underground) guilds, or factions, within the settlement.' },
    { dice: 8, name: 'Herald', description: 'Responsible for disseminating official edicts, and other news, to the general populace.' },
    { dice: 9, name: 'High Priest/Druid', description: 'The primary representative of the faithful to the leadership.' },
    { dice: 10, name: 'High Mage', description: 'The representative of the practitioners of arcane arts to the leadership.' },
    { dice: 11, name: 'Jailer', description: 'In charge of confining prisoners.' },
    { dice: 12, name: 'Judge', description: 'Decision-maker in legal matters.' },
    { dice: 13, name: 'Liner', description: 'Determines property boundaries.' },
    { dice: 14, name: 'Master of Intelligence', description: 'Responsible for seeking and utilizing information vital for security.' },
    { dice: 15, name: 'Master of Revels', description: 'Lead organizer of festivals and special events.' },
    { dice: 16, name: 'Master of Stores', description: 'Oversees the stores of supplies, such as grain or building materials.' },
    { dice: 17, name: 'Master of Trade', description: 'Responsible for the management of imports and exports.' },
    { dice: 18, name: 'Master of the Treasury', description: 'Responsible for expenditures and paying contracts and debts.' },
    { dice: 19, name: 'Master of the Wild', description: 'Surveys the surrounding areas, looking for monsters or other threats.' },
    { dice: 20, name: 'Roadwarden/Dockwarden', description: 'In charge of some, or all, of the transportation systems.' },
];

const officialCompetenceTable = [
    { min: 1, max: 1, name: 'Corrupt', description: 'Taking advantage of the position for personal gain.' },
    { min: 2, max: 3, name: 'Incompetent', description: 'Doesn’t truly understand how to execute the position.' },
    { min: 4, max: 5, name: 'Committed', description: 'Utterly committed to the job, truly feeling it is of vital importance.' },
    { min: 6, max: 6, name: 'Overqualified', description: 'Based on skills and experience, ought to be in a higher, or more challenging, position.' },
];

export {
    environmentTable,
    dispositionTable,
    hiredHelpSizeTable,
    servicesTable,
    oligarchyTypeTable,
    fervencyTable,
    officialsTable,
    officialCompetenceTable,
};