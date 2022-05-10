import {ValidateAvailableHours, validateField, renderAvailableHours, validateDate, showErrorMessage} from "./validations.js"
import { getUnavailableHours, addReservation } from "./apiQuerys.js"
import { createPayload } from "./utilities.js"
import { regex } from "./regex.js"

const main = (function () {
    //Variables
    const fields = {
        date: false,
        rut: false,
        first_name: false,
        last_name: false,
        email: false,
    }
    //Dom Cache
        const form = document.querySelector('form')
        const inputs = document.querySelectorAll('input:not([type="date"])')
    //Events
    form.date.addEventListener('change', getAvailableHours)
    inputs.forEach(input => {
        input.addEventListener('keyup', validateForm)
        input.addEventListener('blur', validateForm)
    })
    form.addEventListener('submit', sendReservation)
    //Functions
    function init(){
        form.date.value = ''
        form.rut.value = ''
        form.first_name.value = ''
        form.last_name.value = ''
        form.email.value = ''
    }
    //Solucionar: 
    async function getAvailableHours(e){
        e.preventDefault()
        const date = new Date(this.value) 
        const current_date = new Date(Date.now())
        if(validateDate(date, current_date)){
            fields.date = true
            const hours = await getUnavailableHours(date)
            if(!!hours[0]){
                const available_hours = ValidateAvailableHours(hours)
                renderAvailableHours(available_hours)
            }
            else if(hours.available) renderAvailableHours()
            else showErrorMessage(hours.message)
        }
    }

    function validateForm(e) {
        switch(e.target.name){
            case 'rut':{
                fields.rut = validateField(regex.rut, e.target, e.target.name)
                break
            }   
            case 'first_name':{
                fields['first_name'] = validateField(regex.names, e.target, e.target.name)
                break
            }   
            case 'last_name':{
                fields['last_name'] = validateField(regex.names, e.target, e.target.name)
                break
            }   
            case 'email':{
                fields.email = validateField(regex.email, e.target, e.target.name)
                break
            }   
        }
    }

    async function sendReservation(e){
        e.preventDefault()
        if(fields.date && fields.rut && fields['first_name'] && fields['last_name'] && fields.email ){
            const payload = createPayload(form)
            const res = await addReservation(payload)
            if(res.approved){
                form.reset()
                form.time.innerHTML = ''
                for (const field in fields) {
                    fields[field] = false
                }
                document.querySelector('.form_success_message').classList.add('form_success_message_active')
                setTimeout(()=>{
                    document.querySelector('.form_success_message').classList.remove('form_success_message_active')
                }, 5000)
                document.querySelectorAll('.form_group_correct').forEach(icon=>{
                    icon.classList.remove('form_group_correct')
                })
            }
            else showErrorMessage(res.message)
        }
        else showErrorMessage()
    }

    return {init}
})()

main.init()

