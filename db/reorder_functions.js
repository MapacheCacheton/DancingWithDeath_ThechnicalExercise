function reorderUsersData(users){
    return users.map(user=>{
        const new_user_info = {
            id: user.id,
            link: `http://localhost:3000/api/v1/users/${user.id}`
        }
        return new_user_info
    })
}

function reorderReservationsData(reservations){
    return reservations.map(reservation=>{
        const new_reservation_info = {
            id: reservation.id,
            date: reservation.date,
            start_time: reservation.start_time,
            userLink: `http://localhost:3000/api/v1/users/${reservation.user_fk}`
        }
        return new_reservation_info
    })
}

export { reorderReservationsData, reorderUsersData }