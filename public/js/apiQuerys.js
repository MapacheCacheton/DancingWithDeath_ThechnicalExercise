const url_base = 'http://localhost:3000/api/v1'

async function getUnavailableHours(date) {
    try {
        const response = await fetch(`${url_base}/hours`, {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({date:date})
        })
        console.log(response);
        return await response.json()
    } catch (error) {
        
    }
}


export {getUnavailableHours}