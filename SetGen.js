// SetGen.js

// --- MODIFIED: Added the 'fs' module for file system operations ---
import fs from 'fs/promises';
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

function rollOnTable(table) {
    if (table[0].min !== undefined) {
        const maxRoll = table[table.length - 1].max;
        const roll = rollDice(1, maxRoll);
        return table.find(item => roll >= item.min && roll <= item.max);
    }
    else {
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
    if (isAutoRolling) {
        return rollHiredHelpSize();
    }
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

function formatKeyName(key) {
    return key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim();
}

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

// --- NEW: Function to sanitize the filename ---
function sanitizeFilename(name) {
    // This removes any characters that are not allowed in filenames on most operating systems.
    return name.replace(/[\/\\?%*:|"<>]/g, '-');
}

// --- NEW: Function to format the final choices object into a string for the text file ---
function formatForExport(choices, settlementName) {
    let content = `================================\n`;
    content += `   ${settlementName.toUpperCase()}   \n`;
    content += `================================\n\n`;

    content += `Name: ${settlementName}\n`;
    content += `Type: ${choices.type.name}\n\n`;

    for (const key in choices) {
        if (key === 'type') continue;
        const choice = choices[key];
        const keyName = formatKeyName(key);

        if (Array.isArray(choice)) {
            content += `--- ${keyName.toUpperCase()} ---\n`;
            if (choice.length === 0) {
                content += `(None)\n`;
            } else {
                choice.forEach(entry => {
                    content += `- ${entry.item.name}\n`;
                    if (entry.item.description) {
                        content += `  ${entry.item.description}\n`;
                    }
                    if (entry.size) {
                        content += `  Size: ${entry.size.name}\n`;
                        content += `  ${entry.size.description}\n`;
                    }
                });
            }
            content += `\n`;
        } else if (choice && choice.name) {
             content += `${keyName}: ${choice.name}\n`;
             if (choice.description) {
                content += `  - ${choice.description}\n\n`;
             }
        }
    }
    return content;
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
async function startAdventure(autoRollEnabled = false) {
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
    let generationComplete = false;

    let currentMode = autoRollEnabled ? 'autoRollAll' : 'manual';

    function applyModifiersFromChoice(choice) {
        if (!choice || !choice.modifiers) return;
        for (const key in choice.modifiers) {
            if (currentModifiers.hasOwnProperty(key)) {
                currentModifiers[key] += choice.modifiers[key];
            }
        }
    }

    if (currentMode === 'autoRollAll') {
        console.log(chalk.bold.magenta('--- Auto-Roll Mode Enabled ---'));
    } else {
        console.log(chalk.bold.cyan('Starting the Settlement Generator...'));
    }
    
    const { settlementType } = await inquirer.prompt([{ type: 'list', name: 'settlementType', message: 'Choose a settlement type to begin:', choices: settlementTypes, loop: false }]);
    choices.type = { name: settlementType };

    const path = settlementPaths[settlementType];

    for (const step of path) {
        if (generationComplete) break;
        if (step.condition && !step.condition(choices)) continue;

        const isAutoRolling = currentMode !== 'manual';

        if (step.title) {
            console.log(chalk.bold.cyan(`\nDetermining ${step.title}...`));
        }

        switch(step.type) {
            case 'CHOICE': {
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
                choices[step.key] = choice;
                applyModifiersFromChoice(choice);
                break;
            }
            case 'HIRED_HELP_SIZE_CHOICE': {
                const choice = await getHiredHelpSize(isAutoRolling);
                console.log(`  ${chalk.magenta('Result:')} ${chalk.white(choice.name)}`);
                choices[step.key] = choice;
                break;
            }
            case 'BREAKPOINT': {
                if (currentMode === 'autoRollAll') {
                    console.log(chalk.gray(`--- Reached ${step.stepName}, continuing automatically. ---`));
                    continue;
                }
                if (currentMode === 'autoRollSection') {
                    currentMode = 'manual';
                }

                console.log(chalk.bold.green(`\n--- End of ${step.stepName} ---`));
                const { breakChoice } = await inquirer.prompt([{
                    type: 'list', name: 'breakChoice', message: 'What would you like to do?',
                    choices: ['Continue', 'Auto-Roll: Section', 'Auto-Roll: Finish', 'Done'],
                    loop: false,
                }]);

                if (breakChoice === 'Auto-Roll: Section') currentMode = 'autoRollSection';
                else if (breakChoice === 'Auto-Roll: Finish') currentMode = 'autoRollAll';
                else if (breakChoice === 'Done') generationComplete = true;
                break;
            }
            case 'DERIVED': {
                const baseRoll = rollDice(1, 20);
                const finalScore = applyModifierAndClamp(baseRoll, currentModifiers[step.modifierKey], 1, 20);
                const result = step.table.find(item => finalScore >= item.min && finalScore <= item.max);
                
                if (result) {
                    console.log(`  ${chalk.magenta('Result:')} ${chalk.white(result.name)}`);
                    console.log(`  ${chalk.gray(`(Rolled ${baseRoll}, Modifier ${currentModifiers[step.modifierKey] >= 0 ? '+' : ''}${currentModifiers[step.modifierKey]}, Final ${finalScore})`)}`);
                    choices[step.key] = result;
                    rollDetails[step.key] = { base: baseRoll, modifier: currentModifiers[step.modifierKey], final: finalScore };
                    applyModifiersFromChoice(result);
                }
                break;
            }
            case 'MULTIPLE': {
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
                        if (item) {
                            let size = item.name.includes('Hired Help') ? rollHiredHelpSize() : null;
                            chosenItems.push({ item, size });
                        }
                    }
                    if (chosenItems.length === 0) {
                         console.log(chalk.gray('  -> None were generated.'));
                    } else {
                        chosenItems.forEach(entry => {
                            let output = `${chalk.green('  -')} ${chalk.white(entry.item.name)}`;
                            if (entry.size) output += chalk.gray(` (Size: ${entry.size.name})`);
                            console.log(output);
                        });
                    }
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
                                })),
                            ],
                            loop: false, pageSize: 15
                        }]);

                        if (manualItemChoice === 'done') break;
                        let size = manualItemChoice.name.includes('Hired Help') ? await getHiredHelpSize(false) : null;
                        chosenItems.push({ item: manualItemChoice, size });
                    }
                }
                choices[step.key] = chosenItems;
                break;
            }
        }
    }
    
    // --- FINAL SUMMARY ---
    const settlementName = generateSettlementName();

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
        if(details.final !== undefined) {
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

    // --- NEW: Ask to save the file ---
    const { shouldSave } = await inquirer.prompt([
        {
            type: 'confirm',
            name: 'shouldSave',
            message: 'Save this settlement to a text file?',
            default: true,
        },
    ]);

    if (shouldSave) {
        const filename = `${sanitizeFilename(settlementName)}.txt`;
        const content = formatForExport(choices, settlementName);
        try {
            await fs.writeFile(filename, content);
            console.log(chalk.green(`\nSettlement saved successfully as ${chalk.bold(filename)}`));
        } catch (error) {
            console.error(chalk.red(`\nError saving file: ${error.message}`));
        }
    }
}

export { startAdventure };
