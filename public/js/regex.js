const regexRut = /^(\d{1,2}\d{3}\d{3}-)([kK]{1}$|\d{1}$)/
const regexEmail = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
const regexName = /^[a-zA-ZÀ-ÿ\s]{3,40}$/

const regex = {
    rut: regexRut,
    names: regexName,
    email: regexEmail
}

export {regex}