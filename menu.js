import inquirer from 'inquirer';
import chalk from 'chalk';
import { startAdventure } from './SetGen.js';

// Global State
let autoRollEnabled = false;
let generationMode = 'Vanilla'; // Default mode

// Mode Options
const MODES = ['Vanilla', 'Vanilla +', 'Kurovia'];

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
        
        const autoRollStatus = autoRollEnabled ? chalk.green('ON') : chalk.red('OFF');
        
        // Color code the modes for better visibility
        let modeDisplay;
        if (generationMode === 'Vanilla') modeDisplay = chalk.white(generationMode);
        else if (generationMode === 'Vanilla +') modeDisplay = chalk.yellow(generationMode);
        else if (generationMode === 'Kurovia') modeDisplay = chalk.magenta(generationMode);

        const { choice } = await inquirer.prompt([
            {
                type: 'list',
                name: 'choice',
                message: 'Configure your settings:',
                choices: [
                    { name: `Mode: ${modeDisplay}`, value: 'toggleMode' },
                    { name: `Auto-Roll: ${autoRollStatus}`, value: 'toggleAuto' },
                    new inquirer.Separator(),
                    { name: 'Back to Main Menu', value: 'back' },
                ],
                loop: false,
            },
        ]);

        if (choice === 'toggleAuto') {
            autoRollEnabled = !autoRollEnabled;
        } else if (choice === 'toggleMode') {
            // Cycle through modes
            const currentIndex = MODES.indexOf(generationMode);
            const nextIndex = (currentIndex + 1) % MODES.length;
            generationMode = MODES[nextIndex];
        } else {
            inSettings = false;
        }
    }
}

async function mainMenu() {
    while (true) {
        console.clear();
        printHeader();
        
        // Display current settings on main screen
        let modeColor = chalk.white;
        if (generationMode === 'Vanilla +') modeColor = chalk.yellow;
        if (generationMode === 'Kurovia') modeColor = chalk.magenta;
        
        console.log(`${chalk.gray('Current Mode:')} ${modeColor(generationMode)}`); 
        console.log(`${chalk.gray('Auto-Roll:')} ${autoRollEnabled ? chalk.green('ON') : chalk.red('OFF')}\n`);

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
                // Pass the generationMode to the start function
                await startAdventure(autoRollEnabled, generationMode);
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