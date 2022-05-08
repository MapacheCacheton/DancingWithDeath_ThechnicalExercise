import { getUnavailableHours } from "./apiQuerys.js"

const main = (function () {
    //Variables
    let posible_hours = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00']
    //Dom Cache
        const form = document.querySelector('form')
        const date_input = form.date
        date_input.value = ''
        const time_input = form.time
        const rut_input = form.rut
        const first_name_input = form.first_name
        const last_name_input = form.last_name
        const email_input = form.email
    //Events
    date_input.addEventListener('change', getAvailableHours)

    //Functions
    function init(){

    }
    async function getAvailableHours(e){
        e.preventDefault()
        const date = new Date(this.value) 
        const current_date = new Date(Date.now())
        if(date >= current_date){
            const hours = await getUnavailableHours(date)
            console.log(hours);
            if(hours.length){
                const available_hours = filterAvailableHours(hours)
                renderAvailableHours(available_hours)
            }
            else if(hours.available) renderAvailableHours(posible_hours)
            else showErrorMessage(hours.message)
        }
        else showErrorMessage()
    }

    function filterAvailableHours(hours){
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

    function previousHour(time){
        let previous_time = time.split(':')
        if(previous_time[1]=='00'){
            previous_time[0] = `${Number.parseInt(previous_time[0])-1}`
            previous_time[1] = `30`
        }
        else{
            previous_time[1] = `00`
        }
        return previous_time.join(':')
    }

    function nextHour(time){
        let previous_time = time.split(':')
        if(previous_time[1]=='00'){
            previous_time[1] = `30`
        }
        else{
            previous_time[0] = `${Number.parseInt(previous_time[0])+1}`
            previous_time[1] = `00`
        }
        return previous_time.join(':')
    }

    function renderAvailableHours(hours){
        time_input.innerHTML = ''
        hours.forEach(hour =>{
            const option = document.createElement('option')
            option.value = hour
            option.text = hour
            time_input.appendChild(option)
        })
    }
    function showErrorMessage(message = ''){
        const error_message = date_input.parentElement.parentElement.children[2]
        if(!!message) error_message.textContent = message 
        error_message.classList.toggle('form_input_error_active') //Solucionar: Si se elige 2 veces una fecha invalida el mensaje desaparece 
    }

    return {init}
})()

main.init()