# Timer CLI Application

This is a simple CLI timer application written in TypeScript. The application supports multiple languages (English, Portuguese, and Spanish) and allows users to record laps and stop the timer. The results are saved to a history file and can be displayed at the end.

## Features

- Start, lap, and stop the timer.
- Record and display laps.
- Multi-language support (English, Portuguese, Spanish).
- Save timer results to a history file.
- Display the last 5 results with an option to show all history.
- Clean history file with confirmation.

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/timer-cli-app.git
cd timer-cli-app
```

2. Install dependencies using pnpm:

```bash
pnpm install
```

3. Compile the TypeScript code:

```bash
pnpm tsc
```

## Usage

### Start the Timer

Start the timer with a task label (default language is English):

```bash
node dist/timer.js "My Task Label"
```

Start the timer with a task label and specify language (Portuguese or Spanish):

```bash
node dist/timer.js "My Task Label" --lang=pt
node dist/timer.js "My Task Label" --lang=es
```

### Clean History

Clean the history file:

```bash
node dist/timer.js --clean
node dist/timer.js --clean --lang=pt
node dist/timer.js --clean --lang=es
```

## Commands

- lap or l: Record a lap.
- stop or s: Stop the timer.
- Ctrl+C: Stop the timer.

## Output Samples

### Start Timer

```bash
===== Timer Started =====
Tracking task: My Task Label
Available commands:
  Type "lap" or press "l" to record a lap.
  Type "stop" or press "s" to stop the timer.
  Press "Ctrl+C" to stop the timer.
=========================
Elapsed time: 10s
```

### Stop Timer

```bash
Task: My Task Label, Total time: 10s, Laps: Lap 1: 5s, Lap 2: 8s
```

### History

```bash
===== History =====
Task: My Task Label, Total time: 10s, Laps: Lap 1: 5s, Lap 2: 8s
Task: Another Task, Total time: 15s, Laps: Lap 1: 7s
===================
Show all history? (yes/no):
```

## Contributing

Feel free to contribute to this project by opening issues or submitting pull requests. Here are some areas that need improvement:

- Add more languages.
- Improve error handling.
- Enhance the user interface.
- Add more features.

## License

This project is licensed under the MIT License.

This README provides clear instructions on installation, usage, commands, output samples, and how to contribute to the project. Adjust the repository URL in the installation section to match your GitHub repository.
