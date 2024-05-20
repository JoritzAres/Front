import { config } from '../config';

const base_url = `https://${config.server}:${config.server_port}/inventario`;

export async function CrearInventario(inventario) {
    const url = `${base_url}/CrearInventario`;
    console.log(inventario);
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(inventario)
    })
        .then(result => {
            return result.json();
        }).then(response => {
            console.log("Response -->", response);
            return response;
        });
    return response;
}

export async function LeerInventarios() {
    const url = `${base_url}/LeerInventarios`;
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

export async function LeerInventarioID(id) {
    const url = `${base_url}/LeerInventarioID`;
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ id })
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    return response.json();
}


export async function ActualizarInventario(inventario) {
    const url = `${base_url}/ActualizarInventario`;
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(inventario)
    })
        .then(result => {
            return result.json();
        }).then(response => {
            console.log("Response -->", response);
            return response;
        });
    return response;
}

export async function EliminarInventario(id_inv) {
    const url = `${base_url}/EliminarInventario`;
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ id_inv })
    })
        .then(result => {
            return result.json();
        }).then(response => {
            console.log("Response -->", response);
            return response;
        });
    return response;
}
