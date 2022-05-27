const { roundingNumber, startToEndDateMaker } = require('./util');
const { naturalUserCommissionCal } = require('./naturalUserCommission');
const { juridicalUserCommissionCal, cashInCommissionCal } = require('./commissionCalculation');

test('rounding number', () => {
  expect(roundingNumber(0.023)).toBe('0.03');
});

test('generate new week startdate enddate', () => {
  expect(startToEndDateMaker('2016-01-06')).toStrictEqual({ startDate: new Date('2016-01-04T00:00:00.000Z'), endDate: new Date('2016-01-10T00:00:00.000Z') });
});

test('juridical User Commission Calculation', () => {
  expect(juridicalUserCommissionCal(30.00)).toBe('0.50');
});

test('cashIn Commission Calculation', () => {
  expect(cashInCommissionCal(5000000.00)).toBe('5.00');
});

test('natural User Commission Calculation', () => {
  expect(naturalUserCommissionCal({ date: '2016-01-06', user_id: 1, operation: { amount: 50000 } })).toBe('147.00');
});
