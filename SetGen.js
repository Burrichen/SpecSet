// SetGen.js

import inquirer from 'inquirer';
import chalk from 'chalk';
import { tradingPostOrigins, tradingPostSpecialties, foodAndDrink, tradingPostAges } from './tradingpost.js';
import { hiredHands } from './commonTables.js';

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

async function startAdventure() {
  let chosenSpecialty = null;
  let chosenSubSpecialty = null;
  let chosenAge = null;

  console.log(chalk.bold.cyan('\nStarting the Settlement Generator...'));

  // --- FULL PROMPT CODE RESTORED ---
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

  // --- FULL PROMPT CODE RESTORED ---
  const { chosenOrigin } = await inquirer.prompt([
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

  if (settlementType === 'Trading Post') {
    console.log(chalk.bold.cyan(`\nAs a Trading Post, it has a specialty. What is it?`));
    
    // --- FULL PROMPT CODE RESTORED ---
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
    }

    console.log(chalk.bold.cyan(`\nFinally, how old is the trading post?`));
    
    // --- FULL PROMPT CODE RESTORED ---
    const ageResult = await inquirer.prompt([
      {
        type: 'list', name: 'age', message: 'Select an age:',
        choices: tradingPostAges.map(age => ({ name: `[${age.dice}] ${age.name}: ${age.description}`, value: age })),
        loop: false,
      },
    ]);
    chosenAge = ageResult.age;
  }

  console.log(chalk.bold.green('\n--- Your Settlement Summary ---'));
  console.log(chalk.yellow(`Type: ${settlementType}`));
  console.log(chalk.magenta(`Origin: ${chosenOrigin.name}`));
  
  if (chosenSpecialty) {
    console.log(chalk.cyan(`Specialty: ${chosenSpecialty.name}`));
  }
  if (chosenSubSpecialty) {
    console.log(chalk.blue(`Sub-Specialty: ${chosenSubSpecialty.name}`));
  }
  if (chosenAge) {
    console.log(chalk.green(`Age: ${chosenAge.name}`));
  }

  console.log(chalk.bold.green('-----------------------------'));
}

export { startAdventure };