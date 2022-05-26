const configuration = require('./configuration');
const { roundingNumber } = require('./util');

exports.juridicalUserCommissionCal = (amount) => {
  const cashOutCal = (amount / 100) * configuration.CASH_OUT_LEGEL_COMMISSION_FEE;
  const cashOutJuriCommission = cashOutCal < configuration.CASH_OUT_MIN_LEGEL_AMOUNT
    ? configuration.CASH_OUT_MIN_LEGEL_AMOUNT : cashOutCal;
  return roundingNumber(cashOutJuriCommission);
};

exports.cashInCommissionCal = (amount) => {
  const cashInCal = (amount / 100) * configuration.CASH_IN_COMMISSION_FEE;
  const cashInCommission = cashInCal > configuration.CASH_IN_MAX_AMOUNT
    ? configuration.CASH_IN_MAX_AMOUNT : cashInCal;
  return roundingNumber(cashInCommission);
};
