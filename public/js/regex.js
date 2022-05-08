const regexRut = /^(\d{1,2}\.\d{3}\.\d{3}-)([kK]{1}$|\d{1}$)/
const regexEmail = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
const regexName = /^[a-zA-ZÀ-ÿ\s]{1,40}$/

export {regexEmail, regexRut, regexName}