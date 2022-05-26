const { roundingNumber, startToEndDateMaker } = require('./util');

const naturalUser = [];
const naturalUserIdArr = [];

const naturalUserAmountCal = (forCalAmount) => {
  if (forCalAmount > 1000) {
    const commissionAmount = forCalAmount - 1000;
    const calCommission = (commissionAmount / 100) * 0.3;
    return roundingNumber(calCommission);
  }
  return roundingNumber(0.00);
};

const naturalUserAlreadyCashOut = (element) => {
  const transactionDate = new Date(element.date);

  const userIdIndex = naturalUserIdArr.indexOf(element.user_id);
  const userInfo = naturalUser[userIdIndex];
  const elementAmount = element.operation.amount;

  const start = userInfo.startDate;
  const end = userInfo.endDate;

  if (transactionDate >= start && transactionDate <= end) {
    let calCommission = 0.00;
    if (userInfo.amount > 1000) {
      calCommission = (elementAmount / 100) * 0.3;
    } else if ((userInfo.amount + elementAmount) > 1000) {
      const commissionAmount = (userInfo.amount + elementAmount) - 1000;
      calCommission = (commissionAmount / 100) * 0.3;
    }

    userInfo.amount += elementAmount;
    return roundingNumber(calCommission);
  }
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
    const calCommission = naturalUserAlreadyCashOut(element);
    return calCommission;
  }
  const calCommission = naturalUserNewEntry(element);
  return calCommission;
};
