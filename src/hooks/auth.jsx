import { createContext, useContext, useState, useEffect } from 'react'

import { api } from '../services/api'

const AuthContext = createContext({})

function AuthProvider({children}){
    const [data, setData] = useState({})

    async function signIn({ email, password }){
        
        try{
            const response = await api.post("/sessions", { email, password })
            const { user, token } = response.data
            
            localStorage.setItem('@rocketnotes:user', JSON.stringify(user))
            localStorage.setItem('@rocketnotes:token', token)
            
            api.defaults.headers.authorization = `Bearer ${token}`
            setData({ user, token })

        }catch(error){
            if(error.response){
                alert(error.response.data.message)
            }else{
                alert("Não foi possível entrar")
            }
        }
    }

    useEffect(() => {
        const user = localStorage.getItem('@rocketnotes:user')
        const token = localStorage.getItem('@rocketnotes:token')

        if(user && token) {
            setData({
                user: JSON.parse(user),
                token: token
            })
        }
    }, [])

    return(
        <AuthContext.Provider value={{ signIn, user: data.user}}>
            {children}
        </AuthContext.Provider>
    )
}

function useAuth(){
    const context = useContext(AuthContext)
    
    return context
}

export { AuthProvider, useAuth }