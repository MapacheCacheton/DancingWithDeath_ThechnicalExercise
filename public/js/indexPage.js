import {showErrorMessage, identifyField, validatedFields, filterAvailableHours} from "./validations.js"
import { addReservation } from "./apiQuerys.js"
import { createPayload } from "./utilities.js"

const main = (function () {
    //Variables
    let fields = {
        date: false,
        rut: false,
        first_name: false,
        last_name: false,
        email: false,
    }
    //Dom Cache
        const form = document.querySelector('form')
        const inputs = document.querySelectorAll('input:not([type="date"])')
        const section = document.getElementById('main-content')
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
        await filterAvailableHours(this, section)
        fields = validatedFields()
    }

    function validateForm(e) {
        e.preventDefault()
        identifyField(this)
        fields = validatedFields()
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
            else showErrorMessage(section, res.message)
        }
        else showErrorMessage(section)
    }

    return {init}
})()

main.init()

