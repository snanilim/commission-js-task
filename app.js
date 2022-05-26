const { ArgumentParser } = require('argparse');
const { readfile } = require('./util');
const { juridicalUserComissionCal, cashInComissionCal } = require('./comissionCalculation');
const { naturalUserComissionCal } = require('./naturalUserComission');

const parser = new ArgumentParser({});
parser.add_argument('-f', '--filename', { help: 'filename' });
const getFilename = parser.parse_args().filename;
const setFilename = getFilename === undefined ? 'input.json' : getFilename;

const calculationCommissionFees = (filename) => {
  const allJsonData = readfile(filename);

  allJsonData.forEach((element) => {
    if (element.type === 'cash_in') {
      const cashInCommission = cashInComissionCal(element.operation.amount);
      process.stdout.write(`${cashInCommission}\n`);
    } else if (element.type === 'cash_out') {
      if (element.user_type === 'natural') {
        const calComission = naturalUserComissionCal(element);
        process.stdout.write(`${calComission}\n`);
      } else if (element.user_type === 'juridical') {
        const calComission = juridicalUserComissionCal(element.operation.amount);
        process.stdout.write(`${calComission}\n`);
      }
    }
  });
};

calculationCommissionFees(setFilename);
