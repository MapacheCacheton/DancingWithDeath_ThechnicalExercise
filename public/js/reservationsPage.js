import { ValidateAvailableHours, validateField, renderAvailableHours, validateDate, showErrorMessage } from "./validations.js"
import { getUserReservations, getReservationData, getUnavailableHours, EditReservationData, deleteReservation } from './apiQuerys.js'
import { createPayload } from "./utilities.js"
import { regex } from "./regex.js"

//Solucionar: Mesaje de error al rendeizar la fecha y el mensaje de fecha invalida no se muestra
//Solucionar: terminar accion edit
//Solucionar: terminar accion delete
const main = (function(){
    //Variables
    const fields = {
        date: false,
        rut: false,
        first_name: false,
        last_name: false,
        email: false,
        id: false,
    }
    //DomCache
    const section_form = document.getElementById('main-content')
    const form_reservation = document.querySelector('.form_reservations')
    const form_edit = document.querySelector('.form')
    const table = document.querySelector('tbody')
    const inputs = document.querySelectorAll('#main-content input:not([type="date"])')

    const rut_input = form_reservation.rut2

    //Events
    form_reservation.addEventListener('submit', getReservations)
    table.addEventListener('click', modifyReservation)
    form_edit.date.addEventListener('change', getAvailableHours)
    form_edit.addEventListener('submit', sendEditedReservation)
    
    //Validation events
    rut_input.addEventListener('keyup', validateUserRut)
    rut_input.addEventListener('blur', validateUserRut)
    inputs.forEach(input => {
        input.addEventListener('keyup', validateForm)
        input.addEventListener('blur', validateForm)
        input.addEventListener('change', validateForm)
    })

    //Functions
    function init(){
        section_form.classList.add('d_none')
        form_reservation.rut2.value = ''
        form_edit.reset()
    }

    function validateUserRut(e){
        e.preventDefault()
        fields.rut = validateField(regex.rut, e.target, e.target.name)
    }

    function validateForm(e) {
        switch(e.target.name){
            case 'rut':{
                fields.rut = validateField(regex.rut, e.target, e.target.name)
                break
            }   
            case 'rut2':{
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

    async function getReservations(e){
        e.preventDefault()
        if(fields.rut){
            const reservations = await getUserReservations(rut_input.value)
            if(!reservations.message) renderUserReservations(reservations)
            else showErrorMessage(reservations.message)
        }
    }

    async function modifyReservation(e){
        e.preventDefault()
        if(e.target.classList.contains('edit_btn')){
            const section_rut = document.getElementById('Reservation_form')
            fields.id = e.target.id
            section_rut.classList.add('d_none')
            section_form.classList.remove('d_none')
            await editReservation(e.target.id)
        }
        else if(e.target.classList.contains('delete_btn')){
            const response = await deleteReservation(e.target.id)
            if(response.approved){
                const success_message = document.querySelectorAll('.form_success_message')
                success_message.forEach(message=>{
                    message.innerHTML = 'Reservation deleted successfully'
                    message.classList.add('form_success_message_active')
                    setTimeout(()=>{
                        message.classList.remove('form_success_message_active')
                        message.innerHTML = 'Reservation sent'
                    }, 5000)
                })
                const reservations = await getUserReservations(rut_input.value) 
                if(!reservations.message){
                    renderUserReservations(reservations)
                }
                else showErrorMessage(error.message)
            }
        }
    }

    async function getAvailableHours(e){
        e.preventDefault()
        await filterAvailableHours(this.value)
    }

    async function filterAvailableHours(date){
        const reservated_date = new Date(date) 
        const current_date = new Date(Date.now())
        if(validateDate(reservated_date, current_date)){
            const hours = await getUnavailableHours(date)
            if(!!hours[0]){
                const available_hours = ValidateAvailableHours(hours)
                renderAvailableHours(available_hours)
            }
            else if(hours.available) renderAvailableHours()
            else showErrorMessage(hours.message)
            fields.date = true
        }
    }

    async function sendEditedReservation(e){
        e.preventDefault()
        if(fields.date && fields.rut && fields['first_name'] && fields['last_name'] && fields.email ){
            const payload = createPayload(form_edit)
            payload.id = fields.id
            const res = await EditReservationData(payload)
            if(res.approved){
                form_edit.reset()
                form_edit.time.innerHTML = ''
                for (const field in fields) {
                    fields[field] = false
                }
                const success_message = document.querySelector('.form_success_message')
                success_message.classList.add('form_success_message_active')
                setTimeout(()=>{
                    success_message.classList.remove('form_success_message_active')
                }, 5000)
                document.querySelectorAll('.form_group_correct').forEach(icon=>{
                    icon.classList.remove('form_group_correct')
                })
                const reservations = await getUserReservations(rut_input.value) 
                renderUserReservations(reservations)
            }
            else showErrorMessage(res.message)
        }
        else showErrorMessage()
    }

    function renderUserReservations(reservations) {
        const html = []
        reservations.forEach((reservation, index)=>{
            const row = `
            <tr>
                <td class="field_removable">${index+1}</td>
                <td class="field_removable">${reservation['user_name']} ${reservation['user_last_name']}</td>
                <td class="field_removable">${reservation['user_rut']}</td>
                <td>${reservation.date.toString().split('').splice(0,10).join('')}</td></td>
                <td>${reservation['start_time'].split(':').splice(0,2).join(':')}</td>
                <td class="field_removable">${reservation['user_email']}</td>
                <td>
                    <div class="check_reservations">
                        <a id="${reservation.id}" class="modify_btn edit_btn">Edit</a>  
                    </div>
                </td>
                <td>
                    <div class="check_reservations">
                        <a id="${reservation.id}" class="modify_btn delete_btn" >Delete</a>
                    </div>
                </td>
            </tr>`
            html.push(row)
        })
        table.innerHTML = html.join('')
    }

    async function editReservation(id){
        const reservation = await getReservationData(id)
        renderDataForEditing(reservation)
    }
  
    function renderDataForEditing(reservation){
        // form_edit.date.defaultValue = new Date(reservation.date)
        form_edit.rut.value = reservation['user_rut']
        form_edit['first_name'].value = reservation['user_name']
        form_edit['last_name'].value = reservation['user_last_name']
        form_edit.email.value = reservation['user_email']
        form_edit.set.innerHTML = `Edit Reservation`
    }

    return {init}
})()

main.init()