//Creates a payload withe the reservation data
function createPayload(form){
    return {
        date: form.date.value,
        time: form.time.value,
        rut: form.rut.value,
        'first_name': form['first_name'].value,
        'last_name': form['last_name'].value,
        email: form.email.value
    }
}
//Sustract 30 minutes from an hour and returns it as a string
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
//Adds 30 minutes to an hour and returns it as a string
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

export {createPayload, nextHour, previousHour}