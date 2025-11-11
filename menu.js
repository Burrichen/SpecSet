// menu.js

import inquirer from 'inquirer';
import chalk from 'chalk';
import { startAdventure } from './SetGen.js';

async function pressEnterToContinue() {
  console.log(chalk.gray('\nPress Enter to return to the main menu...'));
  await inquirer.prompt([
    {
      name: 'continue',
      type: 'input',
      message: '',
    },
  ]);
}

async function mainMenu() {
  while (true) {
    console.clear();

    console.log(chalk.bold.yellow('======================================'));
    console.log(chalk.bold.yellow("  Burrichen's Spectacular Settlements "));
    console.log(chalk.bold.yellow('======================================\n'));

    const { choice } = await inquirer.prompt([
      {
        type: 'list',
        name: 'choice',
        message: 'What would you like to do?',
        choices: ['Start', 'Options', 'Credits', 'Exit'],
        loop: false,
      },
    ]);

    switch (choice) {
      case 'Start':
        // --- BUG FIX IS HERE ---
        // Clear the console immediately for a clean start to the generator.
        console.clear();
        await startAdventure();
        await pressEnterToContinue();
        break;

      case 'Options':
        console.log(chalk.bold.cyan('\n--- Options ---'));
        console.log('This feature is coming soon!');
        await pressEnterToContinue();
        break;

      case 'Credits':
        console.log(chalk.bold.cyan('\n--- Credits ---'));
        console.log("Inspired by Nord Games' Spectacular Settlements");
        console.log('Developed by Burrichen');
        await pressEnterToContinue();
        break;

      case 'Exit':
        process.exit(0);
    }
  }
}

mainMenu();