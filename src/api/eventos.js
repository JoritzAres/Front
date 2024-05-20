import { config } from '../config';

const base_url = `https://${config.server}:${config.server_port}/eventos`;

export async function CrearEvento(evento) {
    const url = `${base_url}/CrearEvento`;
    console.log(evento);
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(evento)
    })
        .then(result => {
            return result.json();
        }).then(response => {
            console.log("Response -->", response);
            return response;
        });
    return response;
}

export async function ApuntarseEvento(evento) {
    const url = `${base_url}/ApuntarseEvento`;
    console.log(evento);
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(evento)
    })
        .then(result => {
            return result.json();
        }).then(response => {
            console.log("Response -->", response);
            return response;
        });
    return response;
}

export async function LeerEventos() {
    const url = `${base_url}/LeerEventos`;
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify()
    })
        .then(result => {
            return result.json();
        }).then(response => {
            console.log("Response -->", response);
            return response;
        });
    return response;
}

export async function LeerEventosApuntado(evento) {
    const url = `${base_url}/LeerEventosApuntado`;
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(evento)
    })
        .then(result => {
            return result.json();
        }).then(response => {
            console.log("Response -->", response);
            return response;
        });
    return response;
}

export async function LeerRutas() {
    const url = `${base_url}/LeerRutas`;
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify()
    })
        .then(result => {
            return result.json();
        }).then(response => {
            console.log("Response -->", response);
            return response;
        });
    return response;
}

export async function LeerEventosID(nombre) {
    const url = `${base_url}/LeerEventosID`;
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ nombre })
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    return response.json();
}


export async function ActualizarEvento(evento) {
    const url = `${base_url}/ActualizarEvento`;
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(evento)
    })
        .then(result => {
            return result.json();
        }).then(response => {
            console.log("Response -->", response);
            return response;
        });
    return response;
}

export async function EliminarEvento(id) {
    const url = `${base_url}/EliminarEvento`;
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ id: id })
    })
        .then(result => {
            return result.json();
        }).then(response => {
            console.log("Response -->", response);
            return response;
        });
    return response;
}

export async function EliminarEventosApuntado(evento) {
    const url = `${base_url}/EliminarEventosApuntado`;
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify( evento )
    })
        .then(result => {
            return result.json();
        }).then(response => {
            console.log("Response -->", response);
            return response;
        });
    return response;
}