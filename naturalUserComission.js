const { roundingNumber, startToEndDateMaker } = require('./util');

const naturalUser = [];
const naturalUserIdArr = [];

const naturalUserAmountCal = (forCalAmount) => {
  if (forCalAmount > 1000) {
    const comissionAmount = forCalAmount - 1000;
    const calComission = (comissionAmount / 100) * 0.3;
    return roundingNumber(calComission);
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
    let calComission = 0.00;
    if (userInfo.amount > 1000) {
      calComission = (elementAmount / 100) * 0.3;
    } else if ((userInfo.amount + elementAmount) > 1000) {
      const comissionAmount = (userInfo.amount + elementAmount) - 1000;
      calComission = (comissionAmount / 100) * 0.3;
    }

    userInfo.amount += elementAmount;
    return roundingNumber(calComission);
  }
  const { startDate, endDate } = startToEndDateMaker(element.date);

  userInfo.amount = elementAmount;
  userInfo.startDate = startDate;
  userInfo.endDate = endDate;

  const forCalAmount = elementAmount;
  const calComission = naturalUserAmountCal(forCalAmount);
  return calComission;
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
  const calComission = naturalUserAmountCal(forCalAmount);
  return calComission;
};

exports.naturalUserComissionCal = (element) => {
  if (naturalUserIdArr.includes(element.user_id)) {
    const calComission = naturalUserAlreadyCashOut(element);
    return calComission;
  }
  const calComission = naturalUserNewEntry(element);
  return calComission;
};
