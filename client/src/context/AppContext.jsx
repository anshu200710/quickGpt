import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dummyChats, dummyUserData } from '../assets/assets';
import axios from 'axios';
import toast from 'react-hot-toast';


const AppContext = createContext()


export const AppContextProvider = ({ children })=> {

    axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL;




    const navigate = useNavigate()
    const [user, setUser] = useState(null)
    const [chats, setChats] = useState([])
    const [selectedChat, setSelectedChat] = useState(null)


    
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    const [token, setToken] = useState(localStorage.getItem('token') || null)
    const [loadingUser, setLoadingUser] = useState(true)

     useEffect(()=> {
        if(theme === 'dark'){
            document.documentElement.classList.add('dark');
        } else{
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', theme)
    },[theme])




    const fetchUser = async () => {
        try {
           const{ data} =  await axios.get('/api/user/data', {headers: {Authorization: token}})
            if (data.success) {
                setUser(data.user)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        } finally{
            setLoadingUser(false)
        }
    }


    const createNewChat = async () => {
        try {
            if(!user) return toast('Login to create a new chat.')
                navigate('/')
            await axios.get('/api/chat/create', {headers: {Authorization: token}})
            await fetchUserChats()

        } catch (error) {
            toast.error(error.message)
        }
    }


    const fetchUserChats = async ()=> {
        try {
            const {data} = await axios.get('/api/chat/get', {headers: {Authorization: token}})

            if(data.success){
                setChats(data.chats)
                // If the user has no chats , create one 
                if(data.chats.length === 0 ){
                    await createNewChat()
                    await fetchUserChats()
                } else {
                    setSelectedChat(data.chats[0])
                }
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }
    }


    useEffect(()=> {
        if(token) {
            fetchUser()
        }else {
            setUser(null)
            setLoadingUser(false)
        }  
    }, [token])

    useEffect(()=> {
        if(user){
            fetchUserChats()
        }
        else{
            setChats([])
            setSelectedChat(null)
            navigate('/login')
        }
    },[user])


   
    const value = {
        navigate,
        user,
        setUser,
        chats,
        setChats,
        selectedChat,
        setSelectedChat,
        theme,
        fetchUser,
        setTheme, createNewChat,
        loadingUser, fetchUserChats, token, setToken, axios
        }


    return (
        
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = () => useContext(AppContext);

