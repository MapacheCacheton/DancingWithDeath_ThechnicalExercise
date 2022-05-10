const url_base = 'http://localhost:3000/api/v1'

async function getUnavailableHours(date) {
    try {
        const response = await fetch(`${url_base}/reservation/hours`, {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({date:date})
        })
        return await response.json()
    } catch (error) {
        console.error(error.message);
    }
}

async function addReservation(payload){
    try{
        const response = await fetch(`${url_base}/reservation`, {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(payload)
        })
        return await response.json()
    } catch (error) {
        console.error(error.message);
    }
}

async function getUserReservations(rut){
    try {
        const response = await fetch(`${url_base}/reservations/${rut}`)
        return await response.json()
    } catch (error) {
        console.error(error.message);
    }
}

async function getReservationData(id){
    try {
        const response = await fetch(`${url_base}/reservation/${id}`)
        return await response.json()
    } catch (error) {
        console.error(error.message);
    }
}

async function EditReservationData(payload){
    try {
        const response = await fetch(`${url_base}/reservation`, {
            headers:{
                'Content-Type': 'application/json'
            },
            method: 'PUT',
            body: JSON.stringify(payload)
        })
        return await response.json()
    } catch (error) {
        console.error(error.message);
    }
}

async function deleteReservation(id){
    try {
        const response = await fetch(`${url_base}/reservation`, {
            headers:{
                'Content-Type': 'application/json'
            },
            method: 'DELETE',
            body: JSON.stringify({id})
        })
        return await response.json()
    } catch (error) {
        console.error(error.message);
    }
}

export {getUnavailableHours, addReservation, getUserReservations, getReservationData, EditReservationData, deleteReservation}