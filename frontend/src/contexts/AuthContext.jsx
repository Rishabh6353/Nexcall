import { createContext, useContext, useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import httpStatus from "http-status";


//creating context to avaoid props drilling
export const AuthContext = createContext({});


// setting base url
const client = axios.create({
    baseURL: "http://localhost:8000/api/v1/users"
})

export const AuthProvider = ({children})=>{
    const authContext = useContext(AuthContext);

    //initially empty context
    const [userData, setUserData] = useState(authContext);

    //to redirect after login to home
    const router = useNavigate();


    //upon register handling backend fn
    const handleRegister = async (name,username, password)=>{
        try{
            let request = await client.post("/register",{
                name: name,
                username: username,
                password: password
            })

            if(request.status === httpStatus.CREATED){
                return request.data.message;
            }
        }catch(err){
            throw err;
    }
    }


    //handle login fn
    const handleLogin = async (username, password)=>{
        try{
            let request = await client.post("/login",{
                username: username,
                password:password
            });

            if(request.status=== httpStatus.OK){
                localStorage.setItem("token",request.data.token);
                router("/home")
            }
        }catch(err){
            throw err;
        }
    }



    //exporting the wrapped fns and states to childrens
    const data = {
        userData, setUserData, handleRegister,handleLogin
    }

    return (
        <AuthContext.Provider value={data}>
            {children}
        </AuthContext.Provider>
    )
}