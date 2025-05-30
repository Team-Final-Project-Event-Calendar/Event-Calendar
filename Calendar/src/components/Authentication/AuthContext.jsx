//Auth.Context.jsx
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");
        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = async (email, password) => {
        const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });
        const data = res.data;
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
        return data.user;
    };

    const register = async (userData) => {
        try {
            const res = await axios.post("http://localhost:5000/api/auth/register", userData);
            return res.data;
        } catch (err) {
            throw new Error(err.response?.data?.message || "Registration failed");
        }
    };


    const logout = async () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        await fetch("http://localhost:5000/api/auth/logout", {
            method: "POST",
            credentials: "include",
        });
        setToken(null);
        setUser(null);
    };

    const isLoggedIn = !!token;

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout, isLoggedIn }}>
            {children}
        </AuthContext.Provider>
    );
}



export default AuthProvider;