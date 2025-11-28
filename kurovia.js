// kurovia.js
import { getCurrentPassersByTable } from './vanillaPlus.js';

export function handleKurovia(table, type, step) {
    
    if (type === 'Trading Post') {
        // Replaces Recent History with Passers-by (Same as Vanilla+)
        if (step === 'recentHistory') {
            return getCurrentPassersByTable();
        }

        // Disable generic Events (Same as Vanilla+)
        if (step === 'currentEvent') {
            return null;
        }
    }

    return table;
}