// ModeManager.js

/**
 * Intercepts a data table and modifies it based on the selected generation mode.
 * 
 * @param {Array} originalTable - The source table from the data files.
 * @param {string} mode - The current mode ('Vanilla', 'Vanilla +', 'Kurovia').
 * @param {string} settlementType - The type of settlement (e.g., 'Town', 'City').
 * @param {string} stepKey - The specific step being processed (e.g., 'origin', 'specialty').
 * @returns {Array} - The modified table or the original if no changes apply.
 */
export function getTableForMode(originalTable, mode, settlementType, stepKey) {
    // 1. Safety checks: If Vanilla or no table provided, return immediately.
    if (!originalTable || mode === 'Vanilla') return originalTable;

    // 2. Create a shallow copy to avoid mutating the original import
    let modifiedTable = [...originalTable];

    // 3. Routing based on Mode
    if (mode === 'Vanilla +') {
        modifiedTable = handleVanillaPlus(modifiedTable, settlementType, stepKey);
    } else if (mode === 'Kurovia') {
        modifiedTable = handleKurovia(modifiedTable, settlementType, stepKey);
    }

    return modifiedTable;
}

// --- VANILLA + LOGIC ---
// Focus: Expanding existing tables, adding more variety, tweaking probabilities.
function handleVanillaPlus(table, type, step) {
    
    // Example: Add a new Origin to Towns
    if (type === 'Town' && step === 'origin') {
        // We use a high dice number to ensure it gets picked if we aren't strictly strictly rolling d20
        // OR if you are using the auto-roller that calculates die size based on array length.
        table.push({ 
            dice: table.length + 1, 
            name: 'Vanilla+ Exclusive: Meteor Site', 
            description: 'The town was built within the crater of a fallen star. Starmetal is a common trade good here.' 
        });
    }

    // Example: Add a new Specialty to Villages
    if (type === 'Village' && step === 'specialty') {
        table.push({
            dice: table.length + 1,
            name: 'Vanilla+ Exclusive: Monster Taming',
            description: 'The villagers have a unique bond with a specific type of local beast.'
        });
    }

    return table;
}

// --- KUROVIA LOGIC ---
// Focus: Specific setting flavor, overwriting generic descriptions with lore-specific ones.
function handleKurovia(table, type, step) {

    // Example: Trading Post Origins in Kurovia are darker/military focused
    if (type === 'Trading Post' && step === 'origin') {
        return table.map(item => {
            if (item.name === 'Military Outpost') {
                return { 
                    ...item, 
                    name: 'Kurovian Bastion Remnant',
                    description: 'Built on the bones of an old Kurovian border fort. The cellars are filled with old war supplies.' 
                };
            }
            return item;
        });
    }

    // Example: Changing Leadership styles in Kurovia
    if (step === 'leadership') {
        // Remove 'Anarcho-Syndicalist Commune' as it doesn't fit the lore
        table = table.filter(item => !item.name.includes('Anarcho-Syndicalist'));
        
        // Add 'Iron Magistrate'
        table.push({
            min: 100, max: 100, // Hijacking the slot usually reserved for the Commune
            name: 'Iron Magistrate',
            description: 'A ruthless judge appointed by the central Kurovian authority rules with absolute power.'
        });
    }

    return table;
}