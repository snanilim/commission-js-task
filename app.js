const fs = require('fs');
const { ArgumentParser } = require('argparse');
const configuration = require('./configuration');



const parser = new ArgumentParser({});

parser.add_argument('-f', '--filename', { help: 'filename' });

const getFilename = parser.parse_args().filename;
const setFilename = getFilename == undefined ? "input.json" : getFilename




let natural_user = []
let natural_user_id_arr = []



const calculation_commission_fees = (setFilename) => {
    const all_json_data = readfile(setFilename);

    all_json_data.forEach(element => {
        if(element.type === 'cash_in'){
            const cash_in_commission = cash_in_comission_cal(element.operation.amount)
            console.log(cash_in_commission)

        }else if(element.type === 'cash_out'){
            if(element.user_type === 'natural'){
                const cal_comission = natural_user_comission_cal(element)
                console.log(cal_comission)

            }else if (element.user_type === 'juridical') {
                const cal_comission = juridical_user_comission_cal(element.operation.amount)
                console.log(cal_comission)
            }
        }
    });
}


const readfile = (setFilename) => {
    const rawdata = fs.readFileSync(setFilename);
    const all_json_data = JSON.parse(rawdata);

    return all_json_data
}

const natural_user_comission_cal = (element) => {
    if(natural_user_id_arr.includes(element.user_id)){
        const cal_comission = natural_user_between_week(element)
        return cal_comission
    }else{
        const cal_comission = natural_user_new_week(element)
        return cal_comission
    }
}





const natural_user_between_week = (element) => {
    const transaction_date = new Date(element.date);

    const user_id_index = natural_user_id_arr.indexOf(element.user_id)
    const user_info = natural_user[user_id_index]
    const element_amount = element.operation.amount

    const start = user_info.start_date;
    const end = user_info.end_date;

    if (transaction_date >= start && transaction_date <= end) {
        if(user_info.amount > 1000){
            const cal_comission =  (element_amount / 100) * 0.3
            return rounding_number(cal_comission)
        }else if((user_info.amount + element_amount) > 1000){
            const comission_amount = (user_info.amount + element_amount) - 1000
            const cal_comission =  (comission_amount / 100) * 0.3
            return rounding_number(cal_comission)
        }
    } else {
        const {start_date, end_date} = start_to_end_date_maker(element.date)

        user_info.amount = element_amount
        user_info.start_date = start_date
        user_info.end_date = end_date

        const for_cal_amount = element_amount
        const cal_comission =  amount_cal(for_cal_amount)
        return cal_comission
    }
}




const natural_user_new_week = (element) => {

    natural_user_id_arr.push(element.user_id)
    const {start_date, end_date} = start_to_end_date_maker(element.date)

    natural_user.push({user_id: element.user_id, amount: element.operation.amount, start_date: start_date, end_date: end_date})
    const for_cal_amount = element.operation.amount
    const cal_comission =  amount_cal(for_cal_amount)
    return cal_comission
}


const amount_cal = (for_cal_amount) => {
    if(for_cal_amount > 1000){
        const comission_amount = for_cal_amount - 1000
        const cal_comission = (comission_amount / 100) * 0.3
        return rounding_number(cal_comission)
    }else{
        return rounding_number(0.00)
    }
}



const start_to_end_date_maker = (element_date) => {
    const transaction_date = new Date(element_date);
    const tomorrow = new Date(element_date);

    let day = transaction_date.getDay();
    let new_day = day - 1;
    if (new_day < 0){new_day = 6}

    const end_date_number = 6 - new_day

    const start_date = new Date(tomorrow.setDate(transaction_date.getDate() - new_day) )
    const end_date = new Date(tomorrow.setDate(transaction_date.getDate() + end_date_number))

    return ({start_date, end_date})
}








const rounding_number = (number) => {
    const number_temp = parseFloat(number).toFixed(2);
    const diff = number - parseFloat(number_temp)
    if(diff>0){
        const new_number = parseFloat(number_temp)
        return (new_number + 0.01).toFixed(2)
    }else{
        return number_temp;
    }
}



const juridical_user_comission_cal = (amount) => {
    let cash_out_cal = (amount / 100) * configuration.CASH_OUT_LEGEL_COMISSION_FEE;
    const cash_out_juri_commission = cash_out_cal < configuration.CASH_OUT_MIN_LEGEL_AMOUNT ? configuration.CASH_OUT_MIN_LEGEL_AMOUNT : cash_out_cal;
    return rounding_number(cash_out_juri_commission)
}


const cash_in_comission_cal = (amount) => {
    const cash_in_cal = (amount / 100) * configuration.CASH_IN_COMISSION_FEE;
    const cash_in_commission = cash_in_cal > configuration.CASH_IN_MAX_AMOUNT ? configuration.CASH_IN_MAX_AMOUNT : cash_in_cal;
    return rounding_number(cash_in_commission)
}


calculation_commission_fees(setFilename);