import readline from 'readline';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const loadTranslations = (lang: string) => {
  try {
    const translations = JSON.parse(fs.readFileSync(path.join(__dirname, `../locales/${lang}.json`), 'utf8'));
    return translations;
  } catch (error) {
    console.error(`Error loading language file for ${lang}:`, error);
    return null;
  }
};

const args = process.argv.slice(2);
const langArg = args.find(arg => arg.startsWith('--lang=')) || '--lang=en';
const lang = langArg.split('=')[1];
const translations = loadTranslations(lang);

if (!translations) {
  console.error(`Unsupported language: ${lang}`);
  process.exit(1);
}

const taskLabel = args.find(arg => !arg.startsWith('--')) || translations['unnamedTask'];
const cleanFlag = args.includes('--clean');
const historyFilePath = path.join(__dirname, 'history.txt');

let startTime: number;
let intervalId: NodeJS.Timeout;
let laps: number[] = [];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'timer> '
});

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / (24 * 3600));
  const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${days > 0 ? `${days}d ` : ''}${hours > 0 ? `${hours}h ` : ''}${minutes > 0 ? `${minutes}m ` : ''}${seconds}s`;
}

function startTimer() {
  startTime = Date.now();
  intervalId = setInterval(() => {
    const elapsedTime = Date.now() - startTime;
    process.stdout.write(`\r${chalk.blue(translations['elapsedTime'])} ${formatTime(elapsedTime)}`);
  }, 100);
}

function lapTimer() {
  const lapTime = Date.now() - startTime;
  laps.push(lapTime);
  console.log(`\n  ${chalk.green(`${translations['laps']} ${laps.length}: ${formatTime(lapTime)}`)}`);
}

function stopTimer() {
  clearInterval(intervalId);
  const totalTime = Date.now() - startTime;
  const lapInfo = laps.length > 0 ? `, ${translations['laps']}: ${laps.map((lap, index) => `${translations['laps']} ${index + 1}: ${formatTime(lap)}`).join(', ')}` : '';
  const result = `${chalk.yellow(translations['task'])} ${chalk.bold(taskLabel)}, ${translations['totalTime']}: ${formatTime(totalTime)}${lapInfo}`;
  console.log(`\n${chalk.bold(result)}`);

  fs.readFile(historyFilePath, 'utf8', (err, data) => {
    let newData = `${result}\n`;
    if (!err) {
      newData += data;
    }
    fs.writeFile(historyFilePath, newData, (err) => {
      if (err) {
        console.error(chalk.red(translations['errorWritingHistory']), err);
      } else {
        displayHistory();
      }
    });
  });
}

function displayHistory() {
  fs.readFile(historyFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error(chalk.red(translations['errorReadingHistory']), err);
    } else {
      const lines = data.trim().split('\n');
      console.log(chalk.magenta(`\n${translations['history']}`));
      if (lines.length > 5) {
        lines.slice(0, 5).forEach(line => console.log(line));
        console.log(chalk.magenta('==================='));
        rl.question(chalk.yellow(`${translations['showAllHistory']}`), (answer) => {
          if (answer.toLowerCase() === translations['yes']) {
            console.log(chalk.magenta(`\n${translations['history']}`));
            lines.forEach(line => console.log(line));
            console.log(chalk.magenta('==================='));
          }
          process.exit(0);
        });
      } else {
        lines.forEach(line => console.log(line));
        console.log(chalk.magenta('==================='));
        process.exit(0);
      }
    }
  });
}

function cleanHistory() {
  rl.question(translations['deleteHistory'], (answer) => {
    if (answer.toLowerCase() === translations['yes']) {
      fs.unlink(historyFilePath, (err) => {
        if (err) {
          console.error(chalk.red(translations['errorDeletingHistory']), err);
        } else {
          console.log(chalk.green(translations['historyDeleted']));
        }
        rl.close();
      });
    } else {
      console.log(translations['operationCancelled']);
      rl.close();
    }
  });
}

function displayInstructions() {
  console.log(chalk.yellow(translations['timerStarted']));
  console.log(`${chalk.bold(translations['trackingTask'])} ${chalk.yellow(taskLabel)}`);
  console.log(chalk.cyan(translations['availableCommands']));
  console.log(chalk.cyan(`  ${translations['typeLap']}`));
  console.log(chalk.cyan(`  ${translations['typeStop']}`));
  console.log(chalk.cyan(`  ${translations['pressCtrlC']}`));
  console.log(chalk.yellow(translations['historyEnd']));
}

if (cleanFlag) {
  cleanHistory();
} else {
  startTimer();
  displayInstructions();

  rl.prompt();
  rl.on('line', (line) => {
    switch (line.trim()) {
      case 'lap':
        lapTimer();
        break;
      case 'stop':
        console.log();
        stopTimer();
        break;
      default:
        console.log(`  ${chalk.red(`${translations['unknownCommand']} ${line.trim()}`)}`);
        break;
    }
    rl.prompt();
  }).on('close', () => {
    console.log();
    stopTimer();
    process.exit(0);
  });

  readline.emitKeypressEvents(process.stdin);
  if (process.stdin.isTTY) {
    process.stdin.setRawMode(true);
  }

  process.stdin.on('keypress', (str, key) => {
    if (key.ctrl && key.name === 'c') {
      console.log();
      stopTimer();
    } else if (key.name === 'l') {
      lapTimer();
    } else if (key.name === 's') {
      console.log();
      stopTimer();
    }
  });
}
