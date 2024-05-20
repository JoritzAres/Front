import { config } from '../config';

const base_url = `http://${config.server}:${config.server_port}/Login`;


export async function LoginUsuario(datos) {
    const url = `${base_url}/Login`;
    console.log(datos);
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(datos)
    })
        .then(result => {
            return result.json();
        }).then(response => {
            console.log("Response -->", response);
            return response;
        });
    return response;
}
export async function CrearUsuario(datos) {
    const url = `${base_url}/CrearUsuario`;
    console.log(datos);
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(datos)
    })
        .then(result => {
            return result.json();
        }).then(response => {
            console.log("Response -->", response);
            return response;
        });
    return response;
}

export async function LeerSociosActivos() {
    const url = `${base_url}/LeerSociosActivos`;
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

export async function LeerUsuario() {
    const url = `${base_url}/LeerUsuario`;
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

export async function LeerUsuarioID(Dni) {
    const url = `${base_url}/LeerUsuarioID`;
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ Dni: Dni })
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    return response.json();
}
export async function LeerUsuarioNS(N_socio) {
    const url = `${base_url}/LeerUsuarioNS`;
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ N_socio: N_socio })
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    return response.json();
}

// export async function ActualizarUsuario(Usuario) {
//     console.log(Usuario);
//     const url = `${base_url}/ActualizarUsuario`;
//     const response = await fetch(url, {
//         method: 'POST',
//         headers: {
//             Accept: "application/json",
//             "Content-Type": "application/json"
//         },
//         body: JSON.stringify(Usuario)
//     })
//         .then(result => {
//             return result.json();
//         }).then(response => {
//             console.log("Response -->", response);
//             return response;
//         });
//     return response;
// }
    export async function ActualizarUsuario(Usuario) {
        console.log(Usuario);
        const url = `${base_url}/ActualizarUsuario`;
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(Usuario)
            });

            // Asegúrate de que la respuesta sea OK antes de intentar parsear como JSON
            if (response.ok) {
                return await response.json();
            } else {
                // Si la respuesta no es OK, imprime el texto para depurar
                const errorText = await response.text();
                console.error("Error response:", errorText);
                throw new Error(`Server responded with status: ${response.status}`);
            }
        } catch (error) {
            console.error("Error en ActualizarUsuario:", error);
            throw error; // Relanzar el error para manejarlo en la UI si es necesario
        }
    }
export async function EliminarUsuario(id) {
    const url = `${base_url}/EliminarUsuario`;
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
