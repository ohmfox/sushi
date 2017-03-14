import ascii from './util/ascii';
import chalk from 'chalk';
import clear from 'clear';
import inquirer from 'inquirer';
import Preferences from 'preferences';
import CLI from 'clui';

var prefs = new Preferences('sushi');

// Commands
const ADD_DEVICE = 'Add Device';

import addDevice from './devices/addDevice';

import { bluetoothState, devices } from './bluetooth';

function answerBase(answers) {
    switch(answers.command) {
      case ADD_DEVICE:
        var status = new CLI.Spinner('Getting nearby devices, please wait...');
        status.start();
				var devs = [];
        devices().subscribe({
          next(peri) {
						devs.push(peri);
          },
          complete() {
            status.stop();
						var choices = devs.map((device) => {
							return device.advertisement.localName;
						});
						console.log(choices);
						inquirer
							.prompt([{ 
								name: 'device', 
								type: 'list', 
								message: 'Which device would you like to add?', 
								choices
							}])
							.then((answers) => addDevices(answers[0], devs));
          }
        });
      default:
        return '';
    }
}

const promptBase = () => {
  const questions = [
    {
      name: 'command',
      type: 'list',
      message: 'What would you like to do?',
      choices: ['Add Device', 'List Devices', 'Manage Device', 'Control Devices']
    }
  ]
  inquirer.prompt(questions).then(answerBase);
}

const promptAddDevice = () => {
  // const 
  // return 
}

clear();
console.log(ascii);

bluetoothState().subscribe({
  next(state) { 
    if(state === 'poweredOn') {
      promptBase();
    } else if(state === 'poweredOff') {
      console.log(
        chalk.red('sushi uses bluetooth to connect to some devices. Please turn bluetooth on and try again')
      );
      process.exit(1);
    }
  }
});

