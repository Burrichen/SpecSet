// vanillaPlus.js

// --- DATA DEFINITIONS ---

function getVanillaPlusOrigins() {
    return [
        { dice: 1, name: 'Accidental', description: 'It came about due to a breakdown or stranded caravan.', modifiers: { condition: -2, populationWealth: -1 } },
        { dice: 2, name: 'Business Venture', description: 'Established by a wealthy entrepreneur to monopolize trade.', modifiers: { populationWealth: 2, lawEnforcement: 1 } },
        { dice: 3, name: 'Crossroads', description: 'Intersection of two or more major trade routes.', modifiers: { visitorTraffic: 2, crime: -1 } },
        { dice: 4, name: 'Military Outpost', description: 'Built on the bones of an old fortress. Walls are thick, guards are edgy.', modifiers: { lawEnforcement: 3, fortification: 2, visitorTraffic: -1 } },
        { dice: 5, name: 'No Mans Land', description: 'Neutral parley ground for rival clans.', modifiers: { lawEnforcement: -2, populationWealth: 1, crime: 1 } },
        { dice: 6, name: 'Native Enclave', description: 'Started by locals to trade on their own terms.', modifiers: { disposition: 2 } },
        { dice: 7, name: 'Overnight Stop', description: 'Started as a single longhouse or safe camp.', modifiers: { visitorTraffic: 1 } },
        { dice: 8, name: 'Wilderness Camp', description: 'Originally a seasonal camp for hunters.', modifiers: { condition: -1, farmsAndResources: 2 } },
        { dice: 9, name: 'Religious Pilgrimage', description: 'A shrine appeared nearby.', modifiers: { visitorTraffic: 1 } },
        { dice: 10, name: 'Resource Rush', description: 'Gold or spice found nearby.', modifiers: { populationDensity: 3, crime: -3, populationWealth: -2 } },
        { dice: 11, name: 'Local Landmark', description: 'Built around a specific landmark like a waterfall.', modifiers: { visitorTraffic: 3 } },
        { dice: 12, name: 'Exile\'s End', description: 'Founded by outlaws.', modifiers: { crime: -2, lawEnforcement: -5 } },
    ];
}

function getVanillaPlusSpecialties() {
    return [
        { min: 1, max: 15, name: 'Food & Farming (Broad)', description: 'Region\'s breadbasket.', freeLocation: { category: 'Shop', name: 'Baker (B)' } },
        { min: 16, max: 25, name: 'Livestock Market (Broad)', description: 'Auction hub.', modifiers: { condition: -3 }, freeLocation: { category: 'Shop', name: 'Butcher (B)' } },
        { min: 26, max: 35, name: 'Logging & Timber (Broad)', description: 'River logging.' },
        { min: 36, max: 40, name: 'Brewing & Distilling (Specific)', description: 'Processing local grain.', freeLocations: [{ category: 'Service', name: 'Tavern' }, { category: 'Service', name: 'Inn' }] },
        { min: 41, max: 50, name: 'Mining (Ore) (Broad)', description: 'Extraction of iron/copper.', freeLocation: { category: 'Shop', name: 'Smithy (B)' } },
        { min: 51, max: 58, name: 'Stone & Quarry (Broad)', description: 'Marble or granite cutting.' },
        { min: 59, max: 66, name: 'Maritime / Fishing (Broad)', description: 'Salting fish.', rules: { forceEnvironment: true }, freeLocations: [{ category: 'Shop', name: 'General Store (B)' }, { category: 'Shop', name: 'Cooper (B)' }] },
        { min: 67, max: 74, name: 'Traveler\'s Rest (Broad)', description: 'Dedicated waypoint.', modifiers: { visitorTraffic: 5, populationDensity: -5 }, freeLocations: [{ category: 'Service', name: 'Inn' }, { category: 'Service', name: 'Inn' }, { category: 'Service', name: 'Stable' }] },
        { min: 75, max: 79, name: 'Textiles & Fabrics (Broad)', description: 'Weaving wool or flax.', modifiers: { populationWealth: 1 }, freeLocations: [{ category: 'Shop', name: 'Weaver (B)' }, { category: 'Shop', name: 'Tailor (B)' }] },
        { min: 80, max: 84, name: 'Unscrupulous Contractors (Specific)', description: 'Known for hired help.', freeLocation: { category: 'Service', name: 'Hired Help' } },
        { min: 85, max: 88, name: 'Medicine & Remedy (Specific)', description: 'Grows herbs.', freeLocations: [{ category: 'Shop', name: 'Herbalist (B)' }, { category: 'Service', name: 'Doctor/Apothecary' }] },
        { min: 89, max: 92, name: 'Religious Pilgrimage (Specific)', description: 'Staging ground for a holy site.', modifiers: { crime: -1 }, freeLocation: { category: 'Non-Commercial', name: 'Place of Worship' } },
        { min: 93, max: 96, name: 'Military Surplus (Specific)', description: 'Scavenged gear.', modifiers: { lawEnforcement: 2 }, freeLocations: [{ category: 'Shop', name: 'General Store (B)' }, { category: 'Shop', name: 'Smithy (B)' }] },
        { min: 97, max: 98, name: 'Vice & Gambling (Specific)', description: 'Forbidden games are legal.', modifiers: { crime: 5 }, freeLocation: { category: 'Service', name: 'Tavern' } },
        { min: 99, max: 100, name: 'Ancient Recovery (Specific)', description: 'Built on ruins.', freeLocation: { category: 'Shop', name: 'Magic Shop - Misc. & Curiosities (E)' } },
    ];
}

export function getCurrentPassersByTable() {
    return [
        { min: 1, max: 3, name: 'No-one', description: 'The road is dusty and quiet.' },
        { min: 4, max: 4, name: 'Prisoner Transport', description: 'A heavy, reinforced wagon.' },
        { min: 5, max: 5, name: 'A Circus Troupe', description: 'Performers taking a break.' },
        { min: 6, max: 6, name: 'Refugees', description: 'Families fleeing conflict.' },
        { min: 7, max: 7, name: 'A Mercenary Company', description: 'Soldiers for hire.' },
        { min: 8, max: 8, name: 'A Local Celebrity', description: 'A bard holding court.' },
        { min: 9, max: 9, name: 'A Royal Member', description: 'A high-ranking noble.' },
        { min: 10, max: 10, name: 'An Adventuring Party', description: 'Selling loot.' },
        { min: 11, max: 11, name: 'A Con Artist', description: 'Selling snake oil.' },
        { min: 12, max: 12, name: 'A Construction Crew', description: 'Builders with wagons.' },
        { min: 13, max: 13, name: 'A Criminal Gang', description: 'Tough individuals speaking code.' },
        { min: 14, max: 14, name: 'A Wealthy Aristocrat', description: 'Luxurious carriage.' },
        { min: 15, max: 15, name: 'Troublemakers', description: 'Hooligans.' },
        { min: 16, max: 16, name: 'A Fool', description: 'A solitary jester spouting riddles.' },
        { min: 17, max: 17, name: 'Tax Collector', description: 'Counting ledgers.' },
        { min: 18, max: 18, name: 'Zealot Preacher', description: 'Screaming about the apocalypse.' },
        { min: 19, max: 19, name: 'Courier', description: 'Exhausted rider.' },
        { min: 20, max: 20, name: 'Occultist', description: 'Cloaked figure with a box.' },
    ];
}

// --- NEW: PROPRIETORSHIP ---
export function getProprietorshipTable() {
    return [
        { min: 1, max: 6, name: 'The Founding Family', description: 'Independent ownership. Passed down through generations.', modifiers: { disposition: 2 } },
        { min: 7, max: 9, name: 'Distant Merchant Guild', description: 'A "Franchise." Run by a faceless trading coaster.', modifiers: { populationWealth: 3, crime: 1 } },
        { min: 10, max: 12, name: 'The Local Lord', description: 'Part of a Noble\'s fiefdom. Often treated as a cash cow.' },
        { min: 13, max: 14, name: 'Government / Military', description: 'Strategic assets seized or built by the Crown. Efficiency is key.', modifiers: { lawEnforcement: 3 } },
        { min: 15, max: 16, name: 'Guild Ownership', description: 'Functionally an advertisement for a guild, big or small.', modifiers: { populationWealth: 1 } },
        { min: 17, max: 18, name: 'Shadow Syndicate', description: 'A Crime Family holds the deed. Money laundering asset.', modifiers: { lawEnforcement: -3 } },
        { min: 19, max: 19, name: 'Debtors\' Claim', description: 'Original owners bankrupt; owned by a bank or collection agency.', modifiers: { condition: -5, disposition: -5 } },
        { min: 20, max: 20, name: 'No Legal Claim', description: 'Squatters, exiles, or frontiersmen built on unmapped land.', modifiers: { crime: 3 } },
    ];
}

// --- NEW: LEADERSHIP (REPLACEMENT) ---
export function getExpandedLeadershipTable() {
    return [
        { dice: 1, min: 1, max: 6, name: 'The Proprietor', description: 'The owner is here, behind the counter. A hands-on boss.', rules: { requireProprietorship: ['The Founding Family', 'Debtors\' Claim'] } }, // Logic note: The image says "Only valid if 1-6 or 19".
        { dice: 2, min: 7, max: 10, name: 'The Appointed Factor', description: 'A hired manager. Often stressed and overworked.' },
        { dice: 3, min: 11, max: 12, name: 'The Town Elders', description: 'A loose council of the 3-5 oldest/wealthiest shopkeepers.' },
        { dice: 4, min: 13, max: 14, name: 'The Sheriff / Marshal', description: 'Martial Law lite. The only authority respected is the sword.', modifiers: { lawEnforcement: 2 } },
        { dice: 5, min: 15, max: 15, name: 'The Big Man', description: 'Not legally in charge, but the biggest bully/gang leader in town.', modifiers: { crime: 3 } },
        { dice: 6, min: 16, max: 16, name: 'The Vicar / Priest', description: 'A religious figure guiding the town with moral strictures.', modifiers: { disposition: -1 } },
        { dice: 7, min: 17, max: 18, name: 'Rotational / Lottery', description: 'No one wants the job. Every season a different resident is forced to be Mayor.', modifiers: { lawEnforcement: -1, condition: -2 } },
        { dice: 8, min: 19, max: 19, name: 'The Proxy', description: 'A puppet ruler (e.g., child heir) manipulated by a whisperer.' },
        { dice: 9, min: 20, max: 20, name: 'Other', description: 'Bizarre aberration. Golem, Spirit, or enchantment programmed to maintain order.' },
    ];
}

// --- HANDLER ---
export function handleVanillaPlus(table, type, step) {
    // Trading Post Logic
    if (type === 'Trading Post') {
        if (step === 'origin') return getVanillaPlusOrigins();
        if (step === 'specialty') return getVanillaPlusSpecialties();
        
        // NEW STEPS
        if (step === 'proprietorship') return getProprietorshipTable();
        if (step === 'leadership') return getExpandedLeadershipTable();

        if (step === 'recentHistory') return getCurrentPassersByTable();
        if (step === 'currentEvent') return null; 
    }

    return table;
}