// SetGen.js

import fs from 'fs/promises';
import inquirer from 'inquirer';
import chalk from 'chalk';
import { tradingPostOrigins, tradingPostSpecialties, foodAndDrink, tradingPostAges, tradingPostConditions, visitorTrafficTable, tradingPostSizeTable, residentPopulationTable, lawEnforcementTable, leadershipTable, populationWealthTable, crimeTable, shopLocationsData, shopsTable, serviceLocationsData, placeOfWorshipDecisionTable, placeOfWorshipSizeTable, recentHistoryTable, eventsTable, opportunitiesTable, dangerLevelTable, dangerTypeTable } from './tradingpost.js';
import { hiredHands, environmentTable, dispositionTable, oligarchyTypeTable, servicesTable, hiredHelpSizeTable, fervencyTable, officialsTable, officialCompetenceTable } from './commonTables.js';
import { villageAges, hardshipLikelihoodTable, hardshipTypeTable, hardshipOutcomeTable, villageSizeTable, villageConditionTable, villageSpecialtyTable, villageResourceTable, villageHistoryTable, villagePopulationDensityTable, villageLawEnforcementTable, villageLeadershipTable, villagePopulationWealthTable, villageCrimeTable, placesOfWorshipCountData, villagePlaceOfWorshipSizeTable, gatheringPlacesCountData, gatheringPlacesTable, otherLocationsCountData, otherLocationsTable, villageEventsTable, politicalRumorsTable, villageOpportunitiesTable, villageDangerLevelTable, villageDangerTypeTable } from './villages.js';
import { townOriginsTable, townPriorityTable, magicShopSubTable, industrySubTable, townSpecialtyTable, townAgeTable, townSizeTable, townConditionTable, townProsperityTable, marketSquareTable, vendorStallAcquisitionTable, overflowTable, fortificationTable, townPopulationDensityTable, populationOverflowTable, farmsAndResourcesCountData, farmsAndResourcesTable, townVisitorTrafficTable, nightActivityTable, townLeadershipTable, townLawEnforcementTable, townPopulationWealthTable, townCrimeTable, nonCommercialCountData, nonCommercialLocationTypeTable, placesOfEducationTable, townPlacesOfGatheringTable, placesOfGovernmentTable, townPlaceOfWorshipSizeTable, townFervencyTable, alignmentOfTheFaithTable, commercialCountData, shopOrServiceTable, townRecentHistoryTable, marketDayEventsTable } from './town.js';
import { cityOriginsTable, cityPriorityTable, cityAgeTable, citySizeTable, outsideTheCityCountData, outsideTheCityTable, stewardshipTable, generalConditionTable, cityFortificationTable, cityMarketSquareTable, cityVendorStallAcquisitionTable, cityMerchantOverflowTable, undergroundPassagesTable, cityPopulationDensityTable, cityPopulationWealthTable, cityVisitorTrafficTable, cityNightActivityTable, cityLeadershipTable, cityLawEnforcementTable, cityGeneralCrimeTable, cityOrganizedCrimeTable, numberOfDistrictsTable, districtTypeTable, districtConditionTable, districtConditionCrimeModifiers, districtEntryTable, districtCrimeTable, crimeDegreesData, housingTable, districtNotableLocationsTable } from './city.js';

// --- HELPER FUNCTIONS ---

function rollDice(count, size) {
    let total = 0;
    for (let i = 0; i < count; i++) {
        total += Math.floor(Math.random() * size) + 1;
    }
    return total;
}

function rollOnTable(table, diceSize) {
    const dSize = diceSize || (table[0].min !== undefined ? table[table.length - 1].max : table.length);
    const roll = rollDice(1, dSize);

    if (table[0].min !== undefined) {
        return table.find(item => roll >= item.min && roll <= item.max);
    } else {
        return table.find(item => roll === item.dice);
    }
}

function applyModifierAndClamp(baseValue, modifier, min, max) {
  let finalValue = baseValue + modifier;
  if (finalValue < min) finalValue = min;
  if (finalValue > max) finalValue = max;
  return finalValue;
}

async function getHiredHelpSize(isAutoRolling) {
    if (isAutoRolling) return rollHiredHelpSize();
    console.log(chalk.bold.cyan(`\nWhat is the size of this hired help group?`));
    const { size } = await inquirer.prompt([{
        type: 'list', name: 'size', message: 'Select Hired Help Size:',
        choices: hiredHelpSizeTable.map(item => ({
            name: `${chalk.white(`[${item.min}-${item.max}]`)} ${chalk.bold(item.name)}`,
            value: item
        })),
        loop: false,
    }]);
    return size;
}

function rollHiredHelpSize() {
    const roll = rollDice(1, 12);
    return hiredHelpSizeTable.find(item => roll >= item.min && roll <= item.max);
}

function formatKeyName(key) {
    return key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim();
}

// --- NAME GENERATION ---
const namePrefixes = ['Green', 'Far', 'Clear', 'Red', 'Black', 'White', 'Silver', 'Gold', 'Iron', 'Stone', 'Oak', 'Pine', 'Wolf', 'Eagle', 'Sun', 'Moon', 'Star', 'North', 'South', 'High', 'Low', 'Bright', 'Still', 'Cold'];
const nameSuffixes = ['water', 'view', 'crest', 'hollow', 'dale', 'moor', 'hill', 'pass', 'ridge', 'town', 'burg', 'stead', 'ham', 'wick', 'port', 'watch', 'wood', 'field', 'grove', 'marsh', 'bridge', 'ford', 'brook', 'well'];

function generateSettlementName() {
    const prefix = namePrefixes[Math.floor(Math.random() * namePrefixes.length)];
    let suffix = nameSuffixes[Math.floor(Math.random() * nameSuffixes.length)];
    while (prefix.toLowerCase() === suffix.toLowerCase()) {
        suffix = nameSuffixes[Math.floor(Math.random() * nameSuffixes.length)];
    }
    return prefix + suffix;
}

// --- DATA ---
const settlementTypes = [
  { name: 'Trading Post', value: 'Trading Post' },
  { name: 'Village', value: 'Village' },
  { name: 'Town', value: 'Town' },
  { name: 'City', value: 'City' },
  { name: 'Capital', value: 'Capital' },
  { name: 'Fortress', value: 'Fortress' },
];

// --- THE "RECIPE BOOK" ---
const settlementPaths = {
    'Trading Post': [
        // ... (Trading Post path is unchanged and omitted for brevity)
    ],
    'Village': [
        // ... (Village path is unchanged and omitted for brevity)
    ],
    'Town': [
        { key: 'origin', title: "its origin", prompt: "Select the town's origin:", table: townOriginsTable, type: 'CHOICE' },
        { key: 'priority', title: "its priority", prompt: "Select the town's priority:", table: townPriorityTable, type: 'CHOICE' },
        { key: 'specialty', title: "its specialty", prompt: "Select the town's specialty:", table: townSpecialtyTable, type: 'CHOICE' },
        { key: 'age', title: "its age", prompt: "Select the town's age:", table: townAgeTable, type: 'CHOICE' },
        { key: 'size', title: "its size", table: townSizeTable, type: 'DERIVED', modifierKey: 'size' },
        { key: 'condition', title: "its condition", table: townConditionTable, type: 'DERIVED', modifierKey: 'condition' },
        { key: 'environment', title: "its surrounding environment", prompt: "Select an environment:", table: environmentTable, type: 'CHOICE', condition: (choices) => !choices.environment },
        { key: 'prosperity', title: "its prosperity", table: townProsperityTable, type: 'DERIVED', modifierKey: 'prosperity' },
        { key: 'marketSquare', title: 'its market square', table: marketSquareTable, type: 'DERIVED', modifierKey: 'marketSquare' },
        { key: 'vendorStallAcquisition', title: 'how vendor stalls are acquired', prompt: 'Select the vendor stall acquisition method:', table: vendorStallAcquisitionTable, type: 'CHOICE' },
        { key: 'overflow', title: 'how excess vendors are handled', prompt: 'Select the merchant overflow rule:', table: overflowTable, type: 'CHOICE' },
        { key: 'fortification', title: 'its fortifications', table: fortificationTable, type: 'DERIVED', modifierKey: 'fortification' },
        { key: 'break1', type: 'BREAKPOINT', stepName: "Step 1: Core Details" },
        { key: 'populationDensity', title: 'its population density', table: townPopulationDensityTable, type: 'DERIVED', modifierKey: 'populationDensity' },
        { key: 'populationOverflow', title: 'its population overflow', table: populationOverflowTable, type: 'DERIVED', modifierKey: 'populationOverflow' },
        { key: 'farmsAndResources', title: 'its farms and resources', type: 'FARMS_AND_RESOURCES', countSource: farmsAndResourcesCountData },
        { key: 'visitorTraffic', title: 'its visitor traffic', table: townVisitorTrafficTable, type: 'DERIVED', modifierKey: 'visitorTraffic' },
        { key: 'nightActivity', title: 'its night activity', table: nightActivityTable, type: 'DERIVED', modifierKey: 'nightActivity' },
        { key: 'disposition', title: 'the disposition of the locals', table: dispositionTable, type: 'DERIVED', modifierKey: 'disposition' },
        { key: 'leadership', title: 'its leadership', prompt: "Select the town's leadership:", table: townLeadershipTable, type: 'CHOICE' },
        { key: 'lawEnforcement', title: 'its law enforcement', table: townLawEnforcementTable, type: 'DERIVED', modifierKey: 'lawEnforcement' },
        { key: 'populationWealth', title: 'its population wealth', table: townPopulationWealthTable, type: 'DERIVED', modifierKey: 'populationWealth' },
        { key: 'crime', title: 'its crime level', table: townCrimeTable, type: 'DERIVED', modifierKey: 'crime' },
        { key: 'break2', type: 'BREAKPOINT', stepName: "Step 2: Community" },
        { key: 'nonCommercialTypes', title: 'its non-commercial location types', type: 'NON_COMMERCIAL_LOCATIONS', countSource: nonCommercialCountData },
        { key: 'nonCommercialLocations', title: 'its specific non-commercial locations', type: 'FLESH_OUT_NON_COMMERCIAL' },
        { key: 'commercialLocations', title: 'its commercial locations', type: 'COMMERCIAL_LOCATIONS', countSource: commercialCountData },
        { key: 'break3', type: 'BREAKPOINT', stepName: "Step 3: Points of Interest" },
        { key: 'recentHistory', title: 'its recent history', prompt: 'Select a recent history event:', table: townRecentHistoryTable, type: 'CHOICE' },
        { key: 'noteworthyOfficial', title: 'a noteworthy official', type: 'NOTEWORTHY_OFFICIAL' },
        { key: 'marketDayEvent', title: 'a market day event', prompt: 'Select a market day event:', table: marketDayEventsTable, type: 'CHOICE' },
    ],
    'City': [
        { key: 'origin', title: "its origin", prompt: "Select the city's origin:", table: cityOriginsTable, type: 'CHOICE' },
        { key: 'priority', title: "its priority", prompt: "Select the city's priority:", table: cityPriorityTable, type: 'CHOICE' },
        { key: 'age', title: "its age", prompt: "Select the city's age:", table: cityAgeTable, type: 'CHOICE' },
        { key: 'size', title: "its size", prompt: "Select the city's size:", table: citySizeTable, type: 'CHOICE' },
        { key: 'outsideTheCity', title: 'features outside the city', type: 'OUTSIDE_THE_CITY', countSource: outsideTheCityCountData, table: outsideTheCityTable },
        { key: 'stewardship', title: "its stewardship", prompt: "Select the city's stewardship:", table: stewardshipTable, type: 'CHOICE' },
        { key: 'generalCondition', title: "its general condition", table: generalConditionTable, type: 'DERIVED', modifierKey: 'condition' },
        { key: 'environment', title: "its surrounding environment", prompt: "Select an environment:", table: environmentTable, type: 'CHOICE', condition: (choices) => !choices.environment },
        { key: 'fortification', title: 'its fortifications', table: cityFortificationTable, type: 'DERIVED', modifierKey: 'fortification' },
        { key: 'marketSquare', title: 'its market square', table: cityMarketSquareTable, type: 'DERIVED', modifierKey: 'marketSquare' },
        { key: 'vendorStallAcquisition', title: 'how vendor stalls are acquired', prompt: 'Select the vendor stall acquisition method:', table: cityVendorStallAcquisitionTable, type: 'CHOICE' },
        { key: 'merchantOverflow', title: 'how excess vendors are handled', prompt: 'Select the merchant overflow rule:', table: cityMerchantOverflowTable, type: 'CHOICE' },
        { key: 'undergroundPassages', title: 'its underground passages', prompt: 'Select the nature of its underground passages:', table: undergroundPassagesTable, type: 'CHOICE' },
        { key: 'break1', type: 'BREAKPOINT', stepName: "Step 1: Core Details" },
        { key: 'populationDensity', title: 'its population density', table: cityPopulationDensityTable, type: 'DERIVED', modifierKey: 'populationDensity' },
        { key: 'populationWealth', title: 'its population wealth', table: cityPopulationWealthTable, type: 'DERIVED', modifierKey: 'populationWealth' },
        { key: 'visitorTraffic', title: 'its visitor traffic', table: cityVisitorTrafficTable, type: 'DERIVED', modifierKey: 'visitorTraffic' },
        { key: 'disposition', title: 'the disposition of the locals', table: dispositionTable, type: 'DERIVED', modifierKey: 'disposition' },
        { key: 'nightActivity', title: 'its night activity', table: cityNightActivityTable, type: 'DERIVED', modifierKey: 'nightActivity' },
        { key: 'leadership', title: 'its leadership', prompt: "Select the city's leadership:", table: cityLeadershipTable, type: 'CHOICE' },
        { key: 'lawEnforcement', title: 'its law enforcement', table: cityLawEnforcementTable, type: 'DERIVED', modifierKey: 'lawEnforcement' },
        { key: 'generalCrime', title: 'its general crime level', table: cityGeneralCrimeTable, type: 'DERIVED', modifierKey: 'crime' },
        { key: 'organizedCrime', title: 'its organized crime presence', prompt: 'Select the nature of organized crime:', table: cityOrganizedCrimeTable, type: 'CHOICE', condition: (choices) => choices.leadership?.rules?.crime?.forceOrganizedCrime || choices.generalCrime?.rules?.crime?.hasOrganizedCrime },
        { key: 'break2', type: 'BREAKPOINT', stepName: "Step 2: Community" },
        { key: 'districts', title: 'its districts', type: 'DISTRICTS' },
        { key: 'break3', type: 'BREAKPOINT', stepName: "Step 3: Districts" },
    ],
};

// --- STEP PROCESSORS ---
const stepProcessors = {
    CHOICE: async (step, { choices, isAutoRolling, freeLocations }) => {
        const rules = choices.priority?.rules?.[step.key];
        const diceSize = rules?.diceOverride;

        let choice;
        do {
            choice = isAutoRolling
                ? rollOnTable(step.table, diceSize)
                : (await inquirer.prompt([{
                    type: 'list', name: 'choice', message: step.prompt,
                    choices: step.table.map(item => {
                        const isDisabled = (diceSize && item.dice > diceSize) || (rules?.rerollRange && (item.min >= rules.rerollRange[0] && item.min <= rules.rerollRange[1]));
                        return {
                            name: `${chalk.white(`[${item.dice || `${item.min}-${item.max}`}]`)} ${chalk.bold(item.name)}: ${item.description || ''}`,
                            value: item,
                            disabled: isDisabled ? 'Disabled by Priority rule' : false
                        };
                    }),
                    loop: false, pageSize: 15,
                }])).choice;
            
            if (choice.rules?.farmsAndResources && isAutoRolling) {
                const subRoll = rollDice(1, 10);
                if (subRoll >= choice.rules.farmsAndResources.rerollRange[0] && subRoll <= choice.rules.farmsAndResources.rerollRange[1]) {
                    console.log(chalk.yellow(`      -> Rolled "${choice.name}" but got a ${subRoll} on the sub-roll. Rerolling specialty...`));
                    continue; 
                }
            }
            if (rules?.rerollRange && isAutoRolling) {
                const rollValue = choice.min || choice.dice;
                if(rollValue >= rules.rerollRange[0] && rollValue <= rules.rerollRange[1]) {
                    console.log(chalk.yellow(`      -> Rolled "${choice.name}" which is in the reroll range. Rerolling...`));
                    continue;
                }
            }
            break; 
        } while (true);
        
        console.log(`  ${chalk.magenta('Result:')} ${chalk.white(choice.name)}`);
        
        if (choice.rules?.farmsAndResources && !isAutoRolling) {
             console.log(chalk.yellow(`      -> NOTE: This specialty requires a reroll on the Farms & Resources table if the result is 1-8.`));
        }

        if (choice.name === 'Port') {
            const roll = rollDice(1, 6);
            const envName = (roll <= 3) ? 'Coastal' : 'River';
            const environmentChoice = environmentTable.find(e => e.name === envName);
            if (environmentChoice) {
                choices.environment = environmentChoice;
                console.log(chalk.yellow(`      -> Port origin automatically sets the environment to: ${chalk.white(envName)}`));
            }
        }

        if (choice.subTable === 'oligarchy') {
            console.log(chalk.cyan(`    -> An Oligarchy has been established. Determining type...`));
            const subChoice = isAutoRolling ? rollOnTable(oligarchyTypeTable) : (await inquirer.prompt([{
                type: 'list', name: 'choice', message: 'Select the type of Oligarchy:',
                choices: oligarchyTypeTable.map(item => ({ name: `[${item.dice}] ${chalk.bold(item.name)}`, value: item })),
                loop: false
            }])).choice;
            choice.subChoice = subChoice;
            console.log(`      ${chalk.magenta('Oligarchy Type:')} ${chalk.white(subChoice.name)}`);
            if (subChoice.name === 'Priests (Theocracy)') {
                 freeLocations.push({ category: 'Non-Commercial', name: 'Place of Worship' });
                 console.log(chalk.yellow(`      -> Gained a free location: ${chalk.white('Place of Worship')}`));
            }
        }

        if (choice.freeLocation) {
            if (choice.freeLocation.subTable) {
                const subRoll = rollOnTable(choice.freeLocation.subTable, 6);
                freeLocations.push({ category: choice.freeLocation.category, name: subRoll.name });
                 console.log(chalk.yellow(`      -> Gained a free location: ${chalk.white(subRoll.name)}`));
            } else {
                freeLocations.push(choice.freeLocation);
                console.log(chalk.yellow(`      -> Gained a free location: ${chalk.white(choice.freeLocation.name)}`));
            }
        }

        return { key: step.key, value: choice };
    },

    HIRED_HELP_SIZE_CHOICE: async (step, { isAutoRolling }) => {
        const choice = await getHiredHelpSize(isAutoRolling);
        console.log(`  ${chalk.magenta('Result:')} ${chalk.white(choice.name)}`);
        return { key: step.key, value: choice };
    },

    DERIVED: async (step, { choices, modifiers, isAutoRolling }) => {
        const modifier = (modifiers[step.modifierKey] || 0) + (modifiers[`${step.modifierKey}Penalty`] || 0);
        
        if (isAutoRolling) {
            let baseRoll;
            let finalScore;
            const rules = choices.priority?.rules?.[step.key];
            
            do {
                baseRoll = rollDice(1, step.table[step.table.length - 1].max);
                finalScore = applyModifierAndClamp(baseRoll, modifier, 1, step.table[step.table.length - 1].max);
            } while (rules?.rerollRange && (finalScore >= rules.rerollRange[0] && finalScore <= rules.rerollRange[1]));
            
            const result = step.table.find(item => finalScore >= item.min && finalScore <= item.max);

            if (result) {
                console.log(`  ${chalk.magenta('Result:')} ${chalk.white(result.name)}`);
                console.log(`  ${chalk.gray(`(Rolled ${baseRoll}, Modifier ${modifier >= 0 ? '+' : ''}${modifier}, Final ${finalScore})`)}`);
                const rollDetail = { base: baseRoll, modifier, final: finalScore };
                return { key: step.key, value: result, rollDetail };
            }
        } else {
            console.log(chalk.gray(`  (Current modifier for this roll is ${modifier >= 0 ? '+' : ''}${modifier})`));
            const rules = choices.priority?.rules?.[step.key];
            if (rules?.rerollRange) {
                console.log(chalk.yellow(`      -> The town's Priority requires rerolling results from ${rules.rerollRange[0]}-${rules.rerollRange[1]} on this table.`));
            }
            const answer = await inquirer.prompt([{
                type: 'list', name: 'choice', message: `Select ${step.title}:`,
                choices: step.table.map(item => ({
                    name: `[${item.min}-${item.max}] ${chalk.bold(item.name)}: ${item.description}`,
                    value: item,
                })),
                loop: false,
            }]);
            const choice = answer.choice;
            console.log(`  ${chalk.magenta('Result:')} ${chalk.white(choice.name)}`);
            return { key: step.key, value: choice };
        }
        return null;
    },

    HARDSHIP: async (step, { modifiers, isAutoRolling }) => {
        let likelihood;
        if (isAutoRolling) {
            const baseRoll = rollDice(1, 20);
            const modifier = modifiers.hardshipLikelihood || 0;
            const finalScore = applyModifierAndClamp(baseRoll, modifier, 1, 20);
            likelihood = hardshipLikelihoodTable.find(item => finalScore >= item.min && finalScore <= item.max);
            console.log(`  ${chalk.magenta('Likelihood:')} ${chalk.white(likelihood.name)}`);
            console.log(`  ${chalk.gray(`(Rolled ${baseRoll}, Modifier ${modifier >= 0 ? '+' : ''}${modifier}, Final ${finalScore})`)}`);
        } else {
            const modifier = modifiers.hardshipLikelihood || 0;
            console.log(chalk.gray(`  (Current modifier for this roll is ${modifier >= 0 ? '+' : ''}${modifier})`));
            const answer = await inquirer.prompt([{
                type: 'list', name: 'choice', message: step.prompt,
                choices: hardshipLikelihoodTable.map(item => ({
                    name: `[${item.min}-${item.max}] ${chalk.bold(item.name)}: ${item.description}`,
                    value: item,
                })),
                loop: false,
            }]);
            likelihood = answer.choice;
            console.log(`  ${chalk.magenta('Likelihood:')} ${chalk.white(likelihood.name)}`);
        }
        
        if (likelihood.count === 0) {
            return { key: step.key, value: [{ type: likelihood, outcomes: [] }] };
        }

        const hardships = [];
        for (let i = 0; i < likelihood.count; i++) {
            console.log(chalk.cyan(`\n    -> Determining Hardship #${i + 1}...`));
            
            let hardshipType;
            if (isAutoRolling) {
                hardshipType = rollOnTable(hardshipTypeTable);
            } else {
                const answer = await inquirer.prompt([{
                    type: 'list', name: 'choice', message: `Select the type for Hardship #${i + 1}:`,
                    choices: hardshipTypeTable.map(item => ({
                        name: `[${item.dice}] ${chalk.bold(item.name)}: ${item.description}`,
                        value: item,
                    })),
                    loop: false,
                }]);
                hardshipType = answer.choice;
            }
            console.log(`      ${chalk.magenta('Type:')} ${chalk.white(hardshipType.name)}`);

            const outcomes = [];
            for (const attribute of hardshipType.modifiedAttributes) {
                let outcome;
                if (isAutoRolling) {
                    outcome = rollOnTable(hardshipOutcomeTable);
                } else {
                     const answer = await inquirer.prompt([{
                        type: 'list', name: 'choice', message: `Select the outcome for the '${formatKeyName(attribute)}' attribute:`,
                        choices: hardshipOutcomeTable.map(item => ({
                            name: `[${item.min}-${item.max}] ${chalk.bold(item.name)} (${item.modifier}): ${item.description}`,
                            value: item,
                        })),
                        loop: false,
                    }]);
                    outcome = answer.choice;
                }
                
                outcomes.push({ attribute, outcome });
                const penaltyKey = `${attribute}Penalty`;
                modifiers[penaltyKey] = (modifiers[penaltyKey] || 0) + outcome.modifier;
                
                console.log(`        ${chalk.gray(`- Outcome for ${formatKeyName(attribute)}:`)} ${chalk.white(outcome.name)} (${chalk.red(outcome.modifier)})`);
            }
            hardships.push({ type: hardshipType, outcomes });
        }
        
        return { key: step.key, value: hardships };
    },

    MULTIPLE: async (step, { choices, isAutoRolling }) => {
        let numberOfItems = 0;
        if (choices.size && step.countSource[choices.size.name]) {
            const calcData = step.countSource[choices.size.name];
            numberOfItems = rollDice(calcData.dieCount, calcData.dieSize) + calcData.bonus;
        }

        console.log(chalk.bold.cyan(`\nThis settlement has ${numberOfItems} ${step.stepName.toLowerCase()}.`));
        const choiceMethod = isAutoRolling ? 'Auto-Roll' : (await inquirer.prompt([{
            type: 'list', name: 'choiceMethod', message: 'How would you like to determine them?',
            choices: ['Auto-Roll', 'Manual Selection'], loop: false,
        }])).choiceMethod;

        let chosenItems = [];
        if (choiceMethod === 'Auto-Roll') {
            if (!isAutoRolling) console.log(chalk.gray('Auto-rolling the selection...'));
            for (let i = 0; i < numberOfItems; i++) {
                const roll = rollDice(1, 100);
                const item = step.table.find(s => roll >= s.min && roll <= s.max);
                if (item) chosenItems.push({ item, size: item.name.includes('Hired Help') ? rollHiredHelpSize() : null });
            }
            if (chosenItems.length === 0) console.log(chalk.gray('  -> None were generated.'));
            else chosenItems.forEach(entry => console.log(`${chalk.green('  -')} ${chalk.white(entry.item.name)}${entry.size ? chalk.gray(` (Size: ${entry.size.name})`) : ''}`));
        } else { // Manual Selection
            while (chosenItems.length < numberOfItems) {
                console.clear();
                console.log(chalk.bold.yellow(`\n--- Manual ${step.stepName} Selection ---`));
                console.log(chalk.white(`You can select up to ${numberOfItems}. (${chosenItems.length} selected so far)`));
                if (chosenItems.length > 0) console.log(chalk.gray('Current Items: ' + chosenItems.map(e => e.item.name).join(', ')));

                const { manualItemChoice } = await inquirer.prompt([{
                    type: 'list', name: 'manualItemChoice', message: 'Select an item to add:',
                    choices: [
                        { name: chalk.bold.red('--- I\'m done selecting ---'), value: 'done' },
                        new inquirer.Separator(),
                        ...step.table.map(item => ({
                            name: `[${String(item.min).padStart(2, '0')}-${String(item.max).padStart(2, '0')}] ${chalk.bold(item.name)}`,
                            value: item
                        }))
                    ],
                    loop: false, pageSize: 15
                }]);
                if (manualItemChoice === 'done') break;
                chosenItems.push({ item: manualItemChoice, size: manualItemChoice.name.includes('Hired Help') ? await getHiredHelpSize(false) : null });
            }
        }
        return { key: step.key, value: chosenItems };
    },

    BREAKPOINT: async (step, { modeState }) => {
        if (modeState.current === 'autoRollAll') {
            console.log(chalk.gray(`--- Reached ${step.stepName}, continuing automatically. ---`));
            return null;
        }
        if (modeState.current === 'autoRollSection') modeState.current = 'manual';

        console.log(chalk.bold.green(`\n--- End of ${step.stepName} ---`));
        const { breakChoice } = await inquirer.prompt([{
            type: 'list', name: 'breakChoice', message: 'What would you like to do?',
            choices: ['Continue', 'Auto-Roll: Section', 'Auto-Roll: Finish', 'Done'],
            loop: false,
        }]);

        if (breakChoice === 'Auto-Roll: Section') modeState.current = 'autoRollSection';
        else if (breakChoice === 'Auto-Roll: Finish') modeState.current = 'autoRollAll';
        else if (breakChoice === 'Done') modeState.generationComplete = true;
        return null;
    },
    
    WORSHIP_PLACES: async (step, { choices, isAutoRolling }) => {
        let numberOfWorshipPlaces = 0;
        
        if (isAutoRolling) {
            const sizeName = choices.size.name;
            let countDataKey;
            if (sizeName === 'Very Small') { countDataKey = 'Very Small'; }
            else if (sizeName === 'Small' || sizeName === 'Medium') { countDataKey = 'Small / Medium'; }
            else if (sizeName === 'Large' || sizeName === 'Very Large') { countDataKey = 'Large / Very Large'; }
            const countData = step.countSource[countDataKey];

            if (typeof countData === 'number') { numberOfWorshipPlaces = countData; }
            else if (typeof countData === 'object') { numberOfWorshipPlaces = rollDice(countData.dieCount, countData.dieSize) + countData.bonus; }
        } else {
             const answer = await inquirer.prompt([{
                type: 'list', name: 'count', message: 'Select the number of places of worship:',
                choices: [
                    { name: '1 (Typical for Very Small villages)', value: 1 },
                    { name: '1-2 (Typical for Small/Medium villages)', value: 2 },
                    { name: '2-3 (Typical for Large/Very Large villages)', value: 3 },
                ],
                loop: false,
            }]);
            if (answer.count === 1) numberOfWorshipPlaces = 1;
            else if (answer.count === 2) numberOfWorshipPlaces = rollDice(1, 2);
            else if (answer.count === 3) numberOfWorshipPlaces = rollDice(1, 2) + 1;
        }

        console.log(`  ${chalk.magenta('Result:')} This village has ${chalk.white(numberOfWorshipPlaces)} place(s) of worship.`);
        
        if (numberOfWorshipPlaces === 0) {
            return { key: step.key, value: [] };
        }

        const generatedPlaces = [];
        for (let i = 0; i < numberOfWorshipPlaces; i++) {
            console.log(chalk.cyan(`\n    -> Generating Place of Worship #${i + 1}...`));
            
            const worshipSize = isAutoRolling ? rollOnTable(villagePlaceOfWorshipSizeTable) : (await inquirer.prompt([{
                type: 'list', name: 'choice', message: 'Select its size:',
                choices: villagePlaceOfWorshipSizeTable.map(item => ({ name: `[${item.min}-${item.max}] ${chalk.bold(item.name)}: ${item.description}`, value: item })),
                loop: false,
            }])).choice;
            console.log(`      ${chalk.magenta('Size:')} ${chalk.white(worshipSize.name)}`);
            
            const fervency = isAutoRolling ? rollOnTable(fervencyTable) : (await inquirer.prompt([{
                type: 'list', name: 'choice', message: 'Select its fervency:',
                choices: fervencyTable.map(item => ({ name: `[${item.min}-${item.max}] ${chalk.bold(item.name)}: ${item.description}`, value: item })),
                loop: false,
            }])).choice;
            console.log(`      ${chalk.magenta('Fervency:')} ${chalk.white(fervency.name)}`);
            
            generatedPlaces.push({ size: worshipSize, fervency: fervency });
        }

        return { key: step.key, value: generatedPlaces };
    },
    
    GATHERING_PLACES: async (step, { choices, isAutoRolling }) => {
        let numberOfPlaces = 0;

        if (isAutoRolling) {
            const sizeName = choices.size.name;
            const countData = step.countSource[sizeName];
            if (typeof countData === 'number') {
                numberOfPlaces = countData;
            } else if (typeof countData === 'object') {
                const roll = rollDice(countData.dieCount, countData.dieSize) + countData.bonus;
                numberOfPlaces = Math.max(0, roll);
            }
        } else {
            const answer = await inquirer.prompt([{
                type: 'list',
                name: 'count',
                message: 'Select the number of gathering places:',
                choices: [
                    { name: '0-1 (Typical for Very Small villages)', value: 1 },
                    { name: '1 (Typical for Small villages)', value: 2 },
                    { name: '1-2 (Typical for Medium/Large villages)', value: 3 },
                    { name: '2-3 (Typical for Very Large villages)', value: 4 },
                ],
                loop: false,
            }]);
            
            if (answer.count === 1) numberOfPlaces = rollDice(1, 2) - 1;
            else if (answer.count === 2) numberOfPlaces = 1;
            else if (answer.count === 3) numberOfPlaces = rollDice(1, 2);
            else if (answer.count === 4) numberOfPlaces = rollDice(1, 2) + 1;
        }

        console.log(`  ${chalk.magenta('Result:')} This village has ${chalk.white(numberOfPlaces)} place(s) of gathering.`);
        
        if (numberOfPlaces === 0) {
            return { key: step.key, value: [] };
        }

        const generatedPlaces = [];
        for (let i = 0; i < numberOfPlaces; i++) {
            console.log(chalk.cyan(`\n    -> Generating Place of Gathering #${i + 1}...`));

            const place = isAutoRolling ? rollOnTable(gatheringPlacesTable) : (await inquirer.prompt([{
                type: 'list', name: 'choice', message: `Select the type for Gathering Place #${i + 1}:`,
                choices: gatheringPlacesTable.map(item => ({ name: `[${item.dice}] ${chalk.bold(item.name)}: ${item.description}`, value: item })),
                loop: false,
            }])).choice;
            console.log(`      ${chalk.magenta('Type:')} ${chalk.white(place.name)}`);
            generatedPlaces.push(place);
        }

        return { key: step.key, value: generatedPlaces };
    },

    VILLAGE_LOCATIONS: async (step, { choices, isAutoRolling }) => {
        let numberOfLocations = 0;

        if (isAutoRolling) {
            const sizeName = choices.size.name;
            const countData = step.countSource[sizeName];
            if (countData) {
                const roll = rollDice(countData.dieCount, countData.dieSize) + countData.bonus;
                numberOfLocations = Math.max(0, roll);
            }
        } else {
            const answer = await inquirer.prompt([{
                type: 'list',
                name: 'count',
                message: 'Select the number of other locations:',
                choices: [
                    { name: '1 (Typical for Very Small/Small villages)', value: 1 },
                    { name: '2 (Common for Medium villages)', value: 2 },
                    { name: '3 (Common for Large villages)', value: 3 },
                    { name: '4 (Common for Very Large villages)', value: 4 },
                    { name: '5 (Possible for Very Large villages)', value: 5 },
                ],
                loop: false,
            }]);
             numberOfLocations = answer.count;
        }

        console.log(`  ${chalk.magenta('Result:')} This village has ${chalk.white(numberOfLocations)} other location(s).`);

        if (numberOfLocations === 0) {
            return { key: step.key, value: [] };
        }

        const generatedLocations = [];
        for (let i = 0; i < numberOfLocations; i++) {
            console.log(chalk.cyan(`\n    -> Generating Other Location #${i + 1}...`));

            const location = isAutoRolling ? rollOnTable(otherLocationsTable) : (await inquirer.prompt([{
                type: 'list', name: 'choice', message: `Select the type for Other Location #${i + 1}:`,
                choices: otherLocationsTable.map(item => ({ name: `[${item.min}-${item.max}] ${chalk.bold(item.name)}`, value: item })),
                loop: false, pageSize: 15
            }])).choice;
            
            if (location.name === 'Burned down or abandoned business') {
                console.log(chalk.yellow('      -> A ruined business found! Determining what it used to be...'));
                const filteredTable = otherLocationsTable.filter(l => l.name !== 'Burned down or abandoned business');
                const formerLocation = isAutoRolling ? rollOnTable(filteredTable) : (await inquirer.prompt([{
                    type: 'list', name: 'choice', message: `What was this business before it was abandoned?`,
                    choices: filteredTable.map(item => ({ name: `[${item.min}-${item.max}] ${chalk.bold(item.name)}`, value: item })),
                    loop: false, pageSize: 15
                }])).choice;

                const finalLocation = {
                    name: `${location.name} (Formerly a ${formerLocation.name})`,
                    description: `${location.description} It used to be a ${formerLocation.name.toLowerCase()}.`
                };
                generatedLocations.push(finalLocation);
                console.log(`      ${chalk.magenta('Type:')} ${chalk.white(finalLocation.name)}`);

            } else {
                generatedLocations.push(location);
                console.log(`      ${chalk.magenta('Type:')} ${chalk.white(location.name)}`);
            }
        }

        return { key: step.key, value: generatedLocations };
    },

    FARMS_AND_RESOURCES: async (step, { choices, isAutoRolling }) => {
        let numberOfRolls = 0;
        const sizeName = choices.size.name;
        
        if (isAutoRolling) {
            numberOfRolls = step.countSource[sizeName];
        } else {
            const answer = await inquirer.prompt([{
                type: 'list',
                name: 'count',
                message: 'Select the number of farms and resources rolls:',
                choices: [
                    { name: `1 roll (Typical for ${chalk.bold('Very Small')} towns)`, value: 1 },
                    { name: `2 rolls (Typical for ${chalk.bold('Small/Medium')} towns)`, value: 2 },
                    { name: `3 rolls (Typical for ${chalk.bold('Large/Very Large')} towns)`, value: 3 },
                ],
                loop: false,
            }]);
            numberOfRolls = answer.count;
        }

        console.log(`  ${chalk.magenta('Result:')} This town has ${chalk.white(numberOfRolls)} farm(s) and/or resource location(s).`);

        if (numberOfRolls === 0) {
            return { key: step.key, value: [] };
        }

        const generatedResources = [];
        for (let i = 0; i < numberOfRolls; i++) {
            console.log(chalk.cyan(`\n    -> Generating Farm/Resource #${i + 1}...`));

            const resource = isAutoRolling ? rollOnTable(farmsAndResourcesTable) : (await inquirer.prompt([{
                type: 'list', name: 'choice', message: `Select the type for Farm/Resource #${i + 1}:`,
                choices: farmsAndResourcesTable.map(item => ({ name: `[${item.min}-${item.max}] ${chalk.bold(item.name)}: ${item.description}`, value: item })),
                loop: false,
            }])).choice;
            
            if (resource.name !== 'None') {
                generatedResources.push(resource);
                console.log(`      ${chalk.magenta('Type:')} ${chalk.white(resource.name)}`);
            } else {
                 console.log(`      ${chalk.magenta('Type:')} ${chalk.gray(resource.name)} (No new resource added for this roll)`);
            }
        }

        return { key: step.key, value: generatedResources };
    },

    NON_COMMERCIAL_LOCATIONS: async (step, { choices, isAutoRolling, freeLocations }) => {
        let numberOfLocations = 0;
        const sizeName = choices.size.name;

        if (isAutoRolling) {
            numberOfLocations = step.countSource[sizeName];
        } else {
            const answer = await inquirer.prompt([{
                type: 'list',
                name: 'count',
                message: 'Select the number of non-commercial locations:',
                choices: [
                    { name: `1 (Typical for ${chalk.bold('Very Small')} towns)`, value: 1 },
                    { name: `2 (Typical for ${chalk.bold('Small')} towns)`, value: 2 },
                    { name: `3 (Typical for ${chalk.bold('Medium')} towns)`, value: 3 },
                    { name: `4 (Typical for ${chalk.bold('Large')} towns)`, value: 4 },
                    { name: `5 (Typical for ${chalk.bold('Very Large')} towns)`, value: 5 },
                ],
                loop: false,
            }]);
            numberOfLocations = answer.count;
        }
        
        const generatedTypes = [];
        const freebies = freeLocations.filter(loc => loc.category === 'Non-Commercial');
        
        if (freebies.length > 0) {
            console.log(chalk.yellow(`\n    -> Found ${freebies.length} free non-commercial location(s) from Priority.`));
            freebies.forEach(loc => generatedTypes.push(loc.name));
        }

        const remainingLocations = numberOfLocations - freebies.length;
        console.log(`  ${chalk.magenta('Result:')} This town has ${chalk.white(numberOfLocations)} non-commercial location type(s) (${freebies.length} free, ${remainingLocations > 0 ? remainingLocations : 0} to generate).`);
        
        if (remainingLocations > 0) {
            for (let i = 0; i < remainingLocations; i++) {
                console.log(chalk.cyan(`\n    -> Generating Non-Commercial Location #${generatedTypes.length + 1}...`));
                 const locationType = isAutoRolling ? rollOnTable(nonCommercialLocationTypeTable) : (await inquirer.prompt([{
                    type: 'list', name: 'choice', message: `Select the type for Non-Commercial Location #${generatedTypes.length + 1}:`,
                    choices: nonCommercialLocationTypeTable.map(item => ({ name: `[${item.dice}] ${chalk.bold(item.name)}`, value: item.name })),
                    loop: false,
                }])).choice;
                generatedTypes.push(locationType);
                console.log(`      ${chalk.magenta('Type:')} ${chalk.white(locationType)}`);
            }
        }

        return { key: 'nonCommercialTypes', value: generatedTypes };
    },

    FLESH_OUT_NON_COMMERCIAL: async (step, { choices, isAutoRolling }) => {
        const locations = [];
        const typesToGenerate = choices.nonCommercialTypes || [];
        
        if (typesToGenerate.length === 0) {
            return { key: 'nonCommercialLocations', value: [] };
        }

        for (const type of typesToGenerate) {
            console.log(chalk.cyan(`\n    -> Defining the ${chalk.bold(type)}...`));
            let locationDetails = { type };

            if (type === 'Place of Education') {
                const choice = isAutoRolling ? rollOnTable(placesOfEducationTable) : (await inquirer.prompt([{
                    type: 'list', name: 'choice', message: `Select the specific type of ${type}:`,
                    choices: placesOfEducationTable.map(item => ({ name: `[${item.dice}] ${chalk.bold(item.name)}: ${item.description}`, value: item })),
                    loop: false,
                }])).choice;
                locationDetails.details = choice;
                console.log(`      ${chalk.magenta('Specifics:')} ${chalk.white(choice.name)}`);
            }
            else if (type === 'Place of Gathering') {
                const choice = isAutoRolling ? rollOnTable(townPlacesOfGatheringTable) : (await inquirer.prompt([{
                    type: 'list', name: 'choice', message: `Select the specific type of ${type}:`,
                    choices: townPlacesOfGatheringTable.map(item => ({ name: `[${item.dice}] ${chalk.bold(item.name)}: ${item.description}`, value: item })),
                    loop: false,
                }])).choice;
                locationDetails.details = choice;
                console.log(`      ${chalk.magenta('Specifics:')} ${chalk.white(choice.name)}`);
            }
            else if (type === 'Place of Government' || type === 'Town Hall') {
                const choice = isAutoRolling ? rollOnTable(placesOfGovernmentTable) : (await inquirer.prompt([{
                    type: 'list', name: 'choice', message: `Select the specific type of ${type}:`,
                    choices: placesOfGovernmentTable.map(item => ({ name: `[${item.dice}] ${chalk.bold(item.name)}: ${item.description}`, value: item })),
                    loop: false,
                }])).choice;
                locationDetails.details = choice;
                console.log(`      ${chalk.magenta('Specifics:')} ${chalk.white(choice.name)}`);
            }
            else if (type === 'Place of Worship') {
                const size = isAutoRolling ? rollOnTable(townPlaceOfWorshipSizeTable) : (await inquirer.prompt([{
                    type: 'list', name: 'choice', message: 'Select its size:',
                    choices: townPlaceOfWorshipSizeTable.map(item => ({ name: `[${item.min}-${item.max}] ${chalk.bold(item.name)}: ${item.description}`, value: item })),
                    loop: false,
                }])).choice;

                const fervency = isAutoRolling ? rollOnTable(townFervencyTable) : (await inquirer.prompt([{
                    type: 'list', name: 'choice', message: 'Select its fervency:',
                    choices: townFervencyTable.map(item => ({ name: `[${item.min}-${item.max}] ${chalk.bold(item.name)}: ${item.description}`, value: item })),
                    loop: false,
                }])).choice;

                const alignment = isAutoRolling ? rollOnTable(alignmentOfTheFaithTable) : (await inquirer.prompt([{
                    type: 'list', name: 'choice', message: 'Select its alignment:',
                    choices: alignmentOfTheFaithTable.map(item => ({ name: `[${item.min}-${item.max}] ${chalk.bold(item.name)}`, value: item })),
                    loop: false,
                }])).choice;
                
                locationDetails.details = { size, fervency, alignment };
                console.log(`      ${chalk.magenta('Size:')} ${chalk.white(size.name)}`);
                console.log(`      ${chalk.magenta('Fervency:')} ${chalk.white(fervency.name)}`);
                console.log(`      ${chalk.magenta('Alignment:')} ${chalk.white(alignment.name)}`);
            }
            locations.push(locationDetails);
        }
        return { key: 'nonCommercialLocations', value: locations };
    },

    COMMERCIAL_LOCATIONS: async (step, { choices, isAutoRolling }) => {
        let numberOfLocations = 0;
        let sizeForCommerce = choices.size.name;

        if (choices.priority?.rules?.commercialLocations?.sizeCategoryIncrease) {
            const sizeOrder = ['Very Small', 'Small', 'Medium', 'Large', 'Very Large'];
            const currentIndex = sizeOrder.indexOf(sizeForCommerce);
            const newIndex = Math.min(currentIndex + 1, sizeOrder.length - 1);
            sizeForCommerce = sizeOrder[newIndex];
            console.log(chalk.yellow(`      -> Economic Priority has increased the effective size for commerce to: ${chalk.white(sizeForCommerce)}`));
        }
        
        if (isAutoRolling) {
            numberOfLocations = step.countSource[sizeForCommerce];
        } else {
            const answer = await inquirer.prompt([{
                type: 'list',
                name: 'count',
                message: 'Select the number of commercial locations:',
                choices: [
                    { name: `4 (Typical for ${chalk.bold('Very Small')} towns)`, value: 4 },
                    { name: `6 (Typical for ${chalk.bold('Small')} towns)`, value: 6 },
                    { name: `8 (Typical for ${chalk.bold('Medium')} towns)`, value: 8 },
                    { name: `10 (Typical for ${chalk.bold('Large')} towns)`, value: 10 },
                    { name: `12 (Typical for ${chalk.bold('Very Large')} towns)`, value: 12 },
                ],
                loop: false,
            }]);
            numberOfLocations = answer.count;
        }

        console.log(chalk.bold.cyan(`\nThis town has a total of ${numberOfLocations} commercial locations.`));
        let numberOfShops = 0;

        if (isAutoRolling) {
            for (let i = 0; i < numberOfLocations; i++) {
                if (rollDice(1, 6) <= 3) {
                    numberOfShops++;
                }
            }
        } else {
            console.log(chalk.cyan(`Now, let's determine how many of those are shops versus services.`));
            const shopChoices = Array.from({ length: numberOfLocations + 1 }, (_, i) => ({ name: `${i} Shops`, value: i }));
            const answer = await inquirer.prompt([{
                type: 'list',
                name: 'shopCount',
                message: `How many of the ${numberOfLocations} commercial locations should be Shops?`,
                choices: shopChoices,
                loop: false,
            }]);
            numberOfShops = answer.shopCount;
        }
        const numberOfServices = numberOfLocations - numberOfShops;

        console.log(`  ${chalk.magenta('Result:')} This town has ${chalk.white(numberOfShops)} shop(s) and ${chalk.white(numberOfServices)} service(s).`);

        const generatedShops = [];
        if (numberOfShops > 0) {
            console.log(chalk.bold.cyan(`\n--- Selecting Shops ---`));
            for (let i = 0; i < numberOfShops; i++) {
                console.log(chalk.cyan(`\n    -> Generating Shop #${i + 1}...`));
                const shop = isAutoRolling ? rollOnTable(shopsTable, 100) : (await inquirer.prompt([{
                    type: 'list', name: 'choice', message: `Select Shop #${i + 1}:`,
                    choices: shopsTable.map(item => ({ name: `[${item.min}-${item.max}] ${chalk.bold(item.name)}`, value: item })),
                    pageSize: 15,
                    loop: false,
                }])).choice;
                
                const shopResult = { item: shop };
                if (shop.name.includes('Hired Help')) {
                    shopResult.size = await getHiredHelpSize(isAutoRolling);
                }
                generatedShops.push(shopResult);
                console.log(`      ${chalk.magenta('Type:')} ${chalk.white(shop.name)}`);
                if(shopResult.size) console.log(`        ${chalk.magenta('Size:')} ${chalk.white(shopResult.size.name)}`);
            }
        }

        const generatedServices = [];
        if (numberOfServices > 0) {
            console.log(chalk.bold.cyan(`\n--- Selecting Services ---`));
             for (let i = 0; i < numberOfServices; i++) {
                console.log(chalk.cyan(`\n    -> Generating Service #${i + 1}...`));
                const service = isAutoRolling ? rollOnTable(servicesTable, 100) : (await inquirer.prompt([{
                    type: 'list', name: 'choice', message: `Select Service #${i + 1}:`,
                    choices: servicesTable.map(item => ({ name: `[${item.min}-${item.max}] ${chalk.bold(item.name)}`, value: item })),
                    pageSize: 15,
                    loop: false,
                }])).choice;
                
                const serviceResult = { item: service };
                if (service.name.includes('Hired Help')) {
                    serviceResult.size = await getHiredHelpSize(isAutoRolling);
                }
                generatedServices.push(serviceResult);
                console.log(`      ${chalk.magenta('Type:')} ${chalk.white(service.name)}`);
                if(serviceResult.size) console.log(`        ${chalk.magenta('Size:')} ${chalk.white(serviceResult.size.name)}`);
            }
        }

        return { key: step.key, value: { shops: generatedShops, services: generatedServices } };
    },

    OUTSIDE_THE_CITY: async (step, { choices, isAutoRolling }) => {
        let numberOfRolls = 0;
        const sizeName = choices.size.name;

        if (isAutoRolling) {
            numberOfRolls = step.countSource[sizeName] || 0;
        } else {
            const { count } = await inquirer.prompt([{
                type: 'list',
                name: 'count',
                message: 'Select the number of rolls for features outside the city:',
                choices: [
                    { name: `5 rolls (Typical for ${chalk.bold('Very Small')} cities)`, value: 5 },
                    { name: `4 rolls (Typical for ${chalk.bold('Small')} cities)`, value: 4 },
                    { name: `3 rolls (Typical for ${chalk.bold('Medium')} cities)`, value: 3 },
                    { name: `2 rolls (Typical for ${chalk.bold('Large')} cities)`, value: 2 },
                    { name: `1 roll (Typical for ${chalk.bold('Very Large')} cities)`, value: 1 },
                ],
                loop: false,
            }]);
            numberOfRolls = count;
        }

        console.log(`  ${chalk.magenta('Result:')} This city has ${chalk.white(numberOfRolls)} feature(s) outside its walls.`);

        if (numberOfRolls === 0) {
            return { key: step.key, value: [] };
        }

        const specialRules = choices.priority?.rules?.outsideTheCity;
        const generatedFeatures = [];

        for (let i = 0; i < numberOfRolls; i++) {
            console.log(chalk.cyan(`\n    -> Generating Outside Feature #${i + 1}...`));

            let feature;
            // Apply special rules ONLY for the first roll (i === 0)
            if (i === 0 && specialRules) {
                 if (isAutoRolling) {
                    console.log(chalk.yellow(`      -> Applying 'Production' Priority rule to first roll...`));
                    let roll;
                    do {
                        roll = rollDice(1, specialRules.diceOverride);
                    } while (roll >= specialRules.rerollRange[0] && roll <= specialRules.rerollRange[1]);
                    
                    feature = step.table.find(item => roll >= item.min && roll <= item.max);
                    if (feature) console.log(chalk.gray(`      (Rolled a ${roll} on a d${specialRules.diceOverride}, resulting in "${feature.name}")`));

                 } else {
                    console.log(chalk.yellow(`      -> NOTE: The 'Production' Priority suggests rolling a d10 and rerolling 1-4 for this first feature.`));
                 }
            }
            
            // If feature wasn't determined by a special rule, determine it now
            if (!feature) {
                 feature = isAutoRolling ? rollOnTable(step.table) : (await inquirer.prompt([{
                    type: 'list', name: 'choice', message: `Select the feature for Outside Location #${i + 1}:`,
                    choices: step.table.map(item => ({ name: `[${item.min}-${item.max}] ${chalk.bold(item.name)}: ${item.description}`, value: item })),
                    loop: false, pageSize: 15,
                }])).choice;
            }
            
            if (feature && feature.name !== 'None') {
                generatedFeatures.push(feature);
                console.log(`      ${chalk.magenta('Type:')} ${chalk.white(feature.name)}`);
            } else {
                 console.log(`      ${chalk.magenta('Type:')} ${chalk.gray(feature ? feature.name : 'Invalid Roll')} (No new feature added for this roll)`);
            }
        }

        return { key: step.key, value: generatedFeatures };
    },

    DISTRICTS: async (step, { choices, modifiers, isAutoRolling }) => {
        // 1. Determine number of districts
        const numMod = modifiers.numberOfDistricts || 0;
        let numResult;
        if (isAutoRolling) {
            const baseRoll = rollDice(1, 20);
            const finalScore = applyModifierAndClamp(baseRoll, numMod, 1, 20);
            numResult = numberOfDistrictsTable.find(item => finalScore >= item.min && finalScore <= item.max);
        } else {
            console.log(chalk.gray(`  (Current modifier for this roll is ${numMod >= 0 ? '+' : ''}${numMod})`));
            const answer = await inquirer.prompt([{
                type: 'list', name: 'choice', message: 'Select the number of districts:',
                choices: numberOfDistrictsTable.map(item => ({ name: `[${item.min}-${item.max}] ${chalk.bold(item.name)}`, value: item })),
                loop: false,
            }]);
            numResult = answer.choice;
        }
        const totalDistricts = numResult.value;
        console.log(`  ${chalk.magenta('Result:')} The city has ${chalk.white(totalDistricts)} districts.`);

        // 2. Handle free/pre-determined districts
        const generatedDistricts = [];
        const freeDistrictName = choices.priority?.rules?.districts?.free || choices.leadership?.rules?.districts?.free;
        if (freeDistrictName) {
            const freeDistrictType = districtTypeTable.find(d => d.name === freeDistrictName);
            if (freeDistrictType) {
                generatedDistricts.push({ type: freeDistrictType });
                console.log(chalk.yellow(`      -> Gained a free '${freeDistrictType.name}' district.`));
            }
        }
        
        // 3. Generate remaining districts
        const remainingDistricts = totalDistricts - generatedDistricts.length;
        const isWaterAdjacent = choices.environment?.name === 'Coastal' || choices.environment?.name === 'River';

        for (let i = 0; i < remainingDistricts; i++) {
             console.log(chalk.cyan(`\n    -> Generating District #${generatedDistricts.length + 1}...`));
             let districtType;
             do {
                districtType = isAutoRolling ? rollOnTable(districtTypeTable) : (await inquirer.prompt([{
                    type: 'list', name: 'choice', message: `Select the type for District #${generatedDistricts.length + 1}:`,
                    choices: districtTypeTable.map(item => ({ 
                        name: `[${item.dice}] ${chalk.bold(item.name)}`, 
                        value: item,
                        disabled: (item.name === 'Docks' && !isWaterAdjacent) ? 'City is not adjacent to water' : false
                    })),
                    loop: false,
                }])).choice;

                if (districtType.name === 'Docks' && !isWaterAdjacent && isAutoRolling) {
                    console.log(chalk.yellow('      -> Rolled "Docks" but city is not near water. Rerolling...'));
                    continue;
                }
                break;
             } while (true);
             generatedDistricts.push({ type: districtType });
             console.log(`      ${chalk.magenta('Type:')} ${chalk.white(districtType.name)}`);
        }

        // 4. Determine details for each district
        const conditionOrder = ['Squalid', 'Dilapidated', 'Decent', 'Impressive', 'Magnificent'];
        const generalConditionIndex = conditionOrder.indexOf(choices.generalCondition.name);
        const crimeOrder = ['Dangerous', 'Frequent', 'Common', 'Uncommon', 'Infrequent'];
        const generalCrimeIndex = crimeOrder.indexOf(choices.generalCrime.name);

        for (const district of generatedDistricts) {
            console.log(chalk.cyan(`\n    -> Determining details for the ${chalk.bold(district.type.name)} district...`));
            
            // --- CONDITION ---
            const baseCondMod = modifiers.districtCondition || 0;
            const districtCondMod = district.type.modifiers?.districtCondition || 0;
            const totalCondMod = baseCondMod + districtCondMod;

            let conditionResult;
            if (district.type.rules?.condition?.diceOverride && isAutoRolling) {
                 console.log(chalk.yellow(`      -> Applying '${district.type.name}' special rule to condition roll...`));
                 const specialRoll = rollDice(1, district.type.rules.condition.diceOverride);
                 conditionResult = districtConditionTable.find(item => specialRoll >= item.min && specialRoll <= item.max);
                 console.log(chalk.gray(`      (Rolled a ${specialRoll} on a d${district.type.rules.condition.diceOverride})`));
            } else {
                 const promptMessage = `Select condition for the ${district.type.name} district (Mod: ${totalCondMod >= 0 ? '+' : ''}${totalCondMod}):`;
                 conditionResult = isAutoRolling 
                    ? districtConditionTable.find(item => applyModifierAndClamp(rollDice(1, 20), totalCondMod, 1, 20) >= item.min && item.max)
                    : (await inquirer.prompt([{ type: 'list', name: 'choice', message: promptMessage,
                        choices: districtConditionTable.map(item => ({ name: `[${item.min}-${item.max}] ${chalk.bold(item.name)}: ${item.description}`, value: item })), loop: false }])).choice;
            }
            const finalCondIndex = applyModifierAndClamp(generalConditionIndex, conditionResult.step, 0, conditionOrder.length - 1);
            district.condition = { name: conditionOrder[finalCondIndex], description: `(${conditionResult.name} relative to city)` };
            console.log(`      ${chalk.magenta('Condition:')} ${chalk.white(district.condition.name)} ${chalk.gray(district.condition.description)}`);

            // --- HOUSING ---
            const isResidentialDistrict = district.type.name === 'Slums' || district.type.name === 'Upper Class';
            let housingResult;
            if(isAutoRolling) {
                do {
                    housingResult = rollOnTable(housingTable, 12);
                } while (isResidentialDistrict && housingResult.name === 'None');
            } else {
                const answer = await inquirer.prompt([{ type: 'list', name: 'choice', message: `Select housing level for the ${district.type.name} district:`,
                    choices: housingTable.map(item => ({ name: `[${item.min}-${item.max}] ${chalk.bold(item.name)}`, value: item, disabled: isResidentialDistrict && item.name === 'None' ? 'This district must have housing' : false })), loop: false}]);
                housingResult = answer.choice;
            }
            district.housing = housingResult;
            console.log(`      ${chalk.magenta('Housing:')} ${chalk.white(district.housing.name)}`);

            // --- ENTRY ---
            const entryResult = isAutoRolling ? rollOnTable(districtEntryTable, 12) : (await inquirer.prompt([{ type: 'list', name: 'choice', message: `Select entry for the ${district.type.name} district:`,
                choices: districtEntryTable.map(item => ({ name: `[${item.min}-${item.max}] ${chalk.bold(item.name)}`, value: item })), loop: false }])).choice;
            district.entry = entryResult;
            console.log(`      ${chalk.magenta('Entry:')} ${chalk.white(district.entry.name)}`);
            
            // --- CRIME ---
            const condCrimeMod = districtConditionCrimeModifiers[district.condition.name] || 0;
            const entryCrimeMod = district.entry.modifiers?.districtCrime || 0;
            const totalCrimeMod = condCrimeMod + entryCrimeMod;

            const crimePrompt = `Select crime level for the ${district.type.name} district (Mod: ${totalCrimeMod >= 0 ? '+' : ''}${totalCrimeMod}):`;
            const crimeResult = isAutoRolling
                ? districtCrimeTable.find(item => applyModifierAndClamp(rollDice(1, 20), totalCrimeMod, 1, 20) >= item.min && item.max)
                : (await inquirer.prompt([{ type: 'list', name: 'choice', message: crimePrompt,
                    choices: districtCrimeTable.map(item => ({ name: `[${item.min}-${item.max}] ${chalk.bold(item.name)}`, value: item })), loop: false }])).choice;
            
            const finalCrimeIndex = applyModifierAndClamp(generalCrimeIndex, crimeResult.step, 0, crimeOrder.length - 1);
            district.crime = { name: crimeOrder[finalCrimeIndex], description: `(${crimeResult.name} relative to city)` };
            district.urbanEncounterModifier = crimeDegreesData[district.crime.name]?.urbanEncounter || 0;
            console.log(`      ${chalk.magenta('Crime:')} ${chalk.white(district.crime.name)} ${chalk.gray(district.crime.description)}`);
        
            // --- NOTABLE LOCATIONS ---
            const notableLocationsResult = isAutoRolling ? rollOnTable(districtNotableLocationsTable, 10) : (await inquirer.prompt([{ type: 'list', name: 'choice', message: `Select number of notable locations for the ${district.type.name} district:`,
                choices: districtNotableLocationsTable.map(item => ({ name: `[${item.min}-${item.max}] ${chalk.bold(item.name)}`, value: item })), loop: false }])).choice;
            district.notableLocations = notableLocationsResult;
            console.log(`      ${chalk.magenta('Notable Locations:')} ${chalk.white(district.notableLocations.name)}`);
        }
        
        return { key: 'districts', value: generatedDistricts };
    },

    NOTEWORTHY_OFFICIAL: async (step, { isAutoRolling }) => {
        console.log(chalk.cyan(`\n    -> Generating a Noteworthy Official...`));

        const official = isAutoRolling ? rollOnTable(officialsTable) : (await inquirer.prompt([{
            type: 'list', name: 'choice', message: 'Select the official\'s role:',
            choices: officialsTable.map(item => ({ name: `[${item.dice}] ${chalk.bold(item.name)}: ${item.description}`, value: item })),
            loop: false,
        }])).choice;
        console.log(`      ${chalk.magenta('Role:')} ${chalk.white(official.name)}`);

        const competence = isAutoRolling ? rollOnTable(officialCompetenceTable) : (await inquirer.prompt([{
            type: 'list', name: 'choice', message: 'Select their competence level:',
            choices: officialCompetenceTable.map(item => ({ name: `[${item.dice || `${item.min}-${item.max}`}] ${chalk.bold(item.name)}: ${item.description}`, value: item })),
            loop: false,
        }])).choice;
        console.log(`      ${chalk.magenta('Competence:')} ${chalk.white(competence.name)}`);

        return { key: step.key, value: { official, competence } };
    }
};

// --- SUMMARY AND EXPORT FUNCTIONS ---

function displaySummary(choices, settlementName, rollDetails, currentModifiers, freeLocations) {
    console.log(chalk.bold.yellow('\n\n================================'));
    console.log(chalk.bold.yellow('   Final Settlement Summary   '));
    console.log(chalk.bold.yellow('================================\n'));

    console.log(`${chalk.bold.cyan('Name:')} ${chalk.bold.yellowBright(settlementName)}`);
    console.log(`${chalk.bold.cyan('Type:')} ${chalk.white(choices.type.name)}`);

    for (const key in choices) {
        if (key === 'type' || key === 'nonCommercialTypes') continue;
        const choice = choices[key];
        const keyName = formatKeyName(key);
        if (Array.isArray(choice)) {
            console.log(chalk.bold.cyan(`\n--- ${keyName} ---`));
            if (choice.length === 0) {
                console.log(chalk.gray('  (None)'));
                continue;
            }

            if (key === 'hardships') {
                if (choice[0].type.name === 'No Hardship') {
                    console.log(chalk.gray('  (None)'));
                } else {
                    choice.forEach((hardship, index) => {
                        console.log(`${chalk.green(`  - Hardship #${index + 1}:`)} ${chalk.white(hardship.type.name)}`);
                        hardship.outcomes.forEach(o => {
                            console.log(`    ${chalk.magenta('↳')} For ${chalk.cyan(formatKeyName(o.attribute))}, they suffered ${chalk.white(o.outcome.name)}`);
                        });
                    });
                }
            } else if (key === 'worshipPlaces') {
                choice.forEach((place, index) => {
                    console.log(`${chalk.green(`  - Place of Worship #${index + 1}:`)}`);
                    console.log(`    ${chalk.magenta('↳ Size:')} ${chalk.white(place.size.name)}`);
                    console.log(`    ${chalk.magenta('↳ Fervency:')} ${chalk.white(place.fervency.name)}`);
                });
            } else if (key === 'gatheringPlaces' || key === 'villageLocations' || key === 'farmsAndResources' || key === 'outsideTheCity') {
                 choice.forEach((place, index) => {
                    console.log(`${chalk.green(`  - Feature #${index + 1}:`)} ${chalk.white(place.name)}`);
                });
            } else if (key === 'districts') {
                choice.forEach((district, index) => {
                    console.log(`${chalk.green(`\n  - District #${index + 1}:`)} ${chalk.white(district.type.name)}`);
                    console.log(`    ${chalk.magenta('↳ Housing:')} ${chalk.white(district.housing.name)}`);
                    console.log(`    ${chalk.magenta('↳ Entry:')} ${chalk.white(district.entry.name)}`);
                    console.log(`    ${chalk.magenta('↳ Condition:')} ${chalk.white(district.condition.name)} ${chalk.gray(district.condition.description)}`);
                    console.log(`    ${chalk.magenta('↳ Crime:')} ${chalk.white(district.crime.name)} ${chalk.gray(district.crime.description)}`);
                    console.log(`    ${chalk.magenta('↳ Notable Locations:')} ${chalk.white(district.notableLocations.name)}`);
                });
            } else if (key === 'nonCommercialLocations') {
                choice.forEach((loc, index) => {
                    if (loc.type === 'Place of Worship') {
                        console.log(`${chalk.green(`  - Location #${index + 1}:`)} ${chalk.white(loc.type)}`);
                        console.log(`    ${chalk.magenta('↳ Size:')} ${chalk.white(loc.details.size.name)}`);
                        console.log(`    ${chalk.magenta('↳ Fervency:')} ${chalk.white(loc.details.fervency.name)}`);
                        console.log(`    ${chalk.magenta('↳ Alignment:')} ${chalk.white(loc.details.alignment.name)}`);
                    } else {
                        console.log(`${chalk.green(`  - Location #${index + 1}:`)} ${chalk.white(loc.details.name)} (${loc.type})`);
                    }
                });
            } else { 
                choice.forEach(entry => {
                    console.log(`${chalk.green('  -')} ${chalk.white(entry.item.name)}`);
                    if (entry.size) console.log(`    ${chalk.magenta('↳ Size:')} ${chalk.gray(entry.size.name)}`);
                });
            }
        } else if (key === 'commercialLocations') {
             console.log(chalk.bold.cyan(`\n--- Shops ---`));
             if (choice.shops.length > 0) {
                choice.shops.forEach(shop => {
                    console.log(`${chalk.green('  -')} ${chalk.white(shop.item.name)}`);
                    if (shop.size) console.log(`    ${chalk.magenta('↳ Size:')} ${chalk.gray(shop.size.name)}`);
                });
             } else {
                console.log(chalk.gray('  (None)'));
             }
             console.log(chalk.bold.cyan(`\n--- Services ---`));
             if (choice.services.length > 0) {
                choice.services.forEach(service => {
                    console.log(`${chalk.green('  -')} ${chalk.white(service.item.name)}`);
                     if (service.size) console.log(`    ${chalk.magenta('↳ Size:')} ${chalk.gray(service.size.name)}`);
                });
             } else {
                console.log(chalk.gray('  (None)'));
             }
        } else if (key === 'noteworthyOfficial') {
            console.log(`${chalk.bold.cyan(keyName + ':')} ${chalk.white(choice.official.name)}`);
            console.log(`  ${chalk.magenta('↳ Competence:')} ${chalk.white(choice.competence.name)}`);
        } else if (choice && choice.name) {
            console.log(`${chalk.bold.cyan(keyName + ':')} ${chalk.white(choice.name)}`);
            if(choice.subChoice) {
                console.log(`  ${chalk.magenta('↳ Type:')} ${chalk.white(choice.subChoice.name)}`);
            }
        }
    }
    
    if (freeLocations.length > 0) {
        console.log(chalk.bold.cyan(`\n--- Free Locations (from Priority) ---`));
        freeLocations.forEach(loc => {
            console.log(`${chalk.green('  -')} ${chalk.white(loc.name)} (${loc.category})`);
        });
    }

    console.log(chalk.bold.yellow('\n\n--- Background Modifier Tracking ---'));
    for (const key in rollDetails) {
        const details = rollDetails[key];
        const keyName = formatKeyName(key);
        if (details.final !== undefined) {
            const modifierText = details.modifier >= 0 ? `+${details.modifier}` : `${details.modifier}`;
            console.log(`${chalk.cyan(keyName + ' Roll:')} ${chalk.white(details.base)} | ${chalk.magenta('Modifier:')} ${chalk.white(modifierText)} | ${chalk.green('Final:')} ${chalk.white(details.final)}`);
        }
    }
    for (const key in currentModifiers) {
        const keyName = formatKeyName(key);
        const modifierText = currentModifiers[key] >= 0 ? `+${currentModifiers[key]}` : `${currentModifiers[key]}`;
        console.log(`${chalk.gray('Final')} ${chalk.cyan(keyName)} ${chalk.gray('Modifier Collected:')} ${chalk.white(modifierText)}`);
    }
    console.log(chalk.bold.yellow('\n================================'));
}

async function handleExport(choices, settlementName, freeLocations) {
    const { shouldSave } = await inquirer.prompt([{
        type: 'confirm', name: 'shouldSave', message: 'Save this settlement to a text file?', default: true,
    }]);

    if (shouldSave) {
        let content = `================================\n   ${settlementName.toUpperCase()}   \n================================\n\n`;
        content += `Name: ${settlementName}\nType: ${choices.type.name}\n\n`;
        for (const key in choices) {
            if (key === 'type' || key === 'nonCommercialTypes') continue;
            const choice = choices[key];
            const keyName = formatKeyName(key);
            if (Array.isArray(choice)) {
                 content += `--- ${keyName.toUpperCase()} ---\n`;
                 if (choice.length === 0) {
                     content += `(None)\n`;
                 } else if (key === 'hardships') {
                    if (choice[0].type.name === 'No Hardship') {
                        content += `(None)\n`;
                    } else {
                         choice.forEach((hardship, index) => {
                            content += `- Hardship #${index + 1}: ${hardship.type.name}\n`;
                            content += `  ${hardship.type.description}\n`;
                            hardship.outcomes.forEach(o => {
                                content += `  - Outcome for ${formatKeyName(o.attribute)}: ${o.outcome.name} (${o.outcome.modifier})\n`;
                                content += `    ${o.outcome.description}\n`;
                            });
                        });
                    }
                } else if (key === 'worshipPlaces') {
                     choice.forEach((place, index) => {
                        content += `- Place of Worship #${index + 1}:\n`;
                        content += `  - Size: ${place.size.name}\n`;
                        content += `    ${place.size.description}\n`;
                        content += `  - Fervency: ${place.fervency.name}\n`;
                        content += `    ${place.fervency.description}\n`;
                    });
                } else if (key === 'gatheringPlaces' || key === 'villageLocations' || key === 'farmsAndResources' || key === 'outsideTheCity') {
                    choice.forEach((place, index) => {
                        content += `- Feature #${index + 1}: ${place.name}\n`;
                        content += `  ${place.description}\n`;
                    });
                } else if (key === 'districts') {
                     choice.forEach((district, index) => {
                        content += `\n- District #${index + 1}: ${district.type.name}\n`;
                        content += `  - Housing: ${district.housing.name}\n`;
                        content += `  - Entry: ${district.entry.name}\n`;
                        content += `  - Condition: ${district.condition.name} ${district.condition.description}\n`;
                        content += `  - Crime: ${district.crime.name} ${district.crime.description}\n`;
                        content += `  - Notable Locations: ${district.notableLocations.name}\n`;
                    });
                } else if (key === 'nonCommercialLocations') {
                    choice.forEach((loc, index) => {
                        if (loc.type === 'Place of Worship') {
                            content += `- Location #${index + 1}: ${loc.type}\n`;
                            content += `  - Size: ${loc.details.size.name}\n    ${loc.details.size.description}\n`;
                            content += `  - Fervency: ${loc.details.fervency.name}\n    ${loc.details.fervency.description}\n`;
                            content += `  - Alignment: ${loc.details.alignment.name}\n`;
                        } else {
                            content += `- Location #${index + 1}: ${loc.details.name} (${loc.type})\n`;
                            content += `  ${loc.details.description}\n`;
                        }
                    });
                } else {
                    choice.forEach(entry => {
                        content += `- ${entry.item.name}\n`;
                        if (entry.item.description) content += `  ${entry.item.description}\n`;
                        if (entry.size) content += `  Size: ${entry.size.name}\n  ${entry.size.description}\n`;
                    });
                }
                content += `\n`;
            } else if (key === 'commercialLocations') {
                content += `--- SHOPS ---\n`;
                if(choice.shops.length > 0) {
                    choice.shops.forEach(shop => {
                        content += `- ${shop.item.name}\n`;
                        content += `  ${shop.item.description}\n`;
                        if (shop.size) content += `  Size: ${shop.size.name}\n  ${shop.size.description}\n`;
                    });
                } else {
                    content += `(None)\n`;
                }
                content += `\n--- SERVICES ---\n`;
                if(choice.services.length > 0) {
                    choice.services.forEach(service => {
                        content += `- ${service.item.name}\n`;
                        content += `  ${service.item.description}\n`;
                        if (service.size) content += `  Size: ${service.size.name}\n  ${service.size.description}\n`;
                    });
                } else {
                    content += `(None)\n`;
                }
                content += `\n`;
            } else if (key === 'noteworthyOfficial') {
                 content += `--- ${keyName.toUpperCase()} ---\n`;
                 content += `- Official: ${choice.official.name}\n`;
                 content += `  ${choice.official.description}\n`;
                 content += `- Competence: ${choice.competence.name}\n`;
                 content += `  ${choice.competence.description}\n\n`;
            } else if (choice && choice.name) {
                content += `${keyName}: ${choice.name}\n`;
                if(choice.subChoice) {
                    content += `  - Type: ${choice.subChoice.name}\n`;
                    if (choice.subChoice.description) content += `    ${choice.subChoice.description}\n`;
                }
                if (choice.description) content += `  - ${choice.description}\n\n`;
            }
        }

        if (freeLocations.length > 0) {
            content += `--- FREE LOCATIONS (FROM PRIORITY) ---\n`;
            freeLocations.forEach(loc => {
                content += `- ${loc.name} (${loc.category})\n`;
            });
            content += `\n`;
        }

        const filename = `${settlementName.replace(/[\/\\?%*:|"<>]/g, '-')}.txt`;
        try {
            await fs.writeFile(filename, content);
            console.log(chalk.green(`\nSettlement saved successfully as ${chalk.bold(filename)}`));
        } catch (error) {
            console.error(chalk.red(`\nError saving file: ${error.message}`));
        }
    }
}

async function startAdventure(autoRollEnabled = false) {
    const choices = {};
    const rollDetails = {};
    const freeLocations = [];
    const modifiers = { 
        visitorTraffic: 0, quality: 0, urbanEncounter: 0, prosperity: 0, // Shared
        populationDensity: 0, hardshipLikelihood: 0, condition: 0, disposition: 0, crime: 0, dangerLevel: 0, // Village/Shared
        fortification: 0, lawEnforcement: 0, marketSquare: 0, placeOfWorshipSize: 0, farmsAndResources: 0, defaultInnQuality: 0, populationOverflow: 0, nightActivity: 0, size: 0, populationWealth: 0, // Town/Shared
        numberOfDistricts: 0, districtCondition: 0, districtCrime: 0, // City
    };
    const modeState = { current: autoRollEnabled ? 'autoRollAll' : 'manual', generationComplete: false };

    if (modeState.current === 'autoRollAll') console.log(chalk.bold.magenta('--- Auto-Roll Mode Enabled ---'));
    else console.log(chalk.bold.cyan('Starting the Settlement Generator...'));

    const { settlementType } = await inquirer.prompt([{ type: 'list', name: 'settlementType', message: 'Choose a settlement type to begin:', choices: settlementTypes, loop: false }]);
    choices.type = { name: settlementType };

    const path = settlementPaths[settlementType];

    for (const step of path) {
        if (modeState.generationComplete) break;
        if (step.condition && !step.condition(choices)) continue;

        if (step.title) console.log(chalk.bold.cyan(`\nDetermining ${step.title}...`));

        const processor = stepProcessors[step.type];
        if (processor) {
            const result = await processor(step, {
                choices,
                modifiers,
                isAutoRolling: modeState.current !== 'manual',
                modeState,
                freeLocations
            });

            if (result) {
                choices[result.key] = result.value;
                if (result.value && result.value.modifiers) {
                    for (const key in result.value.modifiers) {
                        if (modifiers.hasOwnProperty(key)) modifiers[key] += result.value.modifiers[key];
                    }
                }
                if (result.rollDetail) rollDetails[result.key] = result.rollDetail;
            }
        }
    }

    console.log(chalk.bold.green('\nGeneration complete! Preparing final summary...'));

    const settlementName = generateSettlementName();
    displaySummary(choices, settlementName, rollDetails, modifiers, freeLocations);
    await handleExport(choices, settlementName, freeLocations);
}

export { startAdventure };