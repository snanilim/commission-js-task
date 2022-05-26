const fs = require('fs');

exports.readfile = (filename) => {
  const rawdata = fs.readFileSync(filename);
  const allJsonData = JSON.parse(rawdata);

  return allJsonData;
};

exports.roundingNumber = (number) => {
  const numberTemp = parseFloat(number).toFixed(2);
  const diff = number - parseFloat(numberTemp);
  if (diff > 0) {
    const newNumber = parseFloat(numberTemp);
    return (newNumber + 0.01).toFixed(2);
  }
  return numberTemp;
};

exports.startToEndDateMaker = (elementDate) => {
  const transactionDate = new Date(elementDate);
  const dateForTemp = new Date(elementDate);

  const day = transactionDate.getDay();
  let newDay = day - 1;
  if (newDay < 0) { newDay = 6; }

  const endDateNumber = 6 - newDay;

  const startDate = new Date(dateForTemp.setDate(transactionDate.getDate() - newDay));
  const endDate = new Date(dateForTemp.setDate(transactionDate.getDate() + endDateNumber));

  return ({ startDate, endDate });
};
