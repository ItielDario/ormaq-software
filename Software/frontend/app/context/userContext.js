'use client';

import { createContext, useState } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    let usuario = null;

    if (typeof localStorage !== "undefined") {
        usuario = JSON.parse(localStorage.getItem("usuario"));
    }

    const [user, setUser] = useState(usuario);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContext;