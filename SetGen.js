// SetGen.js

import inquirer from 'inquirer';
import chalk from 'chalk';
import { tradingPostOrigins, tradingPostSpecialties, foodAndDrink, tradingPostAges, tradingPostConditions, visitorTrafficTable, tradingPostSizeTable, residentPopulationTable, lawEnforcementTable, leadershipTable, populationWealthTable, crimeTable, shopLocationsData, shopsTable } from './tradingpost.js';
import { hiredHands, environmentTable, dispositionTable, oligarchyTypeTable } from './commonTables.js';

const settlementOrigins = {
  'Trading Post': tradingPostOrigins,
  'Village': [
    { dice: 1, name: 'Fertile Valley', description: 'A farming community that sprang up in a lush, protected valley.' },
    { dice: 2, name: 'River Crossing', description: 'Started as a small ferry point across a significant river.' },
    { dice: 3, name: 'Sacred Grove', description: 'A settlement founded by those who revere a nearby ancient forest.' },
    { dice: 4, name: 'Refuge', description: 'A hidden village created by people fleeing war or persecution.' },
  ],
  'Town': [
    { dice: 1, name: 'Strategic Pass', description: 'Grew from a military outpost guarding a critical mountain pass.' },
    { dice: 2, name: 'Industrial Boom', description: 'Expanded rapidly due to a recent technological advancement.' },
    { dice: 3, name: 'Pilgrimage Site', description: 'A town that caters to travelers visiting a holy shrine.' },
    { dice: 4, name: 'Crossroads Inn', description: 'What began as a popular inn has grown into a bustling town.' },
  ],
  'City': [
    { dice: 1, name: 'Royal Decree', description: 'A city planned and built by order of a powerful monarch.' },
    { dice: 2, name: 'Confluence', description: 'Founded at the meeting point of two great rivers.' },
    { dice: 3, name: 'Academic Center', description: 'Grew around a prestigious university or magical academy.' },
    { dice: 4, name: 'Trade Capital', description: 'Evolved from a small trading post into a major commercial hub.' },
  ],
  'Capital': [
    { dice: 1, name: 'Ancient Stronghold', description: 'The capital was built within the walls of an ancient, unconquerable fortress.' },
    { dice: 2, name: 'Center of Power', description: 'Designated as the capital due to its central location in the kingdom.' },
    { dice: 3, name: 'Divine Mandate', description: 'A holy city chosen by the gods to be the seat of power.' },
    { dice: 4, name: 'Legacy of a Hero', description: 'Founded by a legendary hero, its capital status honors their memory.' },
  ],
  'Fortress': [
    { dice: 1, name: 'Border Defense', description: 'A heavily fortified bastion built to defend a national border.' },
    { dice: 2, name: 'Mountain Citadel', description: 'Carved into the side of a mountain, a near-impregnable stronghold.' },
    { dice: 3, name: 'Island Bastion', description: 'An isolated fortress on a remote island, often used as a prison or naval base.' },
    { dice: 4, name: 'Guardian of the Pass', description: 'A fortress built to control a vital and treacherous mountain route.' },
  ],
};

const settlementTypes = [
  { name: 'Trading Post', value: 'Trading Post' },
  { name: 'Village', value: 'Village' },
  { name: 'Town', value: 'Town' },
  { name: 'City', value: 'City' },
  { name: 'Capital', value: 'Capital' },
  { name: 'Fortress', value: 'Fortress' },
];

function rollDice(count, size) {
    let total = 0;
    for (let i = 0; i < count; i++) {
        total += Math.floor(Math.random() * size) + 1;
    }
    return total;
}

async function startAdventure() {
  const currentModifiers = {
    visitorTraffic: 0,
    populationWealth: 0,
    size: 0,
    crime: 0,
    quality: 0,
    urbanEncounter: 0,
  };

  let chosenOrigin = null;
  let chosenSpecialty = null;
  let chosenSubSpecialty = null;
  let chosenAge = null;
  let chosenCondition = null;
  let visitorTrafficResult = null;
  let sizeResult = null;
  let chosenEnvironment = null;
  let chosenPopulation = null;
  let chosenDisposition = null;
  let chosenLawEnforcement = null;
  let chosenLeadership = null;
  let chosenOligarchyType = null;
  let populationWealthResult = null;
  let crimeResult = null;
  let numberOfShops = null;
  let shopRollDetails = {};
  let chosenShops = [];

  function applyModifiersFromChoice(choice) {
    if (choice.modifiers) {
      for (const key in choice.modifiers) {
        if (currentModifiers.hasOwnProperty(key)) {
          currentModifiers[key] += choice.modifiers[key];
        }
      }
    }
  }

  console.log(chalk.bold.cyan('Starting the Settlement Generator...'));
  
  const { settlementType } = await inquirer.prompt([
    {
      type: 'list',
      name: 'settlementType',
      message: 'Choose a settlement type to begin:',
      choices: settlementTypes,
      loop: false,
    },
  ]);

  const origins = settlementOrigins[settlementType];
  
  console.log(chalk.bold.cyan(`\nYou have chosen: ${settlementType}. Now, let's determine its origin.`));
  
  const originResult = await inquirer.prompt([
    {
      type: 'list',
      name: 'chosenOrigin',
      message: 'Select an origin for your settlement:',
      choices: origins.map(origin => ({
        name: `${chalk.white(`[${origin.dice}]`)} ${chalk.bold(origin.name)}: ${origin.description}`,
        value: origin
      })),
      loop: false,
    },
  ]);
  chosenOrigin = originResult.chosenOrigin;
  applyModifiersFromChoice(chosenOrigin);

  if (settlementType === 'Trading Post') {
    console.log(chalk.bold.cyan(`\nAs a Trading Post, it has a specialty. What is it?`));
    
    const specialtyResult = await inquirer.prompt([
      {
        type: 'list', name: 'specialty', message: 'Select a specialty:',
        choices: tradingPostSpecialties.map(spec => ({
          name: `${chalk.white(`[${spec.dice}]`)} ${chalk.bold(spec.name)}: ${spec.description}`,
          value: spec,
        })),
        loop: false,
      },
    ]);
    chosenSpecialty = specialtyResult.specialty;
    applyModifiersFromChoice(chosenSpecialty);

    if (chosenSpecialty.name === 'Food & Drink') {
      console.log(chalk.bold.cyan(`\nWhat specific food or drink is it known for?`));
      const subSpecialtyResult = await inquirer.prompt([
        {
          type: 'list', name: 'sub', message: 'Select a food or drink:',
          choices: foodAndDrink.map(item => ({ name: `[${item.dice}] ${item.name}: ${item.description}`, value: item })),
          loop: false,
        },
      ]);
      chosenSubSpecialty = subSpecialtyResult.sub;
      applyModifiersFromChoice(chosenSubSpecialty);
    } else if (chosenSpecialty.name === 'Hired Hands') {
      console.log(chalk.bold.cyan(`\nWhat kind of hired hands operate here?`));
      const subSpecialtyResult = await inquirer.prompt([
        {
          type: 'list', name: 'sub', message: 'Select a hired hand type:',
          choices: hiredHands.map(item => ({ name: `[${item.dice}] ${item.name}: ${item.description}`, value: item })),
          loop: false,
        },
      ]);
      chosenSubSpecialty = subSpecialtyResult.sub;
      applyModifiersFromChoice(chosenSubSpecialty);
    }

    console.log(chalk.bold.cyan(`\nFinally, how old is the trading post?`));
    
    const ageResult = await inquirer.prompt([
      {
        type: 'list', name: 'age', message: 'Select an age:',
        choices: tradingPostAges.map(age => ({
          name: `${chalk.white(`[${age.dice}]`)} ${chalk.bold(age.name)}: ${age.description}`,
          value: age
        })),
        loop: false,
      },
    ]);
    chosenAge = ageResult.age;
    applyModifiersFromChoice(chosenAge);

    console.log(chalk.bold.cyan(`\nWhat is the current condition of the trading post?`));
    
    const conditionResult = await inquirer.prompt([
        {
            type: 'list', name: 'condition', message: 'Select a condition:',
            choices: tradingPostConditions.map(item => {
                const rollDisplay = item.min === item.max ? `[${item.min}]` : `[${item.min}-${item.max}]`;
                return {
                    name: `${chalk.white(rollDisplay)} ${chalk.bold(item.name)}: ${item.description}`,
                    value: item,
                };
            }),
            loop: false,
        },
    ]);
    chosenCondition = conditionResult.condition;
    applyModifiersFromChoice(chosenCondition);
  }

  console.log(chalk.bold.cyan(`\nWhat is the current level of Visitor Traffic?`));
  const visitorTrafficPromptResult = await inquirer.prompt([
    {
        type: 'list', name: 'traffic', message: 'Select the visitor traffic level:',
        choices: visitorTrafficTable.map(item => {
            const rollDisplay = item.min === item.max ? `[${item.min}]` : `[${item.min}-${item.max}]`;
            return {
                name: `${chalk.white(rollDisplay)} ${chalk.bold(item.name)}: ${item.description}`,
                value: item,
            };
        }),
        loop: false,
    },
  ]);
  visitorTrafficResult = visitorTrafficPromptResult.traffic;
  applyModifiersFromChoice(visitorTrafficResult);

  console.log(chalk.bold.cyan(`\nWhat is the size of the trading post?`));
  const sizePromptResult = await inquirer.prompt([
    {
        type: 'list', name: 'size', message: 'Select the settlement size:',
        choices: tradingPostSizeTable.map(item => {
            const rollDisplay = item.min === item.max ? `[${item.min}]` : `[${item.min}-${item.max}]`;
            return {
                name: `${chalk.white(rollDisplay)} ${chalk.bold(item.name)}: ${item.description}`,
                value: item,
            };
        }),
        loop: false,
    },
  ]);
  sizeResult = sizePromptResult.size;
  applyModifiersFromChoice(sizeResult);

  console.log(chalk.bold.cyan(`\nWhat is the surrounding environment?`));
  const environmentResult = await inquirer.prompt([
    {
      type: 'list',
      name: 'environment',
      message: 'Select an environment:',
      choices: environmentTable.map(item => ({
        name: `${chalk.white(`[${item.dice}]`)} ${chalk.bold(item.name)}: ${item.description}`,
        value: item
      })),
      loop: false,
    },
  ]);
  chosenEnvironment = environmentResult.environment;
  applyModifiersFromChoice(chosenEnvironment);

  console.log(chalk.bold.green('\n--- End of Step 1: Core Details ---'));
  console.log(chalk.yellow(`Type: ${settlementType}`));
  if (chosenOrigin) { console.log(chalk.white(`Origin: ${chosenOrigin.name}`)); }
  if (chosenSpecialty) { console.log(chalk.white(`Specialty: ${chosenSpecialty.name}`)); }
  if (chosenSubSpecialty) { console.log(chalk.white(`Sub-Specialty: ${chosenSubSpecialty.name}`)); }
  if (chosenAge) { console.log(chalk.white(`Age: ${chosenAge.name}`)); }
  if (chosenCondition) { console.log(chalk.white(`Condition: ${chosenCondition.name}`)); }
  if (visitorTrafficResult) { console.log(chalk.white(`Visitor Traffic: ${visitorTrafficResult.name}`)); }
  if (sizeResult) { console.log(chalk.white(`Size: ${sizeResult.name}`)); }
  if (chosenEnvironment) { console.log(chalk.white(`Environment: ${chosenEnvironment.name}`)); }

  const { breakChoice1 } = await inquirer.prompt([
    {
      type: 'list',
      name: 'breakChoice1',
      message: 'You have completed the first step of settlement creation. What next?',
      choices: ['Continue', 'Auto-Roll (Coming Soon)', 'Exit here'],
      loop: false,
    },
  ]);

  if (breakChoice1 === 'Auto-Roll (Coming Soon)') {
    console.log(chalk.yellow('\nThis feature will be implemented in the future!'));
    return;
  }

  if (breakChoice1 === 'Exit here') {
    console.log(chalk.bold.green('\n--- Final Detailed Summary ---'));
    console.log(chalk.yellow.bold(`\nType: ${settlementType}`));
    if (chosenOrigin) { console.log(chalk.bold.hex('#FFD700')(`\nOrigin: ${chosenOrigin.name}`)); console.log(chalk.gray(`  ${chosenOrigin.description}`)); }
    if (chosenSpecialty) { console.log(chalk.bold.hex('#FFD700')(`\nSpecialty: ${chosenSpecialty.name}`)); console.log(chalk.gray(`  ${chosenSpecialty.description}`)); }
    if (chosenSubSpecialty) { console.log(chalk.bold.hex('#FFD700')(`\nSub-Specialty: ${chosenSubSpecialty.name}`)); console.log(chalk.gray(`  ${chosenSubSpecialty.description}`)); }
    if (chosenAge) { console.log(chalk.bold.hex('#FFD700')(`\nAge: ${chosenAge.name}`)); console.log(chalk.gray(`  ${chosenAge.description}`)); }
    if (chosenCondition) { console.log(chalk.bold.hex('#FFD700')(`\nCondition: ${chosenCondition.name}`)); console.log(chalk.gray(`  ${chosenCondition.description}`)); }
    if (visitorTrafficResult) { console.log(chalk.bold.hex('#FFD700')(`\nVisitor Traffic: ${visitorTrafficResult.name}`)); console.log(chalk.gray(`  ${visitorTrafficResult.description}`)); }
    if (sizeResult) { console.log(chalk.bold.hex('#FFD700')(`\nSize: ${sizeResult.name}`)); console.log(chalk.gray(`  ${sizeResult.description}`)); }
    if (chosenEnvironment) { console.log(chalk.bold.hex('#FFD700')(`\nEnvironment: ${chosenEnvironment.name}`)); console.log(chalk.gray(`  ${chosenEnvironment.description}`)); }
    return;
  }

  console.log(chalk.bold.cyan(`\nWhat is the population density like?`));
  const populationResult = await inquirer.prompt([
    {
        type: 'list', name: 'population', message: 'Select the resident population level:',
        choices: residentPopulationTable.map(item => {
            const rollDisplay = item.min === item.max ? `[${item.min}]` : `[${item.min}-${item.max}]`;
            return {
                name: `${chalk.white(rollDisplay)} ${chalk.bold(item.name)}: ${item.description}`,
                value: item,
            };
        }),
        loop: false,
    },
  ]);
  chosenPopulation = populationResult.population;
  applyModifiersFromChoice(chosenPopulation);

  console.log(chalk.bold.cyan(`\nWhat is the general disposition of the locals?`));
  const dispositionResult = await inquirer.prompt([
    {
        type: 'list', name: 'disposition', message: 'Select the resident disposition:',
        choices: dispositionTable.map(item => {
            const rollDisplay = item.min === item.max ? `[${item.min}]` : `[${item.min}-${item.max}]`;
            return {
                name: `${chalk.white(rollDisplay)} ${chalk.bold(item.name)}: ${item.description}`,
                value: item,
            };
        }),
        loop: false,
    },
  ]);
  chosenDisposition = dispositionResult.disposition;
  applyModifiersFromChoice(chosenDisposition);

  console.log(chalk.bold.cyan(`\nWhat is the state of law enforcement?`));
  const lawEnforcementResult = await inquirer.prompt([
    {
        type: 'list', name: 'law', message: 'Select the law enforcement level:',
        choices: lawEnforcementTable.map(item => {
            const rollDisplay = item.min === item.max ? `[${item.min}]` : `[${item.min}-${item.max}]`;
            return {
                name: `${chalk.white(rollDisplay)} ${chalk.bold(item.name)}: ${item.description}`,
                value: item,
            };
        }),
        loop: false,
    },
  ]);
  chosenLawEnforcement = lawEnforcementResult.law;
  applyModifiersFromChoice(chosenLawEnforcement);

  console.log(chalk.bold.cyan(`\nWho is in charge here?`));
  const leadershipResult = await inquirer.prompt([
    {
        type: 'list', name: 'leadership', message: 'Select the leadership type:',
        choices: leadershipTable.map(item => {
            const rollDisplay = item.min === item.max ? `[${item.min}]` : `[${item.min}-${item.max}]`;
            return {
                name: `${chalk.white(rollDisplay)} ${chalk.bold(item.name)}: ${item.description}`,
                value: item,
            };
        }),
        loop: false,
    },
  ]);
  chosenLeadership = leadershipResult.leadership;
  applyModifiersFromChoice(chosenLeadership);

  if (chosenLeadership.name === 'Oligarchy') {
      console.log(chalk.bold.cyan(`\nWhat kind of oligarchy is it?`));
      const oligarchyResult = await inquirer.prompt([
        {
            type: 'list', name: 'oligarchy', message: 'Select the oligarchy type:',
            choices: oligarchyTypeTable.map(item => ({
                name: `${chalk.white(`[${item.dice}]`)} ${chalk.bold(item.name)}: ${item.description}`,
                value: item,
            })),
            loop: false,
        },
      ]);
      chosenOligarchyType = oligarchyResult.oligarchy;
      applyModifiersFromChoice(chosenOligarchyType);
  }

  const basePopulationWealthRoll = Math.floor(Math.random() * 20) + 1;
  const finalPopulationWealth = basePopulationWealthRoll + currentModifiers.populationWealth;
  populationWealthResult = populationWealthTable.find(item => finalPopulationWealth >= item.min && finalPopulationWealth <= item.max);
  if (populationWealthResult) {
    applyModifiersFromChoice(populationWealthResult);
  }

  const baseCrimeRoll = Math.floor(Math.random() * 20) + 1;
  const finalCrimeScore = baseCrimeRoll + currentModifiers.crime;
  crimeResult = crimeTable.find(item => finalCrimeScore >= item.min && finalCrimeScore <= item.max);
  if (crimeResult) {
      applyModifiersFromChoice(crimeResult);
  }

  console.log(chalk.bold.green('\n--- End of Step 2: Population & Authority ---'));
  console.log(chalk.yellow(`Type: ${settlementType}`));
  if (chosenPopulation) { console.log(chalk.white(`Population: ${chosenPopulation.name}`)); }
  if (chosenDisposition) { console.log(chalk.white(`Disposition: ${chosenDisposition.name}`)); }
  if (chosenLawEnforcement) { console.log(chalk.white(`Law Enforcement: ${chosenLawEnforcement.name}`)); }
  if (chosenLeadership) { console.log(chalk.white(`Leadership: ${chosenLeadership.name}`)); }
  if (chosenOligarchyType) { console.log(chalk.white(`Oligarchy Type: ${chosenOligarchyType.name}`)); }
  if (populationWealthResult) { console.log(chalk.white(`Population Wealth: ${populationWealthResult.name}`)); }
  if (crimeResult) { console.log(chalk.white(`Crime: ${crimeResult.name}`)); }

  const { breakChoice2 } = await inquirer.prompt([
    {
      type: 'list',
      name: 'breakChoice2',
      message: 'You have completed the second step of settlement creation. What next?',
      choices: ['Continue', 'Auto-Roll (Coming Soon)', 'Exit here'],
      loop: false,
    },
  ]);

  if (breakChoice2 === 'Auto-Roll (Coming Soon)') {
    console.log(chalk.yellow('\nThis feature will be implemented in the future!'));
    return;
  }

  if (breakChoice2 === 'Exit here') {
    // This summary needs to show ALL choices from the beginning.
    console.log(chalk.bold.green('\n--- Final Detailed Summary ---'));
    console.log(chalk.yellow.bold(`\nType: ${settlementType}`));
    if (chosenOrigin) { console.log(chalk.bold.hex('#FFD700')(`\nOrigin: ${chosenOrigin.name}`)); console.log(chalk.gray(`  ${chosenOrigin.description}`)); }
    if (chosenSpecialty) { console.log(chalk.bold.hex('#FFD700')(`\nSpecialty: ${chosenSpecialty.name}`)); console.log(chalk.gray(`  ${chosenSpecialty.description}`)); }
    if (chosenSubSpecialty) { console.log(chalk.bold.hex('#FFD700')(`\nSub-Specialty: ${chosenSubSpecialty.name}`)); console.log(chalk.gray(`  ${chosenSubSpecialty.description}`)); }
    if (chosenAge) { console.log(chalk.bold.hex('#FFD700')(`\nAge: ${chosenAge.name}`)); console.log(chalk.gray(`  ${chosenAge.description}`)); }
    if (chosenCondition) { console.log(chalk.bold.hex('#FFD700')(`\nCondition: ${chosenCondition.name}`)); console.log(chalk.gray(`  ${chosenCondition.description}`)); }
    if (visitorTrafficResult) { console.log(chalk.bold.hex('#FFD700')(`\nVisitor Traffic: ${visitorTrafficResult.name}`)); console.log(chalk.gray(`  ${visitorTrafficResult.description}`)); }
    if (sizeResult) { console.log(chalk.bold.hex('#FFD700')(`\nSize: ${sizeResult.name}`)); console.log(chalk.gray(`  ${sizeResult.description}`)); }
    if (chosenEnvironment) { console.log(chalk.bold.hex('#FFD700')(`\nEnvironment: ${chosenEnvironment.name}`)); console.log(chalk.gray(`  ${chosenEnvironment.description}`)); }
    if (chosenPopulation) { console.log(chalk.bold.hex('#FFD700')(`\nPopulation: ${chosenPopulation.name}`)); console.log(chalk.gray(`  ${chosenPopulation.description}`)); }
    if (chosenDisposition) { console.log(chalk.bold.hex('#FFD700')(`\nDisposition: ${chosenDisposition.name}`)); console.log(chalk.gray(`  ${chosenDisposition.description}`)); }
    if (chosenLawEnforcement) { console.log(chalk.bold.hex('#FFD700')(`\nLaw Enforcement: ${chosenLawEnforcement.name}`)); console.log(chalk.gray(`  ${chosenLawEnforcement.description}`)); }
    if (chosenLeadership) { console.log(chalk.bold.hex('#FFD700')(`\nLeadership: ${chosenLeadership.name}`)); console.log(chalk.gray(`  ${chosenLeadership.description}`)); }
    if (chosenOligarchyType) { console.log(chalk.bold.hex('#FFD700')(`\nOligarchy Type: ${chosenOligarchyType.name}`)); console.log(chalk.gray(`  ${chosenOligarchyType.description}`)); }
    if (populationWealthResult) { console.log(chalk.bold.hex('#FFD700')(`\nPopulation Wealth: ${populationWealthResult.name}`)); console.log(chalk.gray(`  ${populationWealthResult.description}`)); }
    if (crimeResult) { console.log(chalk.bold.hex('#FFD700')(`\nCrime: ${crimeResult.name}`)); console.log(chalk.gray(`  ${crimeResult.description}`)); }
    return;
  }
  
  if (breakChoice2 === 'Continue') {
    if (sizeResult && shopLocationsData[sizeResult.name]) {
        const calcData = shopLocationsData[sizeResult.name];
        const baseShopRoll = rollDice(calcData.dieCount, calcData.dieSize);
        numberOfShops = baseShopRoll + calcData.bonus;
        shopRollDetails = { base: baseShopRoll, bonus: calcData.bonus, formula: `${calcData.dieCount}d${calcData.dieSize}+${calcData.bonus}` };
    }

    console.log(chalk.bold.cyan(`\nBased on its size, this settlement has ${numberOfShops} shop locations.`));
    const { shopChoiceMethod } = await inquirer.prompt([
        {
            type: 'list',
            name: 'shopChoiceMethod',
            message: 'How would you like to determine the shops?',
            choices: ['Auto-Roll', 'Manual Selection'],
            loop: false,
        },
    ]);

    if (shopChoiceMethod === 'Auto-Roll') {
        let reroll = true;
        while (reroll) {
            let rolledShops = [];
            for (let i = 0; i < numberOfShops; i++) {
                const roll = rollDice(1, 100);
                const shop = shopsTable.find(s => roll >= s.min && roll <= s.max);
                if (shop) {
                    rolledShops.push(shop);
                }
            }
            
            console.clear();
            console.log(chalk.bold.yellow('\n--- Rolled Shops ---'));
            rolledShops.forEach(shop => console.log(chalk.white(`- ${shop.name}`)));

            const { rerollChoice } = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'rerollChoice',
                    message: 'Are you happy with this selection?',
                    choices: ['I\'m fine', 'Re-Roll!'],
                    loop: false,
                }
            ]);
            
            if (rerollChoice === 'I\'m fine') {
                chosenShops = rolledShops;
                reroll = false;
            }
        }
    } else { // Manual Selection
        while (chosenShops.length < numberOfShops) {
            console.clear();
            console.log(chalk.bold.yellow(`\n--- Manual Shop Selection (${chosenShops.length}/${numberOfShops}) ---`));
            if (chosenShops.length > 0) {
                console.log(chalk.white('Current Shops: ' + chosenShops.map(s => s.name).join(', ')));
            }

            const shopChoices = [
                { name: chalk.bold.red('--- I\'m done selecting ---'), value: 'done' },
                new inquirer.Separator(),
                ...shopsTable.map(shop => {
                    const rollDisplay = `[${String(shop.min).padStart(2, '0')}-${String(shop.max).padStart(2, '0')}]`;
                    return {
                        name: `${chalk.white(rollDisplay)} ${chalk.bold(shop.name)}`,
                        value: shop,
                    };
                }),
            ];

            const { manualShopChoice } = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'manualShopChoice',
                    message: 'Select a shop to add:',
                    choices: shopChoices,
                    loop: false,
                    pageSize: 15, // Makes long lists easier to navigate
                }
            ]);

            if (manualShopChoice === 'done') {
                break;
            }
            chosenShops.push(manualShopChoice);
        }
    }
  }


  console.log(chalk.bold.green('\n--- Final Settlement Summary ---'));
  console.log(chalk.yellow(`Type: ${settlementType}`));
  console.log(chalk.magenta(`Origin: ${chosenOrigin.name}`));
  if (chosenSpecialty) {
    console.log(chalk.cyan(`Specialty: ${chosenSpecialty.name}`));
    if (chosenSubSpecialty) {
      console.log(chalk.cyan(`  ↳ Sub-Specialty: ${chosenSubSpecialty.name}`));
    }
  }
  if (chosenAge) { console.log(chalk.green(`Age: ${chosenAge.name}`)); }
  if (chosenCondition) { console.log(chalk.red(`Condition: ${chosenCondition.name}`)); }
  if (visitorTrafficResult) { console.log(chalk.hex('#FF8800')(`Visitor Traffic: ${visitorTrafficResult.name}`)); }
  if (sizeResult) { console.log(chalk.rgb(150, 150, 150)(`Size: ${sizeResult.name} (${sizeResult.description})`)); }
  if (chosenEnvironment) { console.log(chalk.rgb(139, 69, 19)(`Environment: ${chosenEnvironment.name}`)); }
  if (chosenPopulation) { console.log(chalk.rgb(200, 200, 100)(`Population: ${chosenPopulation.name}`)); }
  if (chosenDisposition) { console.log(chalk.rgb(200, 100, 200)(`Disposition: ${chosenDisposition.name}`)); }
  if (chosenLawEnforcement) { console.log(chalk.rgb(100, 100, 200)(`Law Enforcement: ${chosenLawEnforcement.name}`)); }
  if (chosenLeadership) { 
      console.log(chalk.rgb(150, 50, 200)(`Leadership: ${chosenLeadership.name}`));
      if (chosenOligarchyType) {
          console.log(chalk.rgb(200, 100, 250)(`  ↳ Oligarchy Type: ${chosenOligarchyType.name}`));
      }
  }
  if (populationWealthResult) { console.log(chalk.rgb(218, 165, 32)(`Population Wealth: ${populationWealthResult.name}`)); }
  if (crimeResult) { console.log(chalk.rgb(255, 50, 50)(`Crime: ${crimeResult.name}`)); }
  if (chosenShops.length > 0) {
    console.log(chalk.rgb(100, 255, 100)(`Shop Locations (${numberOfShops}):`));
    chosenShops.forEach(shop => console.log(chalk.rgb(150, 255, 150)(`  - ${shop.name}`)));
  }


  console.log(chalk.bold.yellow('\n--- Background Modifier Tracking (For Future Use) ---'));
  if (shopRollDetails.formula) {
    console.log(chalk.white(`Shop Locations Roll (${shopRollDetails.formula}): ${shopRollDetails.base} | Bonus: +${shopRollDetails.bonus} | Total: ${numberOfShops}`));
  }
  console.log(chalk.white(`Final Visitor Traffic Modifier Collected: ${currentModifiers.visitorTraffic >= 0 ? '+' : ''}${currentModifiers.visitorTraffic}`));
  console.log(chalk.white(`Final Population Wealth Modifier Collected: ${currentModifiers.populationWealth >= 0 ? '+' : ''}${currentModifiers.populationWealth}`));
  console.log(chalk.white(`Final Size Modifier Collected: ${currentModifiers.size >= 0 ? '+' : ''}${currentModifiers.size}`));
  console.log(chalk.white(`Final Crime Modifier Collected: ${currentModifiers.crime >= 0 ? '+' : ''}${currentModifiers.crime}`));
  console.log(chalk.white(`Final Quality Modifier Collected: ${currentModifiers.quality >= 0 ? '+' : ''}${currentModifiers.quality}`));
  console.log(chalk.white(`Final Urban Encounter Modifier Collected: ${currentModifiers.urbanEncounter >= 0 ? '+' : ''}${currentModifiers.urbanEncounter}`));
  
  console.log(chalk.bold.yellow('\n--- Weighting System Automation Test ---'));
  const simulatedRoll = Math.floor(Math.random() * 20) + 1;
  const autoSelectedCondition = tradingPostConditions.find(item => simulatedRoll >= item.min && simulatedRoll <= item.max);
  console.log(chalk.white(`Simulated d20 Roll for Condition: ${simulatedRoll} -> ${autoSelectedCondition.name}`));

  console.log(chalk.bold.green('----------------------------------------------------'));
}

export { startAdventure };