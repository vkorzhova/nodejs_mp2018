const combinedStream = require('combined-stream');
const fs = require('fs');
const papaParse = require('papaparse');
const path = require('path');
const program = require('commander');
const through = require('through2');
const util = require('util');

const unlinkAsync = util.promisify(fs.unlink);
const existsAsync = util.promisify(fs.exists);

const arguments = process.argv;
const isHelpArgument = (arg) => arg === '--help' || arg === '-h';

if (!arguments.length || isHelpArgument(arguments[2])) {
  console.log('Please, provide at least one argument');
  program.outputHelp();
} else {
  arguments.filter(arg => !isHelpArgument(arg));
}

program
  .version('0.0.1')
  .option('-a, --action <actionType>', 'type of action to execute')
  .option('-f, --file <filePath>', 'path to file')
  .option('-p, --path <folderPath>', 'path to folder')
  .parse(arguments);

const { action, file, path: folderPath } = program;

try {
  switch (action) {
    case 'reverse': reverse(); break;
    case 'transform': transform(); break;
    case 'outputFile': outputFile(file); break;
    case 'convertFromFile': convertFromFile(file); break;
    case 'convertToFile': convertToFile(file); break;
    case 'cssBundler': cssBundler(folderPath); break;
    default: typeof action === 'string' ? console.error(`Bad action: ${action}`) : console.error(`Missing action`);
  }
} catch (error) {
  console.error(error);
}

function reverse() {
  process.stdin.once('data', (chunk) => {
    const result = chunk.toString().trim().split('').reverse().join('') + '\n';
    process.stdout.write(`Reversed text: ${result}`);
    process.exit();
  });
}

function transform() {
  const toUpperCase = through((data, enc, callback) => {
    callback(null, data.toString().toUpperCase());
  });

  process.stdin.pipe(toUpperCase).pipe(process.stdout);
}

async function outputFile(filePath) {
  if (!filePath) {
    console.error('Please, provide path to file.'); return;
  } else if (!await existsAsync(filePath)) {
    console.error('The file does not exist.'); return;
  }

  const readStream = fs.createReadStream(filePath);

  readStream.on('readable', () => {
    const data = readStream.read();

    if (data) {
      process.stdout.write(data.toString() + '\n');
    }
  });
}

async function convertFromFile(filePath) {
  if (!filePath) {
    console.error('Please, provide path to file for converting.'); return;
  } else if (!await existsAsync(filePath)) {
    console.error('The file does not exist.'); return;
  } else if (path.extname(filePath) !== '.csv') {
    console.error('Invalid file extension.'); return;
  }

  papaParse.parse(fs.createReadStream(filePath, 'utf-8'), {
    complete: (results) => {
      console.log(results.data);
    }
  });
}

async function convertToFile(filePath) {
  if (!filePath) {
    console.error('Please, provide path to file for converting.'); return;
  } else if (!await existsAsync(filePath)) {
    console.error('The file does not exist.'); return;
  } else if (path.extname(filePath) !== '.csv') {
    console.error('Invalid file extension.'); return;
  }

  const writeStream = fs.createWriteStream(filePath.replace('csv', 'json'));

  papaParse.parse(fs.createReadStream(filePath, 'utf-8'), {
    complete: (results) => {
      writeStream.write(JSON.stringify(results.data));
    }
  });
}

async function cssBundler(folderPath) {
  if (!folderPath) {
    console.error('Please, provide path to folder.'); return;
  } else if (!await existsAsync(folderPath)) {
    console.error('The folder does not exist.'); return;
  }

  if (path.extname(folderPath)) {
    console.error('Invalid folder path.'); return;
  }

  const additionalCssFileName = 'nodejs-homework3.css';
  const bundleFileName = 'bundle.css';
  const bundleFilePath = path.join(folderPath, bundleFileName);

  if (await existsAsync(bundleFilePath)) {
    await unlinkAsync(bundleFilePath);
  }

  const commonStream = combinedStream.create();

  fs.readdir(folderPath, async (err, files) => {
    if (err) { console.error(error); return; }

    const cssFiles = files.filter(file => path.extname(file) === '.css' && file !== additionalCssFileName);
    if (!cssFiles.length) {
      console.error(`No css files in "${folderPath}" directory.`); return;
    }

    cssFiles.forEach((file) => {
      const stream = fs.createReadStream(path.join(folderPath, file));
      commonStream.append(stream);
    });

    const stream = fs.createReadStream(path.join(folderPath, additionalCssFileName));
    commonStream.append(stream);

    commonStream.pipe(fs.createWriteStream(bundleFilePath));
  });
}
