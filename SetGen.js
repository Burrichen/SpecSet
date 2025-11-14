// SetGen.js

import fs from 'fs/promises';
import inquirer from 'inquirer';
import chalk from 'chalk';
import { tradingPostOrigins, tradingPostSpecialties, foodAndDrink, tradingPostAges, tradingPostConditions, visitorTrafficTable, tradingPostSizeTable, residentPopulationTable, lawEnforcementTable, leadershipTable, populationWealthTable, crimeTable, shopLocationsData, shopsTable, serviceLocationsData, placeOfWorshipDecisionTable, placeOfWorshipSizeTable, recentHistoryTable, eventsTable, opportunitiesTable, dangerLevelTable, dangerTypeTable } from './tradingpost.js';
import { hiredHands, environmentTable, dispositionTable, oligarchyTypeTable, servicesTable, hiredHelpSizeTable, fervencyTable } from './commonTables.js';
import { villageAges, hardshipLikelihoodTable, hardshipTypeTable, hardshipOutcomeTable, villageSizeTable, villageConditionTable, villageSpecialtyTable, villageResourceTable, villageHistoryTable, villagePopulationDensityTable, villageLawEnforcementTable, villageLeadershipTable, villagePopulationWealthTable, villageCrimeTable, placesOfWorshipCountData, villagePlaceOfWorshipSizeTable, gatheringPlacesCountData, gatheringPlacesTable, otherLocationsCountData, otherLocationsTable, villageEventsTable, politicalRumorsTable, villageOpportunitiesTable, villageDangerLevelTable, villageDangerTypeTable } from './villages.js';

// --- HELPER FUNCTIONS ---

function rollDice(count, size) {
    let total = 0;
    for (let i = 0; i < count; i++) {
        total += Math.floor(Math.random() * size) + 1;
    }
    return total;
}

function rollOnTable(table) {
    if (table[0].min !== undefined) {
        const maxRoll = table[table.length - 1].max;
        const roll = rollDice(1, maxRoll);
        return table.find(item => roll >= item.min && roll <= item.max);
    } else {
        const randomIndex = Math.floor(Math.random() * table.length);
        return table[randomIndex];
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
        { key: 'origin', title: "its origin", prompt: "Select an origin:", table: tradingPostOrigins, type: 'CHOICE' },
        { key: 'specialty', title: "its specialty", prompt: "Select a specialty:", table: tradingPostSpecialties, type: 'CHOICE' },
        { key: 'subSpecialty', title: "its specific food or drink", prompt: "Select a food or drink:", table: foodAndDrink, type: 'CHOICE', condition: (choices) => choices.specialty?.name === 'Food & Drink' },
        { key: 'subSpecialty', title: "the kind of hired hands", prompt: "Select a hired hand type:", table: hiredHands, type: 'CHOICE', condition: (choices) => choices.specialty?.name === 'Hired Hands' },
        { key: 'hiredHandsSpecialtySize', title: "the size of this hired help group", prompt: "Select Hired Help Size:", table: hiredHelpSizeTable, type: 'HIRED_HELP_SIZE_CHOICE', condition: (choices) => choices.specialty?.name === 'Hired Hands' },
        { key: 'age', title: "how old it is", prompt: "Select an age:", table: tradingPostAges, type: 'CHOICE' },
        { key: 'condition', title: "its current condition", prompt: "Select a condition:", table: tradingPostConditions, type: 'CHOICE' },
        { key: 'visitorTraffic', title: "its visitor traffic level", prompt: "Select the visitor traffic level:", table: visitorTrafficTable, type: 'CHOICE' },
        { key: 'size', title: "its size", prompt: "Select the settlement size:", table: tradingPostSizeTable, type: 'CHOICE' },
        { key: 'environment', title: "its surrounding environment", prompt: "Select an environment:", table: environmentTable, type: 'CHOICE' },
        { key: 'break1', type: 'BREAKPOINT', stepName: "Step 1: Core Details" },
        { key: 'population', title: "its population density", prompt: "Select the resident population level:", table: residentPopulationTable, type: 'CHOICE' },
        { key: 'disposition', title: "the disposition of the locals", prompt: "Select the resident disposition:", table: dispositionTable, type: 'CHOICE' },
        { key: 'lawEnforcement', title: "the state of law enforcement", prompt: "Select the law enforcement level:", table: lawEnforcementTable, type: 'CHOICE' },
        { key: 'leadership', title: "who is in charge", prompt: "Select the leadership type:", table: leadershipTable, type: 'CHOICE' },
        { key: 'oligarchyType', title: "the kind of oligarchy", prompt: "Select the oligarchy type:", table: oligarchyTypeTable, type: 'CHOICE', condition: (choices) => choices.leadership?.name === 'Oligarchy' },
        { key: 'populationWealth', title: 'its population wealth', table: populationWealthTable, type: 'DERIVED', modifierKey: 'populationWealth' },
        { key: 'crime', title: 'its crime level', table: crimeTable, type: 'DERIVED', modifierKey: 'crime' },
        { key: 'break2', type: 'BREAKPOINT', stepName: "Step 2: Population & Authority" },
        { key: 'shops', type: 'MULTIPLE', stepName: 'Shop Locations', table: shopsTable, countSource: shopLocationsData },
        { key: 'services', type: 'MULTIPLE', stepName: 'Service Locations', table: servicesTable, countSource: serviceLocationsData },
        { key: 'worshipDecision', title: "if there is a place of worship", prompt: "Is there a place of worship in the settlement?", table: placeOfWorshipDecisionTable, type: 'CHOICE' },
        { key: 'worshipSize', title: "the size of the place of worship", prompt: "How large is the place of worship?", table: placeOfWorshipSizeTable, type: 'CHOICE', condition: (choices) => choices.worshipDecision?.name === 'Yes' },
        { key: 'fervency', title: "the fervency of the local following", prompt: "Select the local fervency:", table: fervencyTable, type: 'CHOICE', condition: (choices) => choices.worshipDecision?.name === 'Yes' },
        { key: 'break3', type: 'BREAKPOINT', stepName: "Step 3: Locations & Religion" },
        { key: 'recentHistory', title: "its recent history", prompt: "Select a recent historical event:", table: recentHistoryTable, type: 'CHOICE' },
        { key: 'event', title: "a current event", prompt: "Select a current event:", table: eventsTable, type: 'CHOICE' },
        { key: 'opportunity', title: "a potential opportunity", prompt: "Select a potential opportunity:", table: opportunitiesTable, type: 'CHOICE' },
        { key: 'dangerLevel', title: "the local danger level", prompt: "Select the local danger level:", table: dangerLevelTable, type: 'CHOICE' },
        { key: 'dangerType', title: "the type of danger", prompt: "Select the type of danger:", table: dangerTypeTable, type: 'CHOICE' },
        { key: 'break4', type: 'BREAKPOINT', stepName: "Step 4: Extra Intrigue" },
    ],
    'Village': [
        // --- STEP 1: Core Details & History ---
        { key: 'age', title: "its age", prompt: "Select the village's age:", table: villageAges, type: 'CHOICE' },
        { key: 'hardships', title: "any hardships it has faced", prompt: "Select the village's hardship likelihood:", type: 'HARDSHIP' },
        { key: 'size', title: "its size", table: villageSizeTable, type: 'DERIVED', modifierKey: 'size' },
        { key: 'condition', title: "its condition", table: villageConditionTable, type: 'DERIVED', modifierKey: 'condition' },
        { key: 'environment', title: "its surrounding environment", prompt: "Select an environment:", table: environmentTable, type: 'CHOICE' },
        { key: 'specialty', title: "its specialty", prompt: "Select the village's specialty:", table: villageSpecialtyTable, type: 'CHOICE' },
        { key: 'resource', title: "its primary resource", prompt: "Select the village's primary resource:", table: villageResourceTable, type: 'CHOICE' },
        { key: 'recentHistory', title: "its recent history", prompt: "Select the village's recent history:", table: villageHistoryTable, type: 'CHOICE' },
        { key: 'break1', type: 'BREAKPOINT', stepName: "Step 1: Core Details & History" },
        
        // --- STEP 2: Community ---
        { key: 'populationDensity', title: 'its population density', table: villagePopulationDensityTable, type: 'DERIVED', modifierKey: 'populationDensity' },
        { key: 'disposition', title: 'the disposition of the locals', table: dispositionTable, type: 'DERIVED', modifierKey: 'disposition' },
        { key: 'lawEnforcement', title: 'its law enforcement', table: villageLawEnforcementTable, type: 'DERIVED', modifierKey: 'lawEnforcement' },
        { key: 'leadership', title: 'its leadership', prompt: "Select the village's leadership:", table: villageLeadershipTable, type: 'CHOICE' },
        { key: 'populationWealth', title: 'its population wealth', table: villagePopulationWealthTable, type: 'DERIVED', modifierKey: 'populationWealth' },
        { key: 'crime', title: 'its crime level', table: villageCrimeTable, type: 'DERIVED', modifierKey: 'crime' },
        { key: 'break2', type: 'BREAKPOINT', stepName: "Step 2: Community" },

        // --- STEP 3: Points of Interest ---
        { key: 'worshipPlaces', title: 'its places of worship', type: 'WORSHIP_PLACES', countSource: placesOfWorshipCountData },
        { key: 'gatheringPlaces', title: 'its places of gathering', type: 'GATHERING_PLACES', countSource: gatheringPlacesCountData },
        { key: 'villageLocations', title: 'its other locations', type: 'VILLAGE_LOCATIONS', countSource: otherLocationsCountData },
        { key: 'break3', type: 'BREAKPOINT', stepName: "Step 3: Points of Interest" },
        
        // --- STEP 4: Extra Intrigue ---
        { key: 'event', title: "a current event", prompt: "Select a current event:", table: villageEventsTable, type: 'CHOICE' },
        { key: 'politicalRumor', title: "a political rumor", prompt: "Select a political rumor:", table: politicalRumorsTable, type: 'CHOICE' },
        { key: 'opportunity', title: 'a local opportunity', prompt: 'Select a local opportunity:', table: villageOpportunitiesTable, type: 'CHOICE' },
        { key: 'dangerLevel', title: 'the local danger level', table: villageDangerLevelTable, type: 'DERIVED', modifierKey: 'dangerLevel' },
        { key: 'dangerType', title: 'the type of danger', prompt: 'Select the type of danger:', table: villageDangerTypeTable, type: 'CHOICE', condition: (choices) => choices.dangerLevel?.name !== 'No Danger or Hazards' },
    ],
};

// --- STEP PROCESSORS ---
const stepProcessors = {
    CHOICE: async (step, { isAutoRolling }) => {
        const choice = isAutoRolling
            ? rollOnTable(step.table)
            : (await inquirer.prompt([{
                type: 'list', name: 'choice', message: step.prompt,
                choices: step.table.map(item => ({
                    name: `${chalk.white(`[${item.dice || `${item.min}-${item.max}`}]`)} ${chalk.bold(item.name)}: ${item.description || ''}`,
                    value: item
                })),
                loop: false, pageSize: 15,
            }])).choice;
        console.log(`  ${chalk.magenta('Result:')} ${chalk.white(choice.name)}`);
        return { key: step.key, value: choice };
    },

    HIRED_HELP_SIZE_CHOICE: async (step, { isAutoRolling }) => {
        const choice = await getHiredHelpSize(isAutoRolling);
        console.log(`  ${chalk.magenta('Result:')} ${chalk.white(choice.name)}`);
        return { key: step.key, value: choice };
    },

    DERIVED: async (step, { modifiers, isAutoRolling }) => {
        const modifier = (modifiers[step.modifierKey] || 0) + (modifiers[`${step.modifierKey}Penalty`] || 0);
        
        if (isAutoRolling) {
            const baseRoll = rollDice(1, 20);
            const finalScore = applyModifierAndClamp(baseRoll, modifier, 1, 20);
            const result = step.table.find(item => finalScore >= item.min && finalScore <= item.max);

            if (result) {
                console.log(`  ${chalk.magenta('Result:')} ${chalk.white(result.name)}`);
                console.log(`  ${chalk.gray(`(Rolled ${baseRoll}, Modifier ${modifier >= 0 ? '+' : ''}${modifier}, Final ${finalScore})`)}`);
                const rollDetail = { base: baseRoll, modifier, final: finalScore };
                return { key: step.key, value: result, rollDetail };
            }
        } else {
            console.log(chalk.gray(`  (Current modifier for this roll is ${modifier >= 0 ? '+' : ''}${modifier})`));
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
                ]
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
                ]
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
                ]
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
    }
};

// --- SUMMARY AND EXPORT FUNCTIONS ---

function displaySummary(choices, settlementName, rollDetails, currentModifiers) {
    console.log(chalk.bold.yellow('\n\n================================'));
    console.log(chalk.bold.yellow('   Final Settlement Summary   '));
    console.log(chalk.bold.yellow('================================\n'));

    console.log(`${chalk.bold.cyan('Name:')} ${chalk.bold.yellowBright(settlementName)}`);
    console.log(`${chalk.bold.cyan('Type:')} ${chalk.white(choices.type.name)}`);

    for (const key in choices) {
        if (key === 'type') continue;
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
            } else if (key === 'gatheringPlaces' || key === 'villageLocations') {
                 choice.forEach((place, index) => {
                    console.log(`${chalk.green(`  - Location #${index + 1}:`)} ${chalk.white(place.name)}`);
                });
            } else { 
                choice.forEach(entry => {
                    console.log(`${chalk.green('  -')} ${chalk.white(entry.item.name)}`);
                    if (entry.size) console.log(`    ${chalk.magenta('↳ Size:')} ${chalk.gray(entry.size.name)}`);
                });
            }
        } else if (choice && choice.name) {
            console.log(`${chalk.bold.cyan(keyName + ':')} ${chalk.white(choice.name)}`);
        }
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

async function handleExport(choices, settlementName) {
    const { shouldSave } = await inquirer.prompt([{
        type: 'confirm', name: 'shouldSave', message: 'Save this settlement to a text file?', default: true,
    }]);

    if (shouldSave) {
        let content = `================================\n   ${settlementName.toUpperCase()}   \n================================\n\n`;
        content += `Name: ${settlementName}\nType: ${choices.type.name}\n\n`;
        for (const key in choices) {
            if (key === 'type') continue;
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
                } else if (key === 'gatheringPlaces' || key === 'villageLocations') {
                    choice.forEach((place, index) => {
                        content += `- Location #${index + 1}: ${place.name}\n`;
                        content += `  ${place.description}\n`;
                    });
                } else {
                    choice.forEach(entry => {
                        content += `- ${entry.item.name}\n`;
                        if (entry.item.description) content += `  ${entry.item.description}\n`;
                        if (entry.size) content += `  Size: ${entry.size.name}\n  ${entry.size.description}\n`;
                    });
                }
                content += `\n`;
            } else if (choice && choice.name) {
                content += `${keyName}: ${choice.name}\n`;
                if (choice.description) content += `  - ${choice.description}\n\n`;
            }
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
    const modifiers = { 
        visitorTraffic: 0, quality: 0, urbanEncounter: 0, // Trading Post
        populationDensity: 0, hardshipLikelihood: 0, size: 0, condition: 0, disposition: 0, lawEnforcement: 0, populationWealth: 0, crime: 0, dangerLevel: 0, // Village
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
                modeState
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
    displaySummary(choices, settlementName, rollDetails, modifiers);
    await handleExport(choices, settlementName);
}

export { startAdventure };