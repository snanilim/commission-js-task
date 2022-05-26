const configuration = require('./configuration');
const { roundingNumber } = require('./util');

exports.juridicalUserComissionCal = (amount) => {
  const cashOutCal = (amount / 100) * configuration.CASH_OUT_LEGEL_COMISSION_FEE;
  const cashOutJuriCommission = cashOutCal < configuration.CASH_OUT_MIN_LEGEL_AMOUNT
    ? configuration.CASH_OUT_MIN_LEGEL_AMOUNT : cashOutCal;
  return roundingNumber(cashOutJuriCommission);
};

exports.cashInComissionCal = (amount) => {
  const cashInCal = (amount / 100) * configuration.CASH_IN_COMISSION_FEE;
  const cashInCommission = cashInCal > configuration.CASH_IN_MAX_AMOUNT
    ? configuration.CASH_IN_MAX_AMOUNT : cashInCal;
  return roundingNumber(cashInCommission);
};
