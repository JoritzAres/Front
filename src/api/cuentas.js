import { config } from '../config';

// const base_url = `${config.server}/cuentas`;
const base_url = `http://${config.server}:${config.server_port}/cuentas`;
// Funciones para transacciones

export async function CrearTransaccion(transaccion) {
    const url = `${base_url}/CrearTransaccion`;
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(transaccion)
    })
        .then(result => result.json())
        .then(response => {
            console.log("Response -->", response);
            return response;
        });
    return response;
}

export async function LeerTransacciones() {
    const url = `${base_url}/LeerTransacciones`;
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify()
    })
        .then(result => result.json())
        .then(response => {
            console.log("Response -->", response);
            return response;
        });
    return response;
}

export async function ActualizarTransaccion(transaccion) {
    const url = `${base_url}/ActualizarTransaccion`;
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(transaccion)
    })
        .then(result => result.json())
        .then(response => {
            console.log("Response -->", response);
            return response;
        });
    return response;
}

export async function EliminarTransaccion(id) {
    const url = `${base_url}/EliminarTransaccion`;
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ id: id })
    })
        .then(result => result.json())
        .then(response => {
            console.log("Response -->", response);
            return response;
        });
    return response;
}


export async function LeerTransaccionesPorFecha(mes, año) {
    const url = `${base_url}/LeerTransaccionesPorFecha`;
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ mes, año })
    })
        .then(result => result.json())
        .then(response => {
            console.log("Response -->", response);
            return response;
        });
    return response;
}
export async function LeerTransaccionID(idTransaccion) {
    const url = `${base_url}/LeerTransaccionID/${idTransaccion}`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        }
    })
        .then(result => result.json())
        .then(response => {
            console.log("Response -->", response);
            return response;
        })
        .catch(error => {
            console.error("Error:", error);
        });
    return response;
}

// Funciones para etiquetas

export async function CrearEtiqueta(etiqueta) {
    const url = `${base_url}/CrearEtiqueta`;
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(etiqueta)
    })
        .then(result => result.json())
        .then(response => {
            console.log("Response -->", response);
            return response;
        });
    return response;
}

export async function LeerEtiquetas() {
    const url = `${base_url}/LeerEtiquetas`;
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify()
    })
        .then(result => result.json())
        .then(response => {
            console.log("Response -->", response);
            return response;
        });
    return response;
}

export async function ActualizarEtiqueta(etiqueta) {
    const url = `${base_url}/ActualizarEtiqueta`;
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(etiqueta)
    })
        .then(result => result.json())
        .then(response => {
            console.log("Response -->", response);
            return response;
        });
    return response;
}

export async function EliminarEtiqueta(id) {
    const url = `${base_url}/EliminarEtiqueta`;
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ id: id })
    })
        .then(result => result.json())
        .then(response => {
            console.log("Response -->", response);
            return response;
        });
    return response;
}
