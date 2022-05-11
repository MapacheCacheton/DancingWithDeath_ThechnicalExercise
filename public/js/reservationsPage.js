import {showErrorMessage, identifyField, validatedFields, filterAvailableHours} from "./validations.js"
import { getUserReservations, getReservationData, EditReservationData, deleteReservation } from './apiQuerys.js'
import { createPayload } from "./utilities.js"

const main = (function(){
    //Variables
    let fields = {
        date: false,
        rut: false,
        first_name: false,
        last_name: false,
        email: false,
        id: false,
    }
    //DomCache
    const section_form = document.getElementById('main-content')
    const section_rut = document.getElementById('Reservation_form')
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
    })

    //Functions
    function init(){
        section_form.classList.add('d_none')
        form_reservation.rut2.value = ''
        form_edit.reset()
    }
    //validates user rut with regex pattern
    function validateUserRut(e){
        e.preventDefault()
        identifyField(this)
        fields = validatedFields()
    }
    //Validates every input in the "edit reservation" form
    function validateForm(e) {
        identifyField(e.target)
    }
    //Gets every user reservation in the database and renders adds them into the "your reservations" table
    async function getReservations(e){
        e.preventDefault()
        if(!!fields.rut){
            const reservations = await getUserReservations(rut_input.value)
            if(!reservations.message) renderUserReservations(reservations)
            else showErrorMessage(section_rut, reservations.message)
        }else showErrorMessage(section_rut)
    }
    //Captures a click event for the "edit" and "delete" buttons
    async function modifyReservation(e){
        e.preventDefault()
        if(e.target.classList.contains('edit_btn')){
            
            fields.id = e.target.id
            section_rut.classList.add('d_none')
            section_form.classList.remove('d_none')
            await editReservation(e.target.id)
        }
        else if(e.target.classList.contains('delete_btn')){
            const section = document.querySelector('.form_section:not(.d_none)')
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
                else renderUserReservations(reservations, section )
            }
        }
    }
    //Gets available hours in the selected date
    async function getAvailableHours(e){
        e.preventDefault()
        await filterAvailableHours(this)
    }
    //Sends to the server a payload with the new reservation data
    async function sendEditedReservation(e){
        e.preventDefault()
        fields = validatedFields()
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
                const success_message = document.querySelector('#main-content .form_success_message')
                success_message.classList.add('form_success_message_active')
                setTimeout(()=>{
                    success_message.classList.remove('form_success_message_active')
                }, 5000)
                document.querySelectorAll('#main-content .form_group_correct').forEach(icon=>{
                    icon.classList.remove('form_group_correct')
                })
                const reservations = await getUserReservations(rut_input.value) 
                renderUserReservations(reservations)
            }
            else showErrorMessage(section_form, res.message)
        }
        else showErrorMessage(section_form)
    }
    //Renders the "your reservations" table
    function renderUserReservations(reservations, section='') {
        const html = []
        if(!!reservations.message){
            showErrorMessage(section, reservations.message)
        }
        else{
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
        }
        table.innerHTML = html.join('')
    }
    //Gets the selected reservation data to render in the "edit reservation" form
    async function editReservation(id){
        const reservation = await getReservationData(id)
        renderDataForEditing(reservation)
    }
    //Renders the reservation data in the "edit reservation" form
    function renderDataForEditing(reservation){
        form_edit.rut.value = reservation['user_rut']
        form_edit['first_name'].value = reservation['user_name']
        form_edit['last_name'].value = reservation['user_last_name']
        form_edit.email.value = reservation['user_email']
        form_edit.set.innerHTML = `Edit Reservation`

        const edited_inputs = document.querySelectorAll('#main-content input')
        edited_inputs.forEach(input => {
            identifyField(input)
        })
    }

    return {init}
})()

main.init()