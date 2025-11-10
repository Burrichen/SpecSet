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

// This is our main application loop
async function mainMenu() {
  while (true) {
    // Clear the console for a clean look each time the menu is shown
    console.clear();

    // Display the main title
    console.log(chalk.bold.yellow('======================================'));
    console.log(chalk.bold.yellow("  Burrichen's Spectacular Settlements "));
    console.log(chalk.bold.yellow('======================================\n'));

    // Ask the user for their choice
    const { choice } = await inquirer.prompt([
      {
        type: 'list',
        name: 'choice',
        message: 'What would you like to do?',
        choices: ['Start', 'Options', 'Credits', 'Exit'],
        loop: false,
      },
    ]);

    // Handle the user's choice
    switch (choice) {
      case 'Start':
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
        process.exit(0); // This exits the application
    }
  }
}

mainMenu();
