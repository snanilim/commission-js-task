const fs = require('fs');
const { ArgumentParser } = require('argparse');

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
            const cash_in_commission = cash_in_comission_cal(element)
            console.log(cash_in_commission)

        }else if(element.type === 'cash_out'){
            if(element.user_type === 'natural'){
                const cal_comission = natural_user_comission_cal(element)
                console.log(cal_comission)

            }else if (element.user_type === 'juridical') {
                const cal_comission = juridical_user_comission_cal(element)
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
    const d = new Date(element.date);
    const tomorrow = new Date(element.date);

    let day = d.getDay();
    let new_day = day - 1;
    if (new_day < 0){
        new_day = 6
    }

    if(natural_user_id_arr.includes(element.user_id)){
        const cal_comission = natural_old_user(element, new_day, tomorrow, d)
        return cal_comission
    }else{
        const cal_comission = natural_new_user(element, new_day, tomorrow, d)
        return cal_comission
    }

}





const natural_old_user = (element, new_day, tomorrow, d) => {
    const user_id_index = natural_user_id_arr.indexOf(element.user_id)
    const user_info = natural_user[user_id_index]
    // console.log("info", element)

    // date check
    const start = natural_user[user_id_index].start_date;
    const end = natural_user[user_id_index].end_date;

    if (d >= start && d <= end) {
        // console.log('✅ date is between the 2 dates', d);
        if(natural_user[user_id_index].amount > 1000){
            // console.log("-------------yes beshi--------")
            const cal_comission =  (element.operation.amount / 100) * 0.3
            return rounding_number(cal_comission)
        }else if((natural_user[user_id_index].amount + element.operation.amount) > 1000){
            // console.log("-------------no beshi--------")
            const comission_amount = (natural_user[user_id_index].amount + element.operation.amount) - 1000
            const cal_comission =  (comission_amount / 100) * 0.3
            return rounding_number(cal_comission)
        }
    } else {
        // console.log('⛔️ date is not in the range', d);
        const {start_date, end_date} = date_cal (new_day, tomorrow, d)
        // console.log("⛔️", start_date, end_date)

        natural_user[user_id_index].amount = element.operation.amount
        natural_user[user_id_index].start_date = start_date
        natural_user[user_id_index].end_date = end_date

        const for_cal_amount = element.operation.amount
        const cal_comission =  amount_cal(for_cal_amount)
        return cal_comission
    }
}




const natural_new_user = (element, new_day, tomorrow, d) => {
    natural_user_id_arr.push(element.user_id)
    const {start_date, end_date} = date_cal (new_day, tomorrow, d)

    natural_user.push({user_id: element.user_id, amount: element.operation.amount, start_date: start_date, end_date: end_date})
    const for_cal_amount = element.operation.amount
    const cal_comission =  amount_cal(for_cal_amount)
    return cal_comission
}


const amount_cal = (for_cal_amount) => {
    if(for_cal_amount > 1000){
        // console.log("-------------yes beshi--------")
        const comission_amount = for_cal_amount - 1000
        const cal_comission = (comission_amount / 100) * 0.3
        return rounding_number(cal_comission)
    }else{
        return rounding_number(0.00)
    }
}



const date_cal = (new_day, tomorrow, d) => {
    const end_date_number = 6 - new_day
    const start_date = new Date(tomorrow.setDate(d.getDate() - new_day) )
    const end_date = new Date(tomorrow.setDate(d.getDate() + end_date_number))

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



const juridical_user_comission_cal = (element) => {
    const cash_out_juri_cal = (element.operation.amount / 100) * 0.3;
                
    let cash_out_juri_commission = cash_out_juri_cal
    if (cash_out_juri_commission < 0.50){
        cash_out_juri_commission = 0.50
    }

    const cal_comission = cash_out_juri_cal.toFixed(2)
    return rounding_number(cal_comission)
}


const cash_in_comission_cal = (element) => {
    const cash_in_cal = (element.operation.amount / 100) * 0.03;
    let cash_in_commission = cash_in_cal
    if (cash_in_cal > 5.00){
        cash_in_commission = 5.00
    }
    
    return rounding_number(cash_in_commission)
}


calculation_commission_fees(setFilename);