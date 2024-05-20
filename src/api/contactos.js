import { config } from '../config';

const base_url = `http://${config.server}:${config.server_port}/contactos`;

export async function CrearContacto(contacto) {
    const url = `${base_url}/CrearContacto`;
    console.log(contacto);
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(contacto)
    })
        .then(result => {
            return result.json();
        }).then(response => {
            console.log("Response -->", response);
            return response;
        });
    return response;
}

export async function LeerContactos() {
    const url = `${base_url}/LeerContactos`;
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

export async function LeerContactosID(ID) {
    const url = `${base_url}/LeerContactosID`;
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ ID:ID })
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    return response.json();
}

export async function EliminarContacto(contactoSeleccionado) {
    const url = `${base_url}/EliminarContacto`;
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({contactoSeleccionado : contactoSeleccionado})
    })
        .then(result => {
            return result.json();
        }).then(response => {
            console.log("Response -->", response);
            return response;
        });
    return response;
}
export async function ActualizarContacto(contacto) {
    const url = `${base_url}/ActualizarContacto`;
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(contacto)
    })
        .then(result => {
            return result.json();
        }).then(response => {
            console.log("Response -->", response);
            return response;
        });
    return response;
}