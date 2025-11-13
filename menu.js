// menu.js

import inquirer from 'inquirer';
import chalk from 'chalk';
import { startAdventure } from './SetGen.js';

// --- NEW ---
// This variable will hold our setting state. It starts as 'false' (off).
let autoRollEnabled = false;

async function pressEnterToContinue() {
  console.log(chalk.gray('\nPress Enter to return to the main menu...'));
  // This prompt is simplified as we only need to wait for an Enter press.
  await inquirer.prompt([
    {
      name: 'continue',
      type: 'input',
      message: '',
      transformer: () => '', // Hides any text the user types
    },
  ]);
}

// --- NEW: Settings Menu Function ---
// This function creates a new menu screen specifically for settings.
async function settingsMenu() {
  while (true) {
    console.clear();

    console.log(chalk.bold.cyan('--- Settings ---'));

    // The text of the first choice changes based on the `autoRollEnabled` variable.
    const autoRollText = `Auto-Roll: ${autoRollEnabled ? chalk.green('On') : chalk.red('Off')}`;

    const { choice } = await inquirer.prompt([
      {
        type: 'list',
        name: 'choice',
        message: 'Configure your settings:',
        choices: [
          { name: autoRollText, value: 'toggleAutoRoll' },
          'Back to Main Menu',
        ],
        loop: false,
      },
    ]);

    switch (choice) {
      // If the user chooses the toggle...
      case 'toggleAutoRoll':
        // ...we flip the boolean value. (true becomes false, false becomes true)
        autoRollEnabled = !autoRollEnabled;
        break;

      // If the user chooses to go back...
      case 'Back to Main Menu':
        // ...we simply exit this function, which returns to the mainMenu loop.
        return;
    }
  }
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
        // --- MODIFIED ---
        // Changed 'Options' to 'Settings' for clarity.
        choices: ['Start', 'Settings', 'Credits', 'Exit'],
        loop: false,
      },
    ]);

    switch (choice) {
      case 'Start':
        console.clear();
        // --- MODIFIED ---
        // We now pass the current state of our setting to the startAdventure function.
        await startAdventure(autoRollEnabled);
        await pressEnterToContinue();
        break;

      // --- MODIFIED ---
      // This case now calls our new settings menu function.
      case 'Settings':
        await settingsMenu();
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