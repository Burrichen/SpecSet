import inquirer from 'inquirer';
import chalk from 'chalk';
import { startAdventure } from './SetGen.js';

// Global State
let autoRollEnabled = false;

// --- Helpers ---

function printHeader() {
    console.log(chalk.bold.yellow('======================================'));
    console.log(chalk.bold.yellow("  Burrichen's Spectacular Settlements "));
    console.log(chalk.bold.yellow('======================================\n'));
}

async function pressEnterToReturn() {
    console.log(chalk.gray('\nPress Enter to return to the main menu...'));
    await inquirer.prompt([
        { name: 'continue', type: 'input', message: '', transformer: () => '' }
    ]);
}

// --- Menus ---

async function settingsMenu() {
    let inSettings = true;
    while (inSettings) {
        console.clear();
        console.log(chalk.bold.cyan('--- Settings ---'));
        
        const statusColor = autoRollEnabled ? chalk.green('ON') : chalk.red('OFF');

        const { choice } = await inquirer.prompt([
            {
                type: 'list',
                name: 'choice',
                message: 'Configure your settings:',
                choices: [
                    { name: `Auto-Roll: ${statusColor}`, value: 'toggle' },
                    { name: 'Back to Main Menu', value: 'back' },
                ],
                loop: false,
            },
        ]);

        if (choice === 'toggle') {
            autoRollEnabled = !autoRollEnabled;
        } else {
            inSettings = false;
        }
    }
}

async function mainMenu() {
    while (true) {
        console.clear();
        printHeader();

        const { choice } = await inquirer.prompt([
            {
                type: 'list',
                name: 'choice',
                message: 'What would you like to do?',
                choices: ['Start Generator', 'Settings', 'Credits', 'Exit'],
                loop: false,
            },
        ]);

        switch (choice) {
            case 'Start Generator':
                console.clear();
                await startAdventure(autoRollEnabled);
                await pressEnterToReturn(); 
                break;

            case 'Settings':
                await settingsMenu();
                break;

            case 'Credits':
                console.clear();
                printHeader();
                console.log(chalk.bold.cyan('--- Credits ---'));
                console.log("Inspired by Nord Games' Spectacular Settlements");
                console.log('Developed by Burrichen');
                await pressEnterToReturn();
                break;

            case 'Exit':
                console.log(chalk.cyan('Safe travels!'));
                process.exit(0);
        }
    }
}

// Start the application
mainMenu();