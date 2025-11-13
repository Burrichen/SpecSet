// SetGen.js

import inquirer from 'inquirer';
import chalk from 'chalk';
import { tradingPostOrigins, tradingPostSpecialties, foodAndDrink, tradingPostAges, tradingPostConditions, visitorTrafficTable, tradingPostSizeTable, residentPopulationTable, lawEnforcementTable, leadershipTable, populationWealthTable, crimeTable, shopLocationsData, shopsTable, serviceLocationsData, placeOfWorshipDecisionTable, placeOfWorshipSizeTable } from './tradingpost.js';
import { hiredHands, environmentTable, dispositionTable, oligarchyTypeTable, servicesTable, hiredHelpSizeTable, fervencyTable } from './commonTables.js';

// --- HELPER FUNCTIONS ---

function rollDice(count, size) {
    let total = 0;
    for (let i = 0; i < count; i++) {
        total += Math.floor(Math.random() * size) + 1;
    }
    return total;
}

function applyModifierAndClamp(baseValue, modifier, min, max) {
  let finalValue = baseValue + modifier;
  if (finalValue < min) finalValue = min;
  if (finalValue > max) finalValue = max;
  return finalValue;
}

async function getHiredHelpSize() {
    console.log(chalk.bold.cyan(`\nWhat is the size of this hired help group?`));
    const { size } = await inquirer.prompt([
        {
            type: 'list',
            name: 'size',
            message: 'Select Hired Help Size:',
            choices: hiredHelpSizeTable.map(item => {
                const rollDisplay = `[${item.min}-${item.max}]`;
                return { name: `${chalk.white(rollDisplay)} ${chalk.bold(item.name)}`, value: item };
            }),
            loop: false,
        }
    ]);
    return size;
}

function rollHiredHelpSize() {
    const roll = rollDice(1, 12);
    return hiredHelpSizeTable.find(item => roll >= item.min && roll <= item.max);
}

// --- DATA: SETTLEMENT TYPES (UNCHANGED) ---
const settlementOrigins = {
  'Trading Post': tradingPostOrigins,
  'Village': [],
  'Town': [],
  'City': [],
  'Capital': [],
  'Fortress': [],
};

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
        // --- STEP 1 ---
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

        // --- STEP 2 ---
        { key: 'population', title: "its population density", prompt: "Select the resident population level:", table: residentPopulationTable, type: 'CHOICE' },
        { key: 'disposition', title: "the disposition of the locals", prompt: "Select the resident disposition:", table: dispositionTable, type: 'CHOICE' },
        { key: 'lawEnforcement', title: "the state of law enforcement", prompt: "Select the law enforcement level:", table: lawEnforcementTable, type: 'CHOICE' },
        { key: 'leadership', title: "who is in charge", prompt: "Select the leadership type:", table: leadershipTable, type: 'CHOICE' },
        { key: 'oligarchyType', title: "the kind of oligarchy", prompt: "Select the oligarchy type:", table: oligarchyTypeTable, type: 'CHOICE', condition: (choices) => choices.leadership?.name === 'Oligarchy' },
        { key: 'populationWealth', type: 'DERIVED', table: populationWealthTable, modifierKey: 'populationWealth', dice: 'd20' },
        { key: 'crime', type: 'DERIVED', table: crimeTable, modifierKey: 'crime', dice: 'd20' },
        { key: 'break2', type: 'BREAKPOINT', stepName: "Step 2: Population & Authority" },

        // --- STEP 3 ---
        { key: 'shops', type: 'MULTIPLE', stepName: 'Shop Locations', table: shopsTable, countSource: shopLocationsData },
        { key: 'services', type: 'MULTIPLE', stepName: 'Service Locations', table: servicesTable, countSource: serviceLocationsData },
        { key: 'worshipDecision', title: "if there is a place of worship", prompt: "Is there a place of worship in the settlement?", table: placeOfWorshipDecisionTable, type: 'CHOICE' },
        { key: 'worshipSize', title: "the size of the place of worship", prompt: "How large is the place of worship?", table: placeOfWorshipSizeTable, type: 'CHOICE', condition: (choices) => choices.worshipDecision?.name === 'Yes' },
        { key: 'fervency', title: "the fervency of the local following", prompt: "Select the local fervency:", table: fervencyTable, type: 'CHOICE', condition: (choices) => choices.worshipDecision?.name === 'Yes' },
    ]
};

// --- THE "SMART CHEF" ---
async function startAdventure() {
    const currentModifiers = {
        visitorTraffic: 0,
        populationWealth: 0,
        size: 0,
        crime: 0,
        quality: 0,
        urbanEncounter: 0,
    };
    
    let choices = {};
    let rollDetails = {};

    function applyModifiersFromChoice(choice) {
        if (!choice || !choice.modifiers) return;
        for (const key in choice.modifiers) {
            if (currentModifiers.hasOwnProperty(key)) {
                currentModifiers[key] += choice.modifiers[key];
            }
        }
    }

    console.log(chalk.bold.cyan('Starting the Settlement Generator...'));
    
    const { settlementType } = await inquirer.prompt([{ type: 'list', name: 'settlementType', message: 'Choose a settlement type to begin:', choices: settlementTypes, loop: false }]);
    choices.type = { name: settlementType };

    const path = settlementPaths[settlementType];

    for (const step of path) {
        if (step.condition && !step.condition(choices)) {
            continue;
        }

        switch(step.type) {
            case 'CHOICE': {
                console.log(chalk.bold.cyan(`\nNow, let's determine ${step.title}.`));
                const { choice } = await inquirer.prompt([{
                    type: 'list', name: 'choice', message: step.prompt,
                    choices: step.table.map(item => {
                        let rollDisplay = item.dice ? `[${item.dice}]` : `[${item.min}-${item.max}]`;
                        return { name: `${chalk.white(rollDisplay)} ${chalk.bold(item.name)}: ${item.description || ''}`, value: item };
                    }),
                    loop: false, pageSize: 15,
                }]);
                choices[step.key] = choice;
                applyModifiersFromChoice(choice);
                break;
            }
            case 'HIRED_HELP_SIZE_CHOICE': {
                choices[step.key] = await getHiredHelpSize();
                break;
            }
            case 'BREAKPOINT': {
                console.log(chalk.bold.green(`\n--- End of ${step.stepName} ---`));
                // A simplified summary will be displayed dynamically later
                
                const { breakChoice } = await inquirer.prompt([{
                    type: 'list', name: 'breakChoice', message: `You have completed ${step.stepName}. What next?`,
                    choices: ['Continue', 'Auto-Roll (Coming Soon)', 'Exit here'], loop: false,
                }]);

                if (breakChoice === 'Auto-Roll (Coming Soon)') {
                    console.log(chalk.yellow('\nThis feature will be implemented in the future!'));
                    return;
                }
                if (breakChoice === 'Exit here') {
                    // Display full detailed summary and exit
                    return;
                }
                break;
            }
            case 'DERIVED': {
                const baseRoll = rollDice(1, 20); // Assumes d20, future proof by using step.dice
                const finalScore = applyModifierAndClamp(baseRoll, currentModifiers[step.modifierKey], 1, 20);
                const result = step.table.find(item => finalScore >= item.min && finalScore <= item.max);
                if (result) {
                    choices[step.key] = result;
                    rollDetails[step.key] = { base: baseRoll, modifier: currentModifiers[step.modifierKey], final: finalScore };
                    applyModifiersFromChoice(result);
                }
                break;
            }
            case 'MULTIPLE': {
                let numberOfItems = 0;
                let details = {};
                let chosenItems = [];

                if (choices.size && step.countSource[choices.size.name]) {
                    const calcData = step.countSource[choices.size.name];
                    const baseRoll = rollDice(calcData.dieCount, calcData.dieSize);
                    numberOfItems = baseRoll + calcData.bonus;
                    details = { base: baseRoll, bonus: calcData.bonus, formula: `${calcData.dieCount}d${calcData.dieSize}+${calcData.bonus}` };
                }
                rollDetails[step.key] = details;

                console.log(chalk.bold.cyan(`\nBased on its size, this settlement has ${numberOfItems} ${step.stepName.toLowerCase()}.`));
                const { choiceMethod } = await inquirer.prompt([{
                    type: 'list', name: 'choiceMethod', message: `How would you like to determine the ${step.stepName.toLowerCase()}?`,
                    choices: ['Auto-Roll', 'Manual Selection'], loop: false,
                }]);

                if (choiceMethod === 'Auto-Roll') {
                    let reroll = true;
                    while(reroll) {
                        let rolledItems = [];
                        for (let i = 0; i < numberOfItems; i++) {
                            const roll = rollDice(1, 100);
                            const item = step.table.find(s => roll >= s.min && roll <= s.max);
                            if (item) {
                                let size = null;
                                if (item.name.includes('Hired Help')) size = rollHiredHelpSize();
                                rolledItems.push({ item, size });
                            }
                        }

                        console.clear();
                        console.log(chalk.bold.yellow(`\n--- Rolled ${step.stepName} ---`));
                        rolledItems.forEach(entry => {
                            console.log(chalk.white(`- ${entry.item.name}`));
                            if (entry.size) console.log(chalk.gray(`  ↳ Size: ${entry.size.name}`));
                        });

                        const { rerollChoice } = await inquirer.prompt([
                            { type: 'list', name: 'rerollChoice', message: 'Are you happy with this selection?', choices: ['I\'m fine', 'Re-Roll!'], loop: false }
                        ]);
                        if (rerollChoice === 'I\'m fine') {
                            chosenItems = rolledItems;
                            reroll = false;
                        }
                    }
                } else { // Manual Selection
                    while (chosenItems.length < numberOfItems) {
                        console.clear();
                        console.log(chalk.bold.yellow(`\n--- Manual ${step.stepName} Selection ---`));
                        console.log(chalk.white(`You can select up to ${numberOfItems}. (${chosenItems.length} selected so far)`));
                        if (chosenItems.length > 0) {
                            const currentSelection = chosenItems.map(entry => entry.item.name + (entry.size ? ` (${entry.size.name})` : '')).join(', ');
                            console.log(chalk.gray('Current Items: ' + currentSelection));
                        }

                        const itemChoices = [
                            { name: chalk.bold.red('--- I\'m done selecting ---'), value: 'done' },
                            new inquirer.Separator(),
                            ...step.table.map(item => ({
                                name: `[${String(item.min).padStart(2, '0')}-${String(item.max).padStart(2, '0')}] ${chalk.bold(item.name)}`,
                                value: item
                            })),
                        ];

                        const { manualItemChoice } = await inquirer.prompt([
                            { type: 'list', name: 'manualItemChoice', message: 'Select an item to add:', choices: itemChoices, loop: false, pageSize: 15 }
                        ]);

                        if (manualItemChoice === 'done') break;
                        let size = null;
                        if (manualItemChoice.name.includes('Hired Help')) size = await getHiredHelpSize();
                        chosenItems.push({ item: manualItemChoice, size });
                    }
                }
                choices[step.key] = chosenItems;
                break;
            }
        }
    }
    
    // --- FINAL SUMMARY ---
    console.log(chalk.bold.green('\n--- Final Settlement Summary ---'));
    console.log(chalk.yellow(`Type: ${choices.type.name}`));
    // This is a simplified dynamic summary. A more complex one would be needed for perfect formatting.
    for (const key in choices) {
        if (key === 'type' || key.endsWith('Count') || key.endsWith('RollDetails')) continue;

        const choice = choices[key];
        if (Array.isArray(choice)) { // For Shops and Services
            console.log(chalk.rgb(100, 255, 100)(`${key.charAt(0).toUpperCase() + key.slice(1)} (${choices[key+'Count']}):`));
            choice.forEach(entry => {
                console.log(chalk.rgb(150, 255, 150)(`  - ${entry.item.name}`));
                if (entry.size) console.log(chalk.rgb(180, 255, 180)(`    ↳ Size: ${entry.size.name}`));
            });
        } else if (choice && choice.name) { // For single choices
             console.log(chalk.white(`${key.charAt(0).toUpperCase() + key.slice(1)}: ${choice.name}`));
        }
    }

    console.log(chalk.bold.yellow('\n--- Background Modifier Tracking (For Future Use) ---'));
    for (const key in rollDetails) {
        const details = rollDetails[key];
        console.log(chalk.white(`${key} Roll: ${details.base} | Modifier: ${details.modifier >= 0 ? '+' : ''}${details.modifier} | Final: ${details.final}`));
    }
    for (const key in currentModifiers) {
        console.log(chalk.white(`Final ${key} Modifier Collected: ${currentModifiers[key] >= 0 ? '+' : ''}${currentModifiers[key]}`));
    }
    
    console.log(chalk.bold.green('----------------------------------------------------'));
}

export { startAdventure };