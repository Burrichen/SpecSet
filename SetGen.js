// SetGen.js

import inquirer from 'inquirer';
import chalk from 'chalk';
import { tradingPostOrigins, tradingPostSpecialties, foodAndDrink, tradingPostAges, tradingPostConditions, visitorTrafficTable, tradingPostSizeTable, residentPopulationTable, lawEnforcementTable, leadershipTable, populationWealthTable, crimeTable, shopLocationsData, shopsTable, serviceLocationsData, placeOfWorshipDecisionTable, placeOfWorshipSizeTable } from './tradingpost.js';
import { hiredHands, environmentTable, dispositionTable, oligarchyTypeTable, servicesTable, hiredHelpSizeTable, fervencyTable } from './commonTables.js';

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
  let hiredHandsSpecialtySize = null;
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
  let numberOfServices = null;
  let serviceRollDetails = {};
  let chosenServices = [];
  let chosenPlaceOfWorshipDecision = null;
  let chosenWorshipSize = null;
  let chosenFervency = null;
  let chosenExtraIntrigue = null;

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
      hiredHandsSpecialtySize = await getHiredHelpSize();
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
  const finalPopulationWealth = applyModifierAndClamp(basePopulationWealthRoll, currentModifiers.populationWealth, 1, 20);
  populationWealthResult = populationWealthTable.find(item => finalPopulationWealth >= item.min && finalPopulationWealth <= item.max);
  if (populationWealthResult) {
    applyModifiersFromChoice(populationWealthResult);
  }

  const baseCrimeRoll = Math.floor(Math.random() * 20) + 1;
  const finalCrimeScore = applyModifierAndClamp(baseCrimeRoll, currentModifiers.crime, 1, 20);
  crimeResult = crimeTable.find(item => finalCrimeScore >= item.min && finalCrimeScore <= item.max);
  if (crimeResult) {
      applyModifiersFromChoice(crimeResult);
  }

  console.log(chalk.bold.green('\n--- End of Step 2: Population & Authority ---'));
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
    // ... Full detailed summary logic is unchanged
    return;
  }
  
  if (breakChoice2 === 'Continue') {
    if (sizeResult && shopLocationsData[sizeResult.name]) {
        const calcData = shopLocationsData[sizeResult.name];
        const baseShopRoll = rollDice(calcData.dieCount, calcData.dieSize);
        numberOfShops = baseShopRoll + calcData.bonus;
        shopRollDetails = { base: baseShopRoll, bonus: calcData.bonus, formula: `${calcData.dieCount}d${calcData.dieSize}+${calcData.bonus}` };
        
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
                    if (shop) rolledShops.push(shop);
                }
                
                console.clear();
                console.log(chalk.bold.yellow('\n--- Rolled Shops ---'));
                rolledShops.forEach(shop => console.log(chalk.white(`- ${shop.name}`)));

                const { rerollChoice } = await inquirer.prompt([
                    { type: 'list', name: 'rerollChoice', message: 'Are you happy with this selection?', choices: ['I\'m fine', 'Re-Roll!'], loop: false }
                ]);
                
                if (rerollChoice === 'I\'m fine') {
                    chosenShops = rolledShops;
                    reroll = false;
                }
            }
        } else { // Manual Selection
            while (chosenShops.length < numberOfShops) {
                console.clear();
                console.log(chalk.bold.yellow(`\n--- Manual Shop Selection ---`));
                console.log(chalk.white(`You can select up to ${numberOfShops} shops. (${chosenShops.length} selected so far)`));
                if (chosenShops.length > 0) {
                    console.log(chalk.gray('Current Shops: ' + chosenShops.map(s => s.name).join(', ')));
                }

                const shopChoices = [
                    { name: chalk.bold.red('--- I\'m done selecting ---'), value: 'done' },
                    new inquirer.Separator(),
                    ...shopsTable.map(shop => {
                        const rollDisplay = `[${String(shop.min).padStart(2, '0')}-${String(shop.max).padStart(2, '0')}]`;
                        return { name: `${chalk.white(rollDisplay)} ${chalk.bold(shop.name)}`, value: shop };
                    }),
                ];

                const { manualShopChoice } = await inquirer.prompt([
                    { type: 'list', name: 'manualShopChoice', message: 'Select a shop to add:', choices: shopChoices, loop: false, pageSize: 15 }
                ]);

                if (manualShopChoice === 'done') break;
                chosenShops.push(manualShopChoice);
            }
        }
    }

    if (sizeResult && serviceLocationsData[sizeResult.name]) {
        const calcData = serviceLocationsData[sizeResult.name];
        const baseServiceRoll = rollDice(calcData.dieCount, calcData.dieSize);
        numberOfServices = baseServiceRoll + calcData.bonus;
        serviceRollDetails = { base: baseServiceRoll, bonus: calcData.bonus, formula: `${calcData.dieCount}d${calcData.dieSize}+${calcData.bonus}` };
        
        console.log(chalk.bold.cyan(`\nThis settlement also has ${numberOfServices} service locations.`));
        const { serviceChoiceMethod } = await inquirer.prompt([
            { type: 'list', name: 'serviceChoiceMethod', message: 'How would you like to determine the services?', choices: ['Auto-Roll', 'Manual Selection'], loop: false },
        ]);

        if (serviceChoiceMethod === 'Auto-Roll') {
            let reroll = true;
            while (reroll) {
                let rolledServices = [];
                for (let i = 0; i < numberOfServices; i++) {
                    const roll = rollDice(1, 100);
                    const service = servicesTable.find(s => roll >= s.min && roll <= s.max);
                    if (service) {
                        let size = null;
                        if (service.name.includes('Hired Help')) {
                            size = rollHiredHelpSize();
                        }
                        rolledServices.push({ service, size });
                    }
                }
                
                console.clear();
                console.log(chalk.bold.yellow('\n--- Rolled Services ---'));
                rolledServices.forEach(item => {
                    console.log(chalk.white(`- ${item.service.name}`));
                    if (item.size) {
                        console.log(chalk.gray(`  ↳ Size: ${item.size.name}`));
                    }
                });

                const { rerollChoice } = await inquirer.prompt([
                    { type: 'list', name: 'rerollChoice', message: 'Are you happy with this selection?', choices: ['I\'m fine', 'Re-Roll!'], loop: false }
                ]);
                
                if (rerollChoice === 'I\'m fine') {
                    chosenServices = rolledServices;
                    reroll = false;
                }
            }
        } else { // Manual Selection
            while (chosenServices.length < numberOfServices) {
                console.clear();
                console.log(chalk.bold.yellow(`\n--- Manual Service Selection ---`));
                console.log(chalk.white(`You can select up to ${numberOfServices} services. (${chosenServices.length} selected so far)`));
                if (chosenServices.length > 0) {
                    const currentSelection = chosenServices.map(item => item.service.name + (item.size ? ` (${item.size.name})` : '')).join(', ');
                    console.log(chalk.gray('Current Services: ' + currentSelection));
                }

                const serviceChoices = [
                    { name: chalk.bold.red('--- I\'m done selecting ---'), value: 'done' },
                    new inquirer.Separator(),
                    ...servicesTable.map(service => {
                        const rollDisplay = `[${String(service.min).padStart(2, '0')}-${String(service.max).padStart(2, '0')}]`;
                        return { name: `${chalk.white(rollDisplay)} ${chalk.bold(service.name)}`, value: service };
                    }),
                ];

                const { manualServiceChoice } = await inquirer.prompt([
                    { type: 'list', name: 'manualServiceChoice', message: 'Select a service to add:', choices: serviceChoices, loop: false, pageSize: 15 }
                ]);

                if (manualServiceChoice === 'done') break;

                let size = null;
                if (manualServiceChoice.name.includes('Hired Help')) {
                    size = await getHiredHelpSize();
                }
                chosenServices.push({ service: manualServiceChoice, size: size });
            }
        }
    }

    console.log(chalk.bold.cyan(`\nIs there a place of worship in the settlement?`));
    const worshipDecisionResult = await inquirer.prompt([
        {
            type: 'list',
            name: 'decision',
            message: 'Select an option:',
            choices: placeOfWorshipDecisionTable.map(item => {
                const rollDisplay = `[${item.min}-${item.max}]`;
                return { name: `${chalk.white(rollDisplay)} ${chalk.bold(item.name)}`, value: item };
            }),
            loop: false,
        }
    ]);
    chosenPlaceOfWorshipDecision = worshipDecisionResult.decision;
    applyModifiersFromChoice(chosenPlaceOfWorshipDecision);

    if (chosenPlaceOfWorshipDecision.name === 'Yes') {
        console.log(chalk.bold.cyan(`\nHow large is the place of worship?`));
        const worshipSizeResult = await inquirer.prompt([
            {
                type: 'list',
                name: 'size',
                message: 'Select the size of the place of worship:',
                choices: placeOfWorshipSizeTable.map(item => {
                    const rollDisplay = `[${item.min}-${item.max}]`;
                    return { name: `${chalk.white(rollDisplay)} ${chalk.bold(item.name)}: ${item.description}`, value: item };
                }),
                loop: false,
            }
        ]);
        chosenWorshipSize = worshipSizeResult.size;
        applyModifiersFromChoice(chosenWorshipSize);

        console.log(chalk.bold.cyan(`\nWhat is the fervency of the local following?`));
        const fervencyResult = await inquirer.prompt([
            {
                type: 'list',
                name: 'fervency',
                message: 'Select the local fervency:',
                choices: fervencyTable.map(item => {
                    const rollDisplay = `[${item.min}-${item.max}]`;
                    return { name: `${chalk.white(rollDisplay)} ${chalk.bold(item.name)}: ${item.description}`, value: item };
                }),
                loop: false,
            }
        ]);
        chosenFervency = fervencyResult.fervency;
        applyModifiersFromChoice(chosenFervency);
    } else {
        console.log(chalk.yellow('\nNo place of worship. Proceeding to Extra Intrigue (Coming Soon)...'));
    }
  }

  console.log(chalk.bold.green('\n--- Final Settlement Summary ---'));
  console.log(chalk.yellow(`Type: ${settlementType}`));
  console.log(chalk.magenta(`Origin: ${chosenOrigin.name}`));
  if (chosenSpecialty) {
    console.log(chalk.cyan(`Specialty: ${chosenSpecialty.name}`));
    if (chosenSubSpecialty) {
      console.log(chalk.cyan(`  ↳ Sub-Specialty: ${chosenSubSpecialty.name}`));
      if (hiredHandsSpecialtySize) {
        console.log(chalk.cyan(`    ↳ Size: ${hiredHandsSpecialtySize.name}`));
      }
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
  if (chosenServices.length > 0) {
    console.log(chalk.rgb(100, 200, 255)(`Service Locations (${numberOfServices}):`));
    chosenServices.forEach(item => {
        console.log(chalk.rgb(150, 220, 255)(`  - ${item.service.name}`));
        if (item.size) {
            console.log(chalk.rgb(180, 230, 255)(`    ↳ Size: ${item.size.name}`));
        }
    });
  }
  if (chosenPlaceOfWorshipDecision) {
    console.log(chalk.rgb(220, 220, 180)(`Place of Worship: ${chosenPlaceOfWorshipDecision.name}`));
    if (chosenWorshipSize) {
        console.log(chalk.rgb(220, 220, 180)(`  ↳ Worship Size: ${chosenWorshipSize.name}`));
    }
    if (chosenFervency) {
        console.log(chalk.rgb(220, 220, 180)(`  ↳ Fervency: ${chosenFervency.name}`));
    }
  }
  if (chosenExtraIntrigue) {
      console.log(chalk.rgb(186, 85, 211)(`Extra Intrigue: ${chosenExtraIntrigue.name}`));
  }

  console.log(chalk.bold.yellow('\n--- Background Modifier Tracking (For Future Use) ---'));
  if (shopRollDetails.formula) {
    console.log(chalk.white(`Shop Locations Roll (${shopRollDetails.formula}): ${shopRollDetails.base} | Bonus: +${shopRollDetails.bonus} | Total: ${numberOfShops}`));
  }
  if (serviceRollDetails.formula) {
    console.log(chalk.white(`Service Locations Roll (${serviceRollDetails.formula}): ${serviceRollDetails.base} | Bonus: +${serviceRollDetails.bonus} | Total: ${numberOfServices}`));
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