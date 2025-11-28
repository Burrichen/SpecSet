import chalk from 'chalk';
import { handleVanillaPlus } from './vanillaPlus.js';
import { handleKurovia } from './kurovia.js';

export function getTableForMode(originalTable, mode, settlementType, stepKey) {
    // 1. Handling New Steps that don't exist in Vanilla
    if (stepKey === 'proprietorship') {
        if (mode === 'Vanilla') return null; // Skip this step in Vanilla
        // If Vanilla+ or Kurovia, we proceed to the handlers below
    }

    // 2. Safety Checks
    if (!originalTable && stepKey !== 'proprietorship') { // allow prop to pass if table is empty initially
         return null;
    }
    
    if (!mode || mode === 'Vanilla') {
        return originalTable;
    }

    let modifiedTable = [...originalTable];
    const cleanMode = mode.trim();

    // 3. Routing
    if (cleanMode === 'Vanilla +') {
        modifiedTable = handleVanillaPlus(modifiedTable, settlementType, stepKey);
    } 
    else if (cleanMode === 'Kurovia') {
        modifiedTable = handleKurovia(modifiedTable, settlementType, stepKey);
    }
    
    return modifiedTable;
}