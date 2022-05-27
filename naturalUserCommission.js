const configuration = require('./configuration');
const { roundingNumber, startToEndDateMaker } = require('./util');

const naturalUser = [];
const naturalUserIdArr = [];

// this amount of task common for some function thats why create this function
const naturalUserAmountCal = (forCalAmount) => {
  let calCommission = 0.00;
  if (forCalAmount > configuration.CASH_OUT_NATURAL_WEEK_LIMIT) {
    const commissionAmount = forCalAmount - configuration.CASH_OUT_NATURAL_WEEK_LIMIT;
    calCommission = (commissionAmount / 100) * configuration.CASH_OUT_NATURAL_COMMISSION_FEE;
  }
  return calCommission;
};

const naturalUserAlreadyCashOutInWeek = (element) => {
  const transactionDate = new Date(element.date);

  const userIdIndex = naturalUserIdArr.indexOf(element.user_id);
  const userInfo = naturalUser[userIdIndex];
  const elementAmount = element.operation.amount;

  const start = userInfo.startDate;
  const end = userInfo.endDate;

  // Checking if this user has a new cashout this week
  if (transactionDate >= start && transactionDate <= end) {
    let calCommission = 0.00;
    const totalAmount = userInfo.amount + elementAmount;

    // checking if this user already exist limit or not
    if (userInfo.amount > configuration.CASH_OUT_NATURAL_WEEK_LIMIT) {
      calCommission = (elementAmount / 100) * configuration.CASH_OUT_NATURAL_COMMISSION_FEE;
    } else if (totalAmount > configuration.CASH_OUT_NATURAL_WEEK_LIMIT) {
      const commissionAmount = totalAmount - configuration.CASH_OUT_NATURAL_WEEK_LIMIT;
      calCommission = (commissionAmount / 100) * configuration.CASH_OUT_NATURAL_COMMISSION_FEE;
    }

    userInfo.amount += elementAmount;
    return calCommission;
  }
  // if not generate new startdate end date or new week
  const { startDate, endDate } = startToEndDateMaker(element.date);

  userInfo.amount = elementAmount;
  userInfo.startDate = startDate;
  userInfo.endDate = endDate;

  const forCalAmount = elementAmount;
  const calCommission = naturalUserAmountCal(forCalAmount);
  return calCommission;
};

const naturalUserNewEntry = (element) => {
  naturalUserIdArr.push(element.user_id);
  const { startDate, endDate } = startToEndDateMaker(element.date);

  naturalUser.push({
    user_id: element.user_id,
    amount: element.operation.amount,
    startDate,
    endDate,
  });
  const forCalAmount = element.operation.amount;
  const calCommission = naturalUserAmountCal(forCalAmount);
  return calCommission;
};

exports.naturalUserCommissionCal = (element) => {
  if (naturalUserIdArr.includes(element.user_id)) {
    const calCommission = naturalUserAlreadyCashOutInWeek(element);
    return roundingNumber(calCommission);
  }
  const calCommission = naturalUserNewEntry(element);
  return roundingNumber(calCommission);
};
