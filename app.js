const { ArgumentParser } = require('argparse');
const { readfile } = require('./util');
const { juridicalUserCommissionCal, cashInCommissionCal } = require('./commissionCalculation');
const { naturalUserCommissionCal } = require('./naturalUserCommission');

const parser = new ArgumentParser({});
parser.add_argument('-f', '--filename', { help: 'filename' });
const getFilename = parser.parse_args().filename;
const setFilename = getFilename === undefined ? 'input.json' : getFilename;

const calculationCommissionFees = (filename) => {
  const allJsonData = readfile(filename);

  allJsonData.forEach((element) => {
    if (element.type === 'cash_in') {
      const cashInCommission = cashInCommissionCal(element.operation.amount);
      process.stdout.write(`${cashInCommission}\n`);
    } else if (element.type === 'cash_out') {
      if (element.user_type === 'natural') {
        const calCommission = naturalUserCommissionCal(element);
        process.stdout.write(`${calCommission}\n`);
      } else if (element.user_type === 'juridical') {
        const calCommission = juridicalUserCommissionCal(element.operation.amount);
        process.stdout.write(`${calCommission}\n`);
      }
    }
  });
};

calculationCommissionFees(setFilename);
