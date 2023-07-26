const { autoAdd } = require('./src/addRecruiters.js');
const { promptNameRemove, promptRemove, filterRemove } = require('./src/removeConnections.js');

// Automatically adds 30 recruiters by keyword `Acquisition`.
// node index.js {page}

const [_, __, pageFromArgs] = process.argv;
const page = Number(pageFromArgs);

const COUNT = 30;
const KEYWORDS = 'talent acquisition';
const blankMessage = `Hi {firstName}!`;

autoAdd({
  count: COUNT,
  keywords: KEYWORDS,
  blankMessage,
  page,
});

// Fetches your connections, then groups them by name and asks whether you want to remove
// all group (helpful to keep friends in network)

// promptNameRemove();

// Goes through every connection and asks you if you want to remove it

// promptRemove();

// Removes all connections by certain filter

// const keywords = ['epam', 'itransition', 'issoft', 'innowise', 'hr', 'junior', 'looking', 'rekruter'];
// filterRemove(keywords);
