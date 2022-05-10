import {nextHour, previousHour} from './utilities.js'

// Variables
let posible_hours = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00']


// DomCache
const form = document.querySelector('.form')

//Returns an array with only available hours
function ValidateAvailableHours(hours){
    let available_hours = posible_hours
    hours.forEach(hour => {
        const actual_hour = hour.start_time.split(':').slice(0,2).join(':')
        const blocked_hours = {
            previous: previousHour(actual_hour),
            current: actual_hour,
            next: nextHour(actual_hour)
        }
        if (available_hours.includes(actual_hour)) {
            available_hours = available_hours
                                .filter((hour) => hour!= blocked_hours.previous && hour!= blocked_hours.current && hour!= blocked_hours.next)
        }
    });
    return available_hours
}
//Inserts options into the time select tag qith only available hours
function renderAvailableHours(hours = posible_hours){
    const time_input = form.time
    time_input.innerHTML = ''
    hours.forEach(hour =>{
        const option = document.createElement('option')
        option.value = hour
        option.text = hour
        time_input.appendChild(option)
    })
}
//Validates that the selected date is a valid one (not a passed day - between monday and friday - the current day but before the closing time) and shows the user errors of the selected or a correct date symbol
function validateDate(selected_date, current_date) {
    const date_group = document.getElementById(`date_group`) 
    const icon = document.querySelector(`#date_group i`)  
    const message = document.querySelector(`#date_group .form_input_error`) 
    const weekday = selected_date.getDay()
    current_date.setDate(current_date.getDate() - 1)
    selected_date.setDate(selected_date.getDate() + 1)
    if(selected_date >= current_date){
        current_date.setDate(current_date.getDate() + 1)
        if(weekday == 5 || weekday == 6 || weekday < 0 || weekday > 7){ 
            date_group.classList.add('form_group_incorrect')
            date_group.classList.remove('form_group_correct')
            icon.classList.remove('fa-check-circle')
            icon.classList.add('fa-times-circle')
            message.textContent = 'The Reservation day most be between monday and friday'
            message.classList.add('form_input_error_active')
            return false
        }else if(current_date.getHours() > 17 && validateSameDay(selected_date, current_date) && validateSameMonth(selected_date, current_date) && validateSameYear(selected_date, current_date)){
            date_group.classList.add('form_group_incorrect')
            date_group.classList.remove('form_group_correct')
            icon.classList.remove('fa-check-circle')
            icon.classList.add('fa-times-circle')
            message.textContent = 'Reservations for today are over, choose another day'
            message.classList.add('form_input_error_active')
        }
        else{
            date_group.classList.remove('form_group_incorrect')
            date_group.classList.add('form_group_correct')
            icon.classList.add('fa-check-circle')
            icon.classList.remove('fa-times-circle')
            message.classList.remove('form_input_error_active')
            return true
        }
    } 
    else{
        date_group.classList.add('form_group_incorrect')
        date_group.classList.remove('form_group_correct')
        icon.classList.remove('fa-check-circle')
        icon.classList.add('fa-times-circle')
        message.textContent = 'Choose a valid date'
        message.classList.add('form_input_error_active')
        return false
    }
}
//Validates if two dates has the same day number
function validateSameDay(selected_date, current_date){
    return (selected_date.getDate()==current_date.getDate())?true:false
}
//Validates if two dates has the same month number
function validateSameMonth(selected_date, current_date){
    return (selected_date.getMonth()==current_date.getMonth())?true:false
}
//Validates if two dates has the same year number
function validateSameYear(selected_date, current_date){
    return (selected_date.getFullYear()==current_date.getFullYear())?true:false
}
//Validates that form inputs has correct values and shows the users posible type errors or successfully typed values
function validateField(expression, input, field){
    const group = document.getElementById(`${field}_group`)
    const icon = document.querySelector(`#${field}_group i`)  
    const message = document.querySelector(`#${field}_group .form_input_error`)  
    if(expression.test(input.value)){
        group.classList.remove('form_group_incorrect')
        group.classList.add('form_group_correct')
        icon.classList.add('fa-check-circle')
        icon.classList.remove('fa-times-circle')
        message.classList.remove('form_input_error_active')
        return true
    }else{
        group.classList.add('form_group_incorrect')
        group.classList.remove('form_group_correct')
        icon.classList.remove('fa-check-circle')
        icon.classList.add('fa-times-circle')
        message.classList.add('form_input_error_active')
        return false
    }
}
//Shows an error message, default or sent by the server
function showErrorMessage(message = ''){
    const error_group = document.querySelector('.form_message')
    const error_message = document.querySelector('.form_message p')
    if(!!message) error_message.innerHTML = `<i class=\"fa-solid fa-triangle-exclamation\"></i> <b>Error:</b> ${message}`
    error_group.classList.add('form_message_active')
    setTimeout(()=>{
        error_group.classList.remove('form_message_active')
    }, 5000)
}

export {ValidateAvailableHours, validateField, renderAvailableHours, validateDate, showErrorMessage}