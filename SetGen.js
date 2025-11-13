// SetGen.js

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
        { key: 'populationWealth', type: 'DERIVED', table: populationWealthTable, modifierKey: 'populationWealth', dice: 'd20' },
        { key: 'crime', type: 'DERIVED', table: crimeTable, modifierKey: 'crime', dice: 'd20' },
        { key: 'break2', type: 'BREAKPOINT', stepName: "Step 2: Population & Authority" },
        { key: 'shops', type: 'MULTIPLE', stepName: 'Shop Locations', table: shopsTable, countSource: shopLocationsData },
        { key: 'services', type: 'MULTIPLE', stepName: 'Service Locations', table: servicesTable, countSource: serviceLocationsData },
        { key: 'worshipDecision', title: "if there is a place of worship", prompt: "Is there a place of worship in the settlement?", table: placeOfWorshipDecisionTable, type: 'CHOICE' },
        { key: 'worshipSize', title: "the size of the place of worship", prompt: "How large is the place of worship?", table: placeOfWorshipSizeTable, type: 'CHOICE', condition: (choices) => choices.worshipDecision?.name === 'Yes' },
        { key: 'fervency', title: "the fervency of the local following", prompt: "Select the local fervency:", table: fervencyTable, type: 'CHOICE', condition: (choices) => choices.worshipDecision?.name === 'Yes' },
    ]
};

// --- REFACTORED: STEP PROCESSORS ---
// Each function handles a specific step type. This makes the main loop simple and scalable.
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

    DERIVED: async (step, { choices, modifiers }) => {
        const baseRoll = rollDice(1, 20);
        const modifier = modifiers[step.modifierKey] || 0;
        const finalScore = applyModifierAndClamp(baseRoll, modifier, 1, 20);
        const result = step.table.find(item => finalScore >= item.min && finalScore <= item.max);

        if (result) {
            console.log(`  ${chalk.magenta('Result:')} ${chalk.white(result.name)}`);
            console.log(`  ${chalk.gray(`(Rolled ${baseRoll}, Modifier ${modifier >= 0 ? '+' : ''}${modifier}, Final ${finalScore})`)}`);
            const rollDetail = { base: baseRoll, modifier, final: finalScore };
            return { key: step.key, value: result, rollDetail };
        }
        return null;
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
    }
};

// --- REFACTORED: SUMMARY AND EXPORT FUNCTIONS ---
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
            if (choice.length === 0) console.log(chalk.gray('  (None)'));
            else choice.forEach(entry => {
                console.log(`${chalk.green('  -')} ${chalk.white(entry.item.name)}`);
                if (entry.size) console.log(`    ${chalk.magenta('↳ Size:')} ${chalk.gray(entry.size.name)}`);
            });
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
                if (choice.length === 0) content += `(None)\n`;
                else choice.forEach(entry => {
                    content += `- ${entry.item.name}\n`;
                    if (entry.item.description) content += `  ${entry.item.description}\n`;
                    if (entry.size) content += `  Size: ${entry.size.name}\n  ${entry.size.description}\n`;
                });
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

// --- REFACTORED: MAIN ADVENTURE FUNCTION ---
// This function is now a high-level coordinator. The complex logic is handled by the processors.
async function startAdventure(autoRollEnabled = false) {
    const choices = {};
    const rollDetails = {};
    const modifiers = { visitorTraffic: 0, populationWealth: 0, size: 0, crime: 0, quality: 0, urbanEncounter: 0 };
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

    const settlementName = generateSettlementName();
    displaySummary(choices, settlementName, rollDetails, modifiers);
    await handleExport(choices, settlementName);
}

export { startAdventure };