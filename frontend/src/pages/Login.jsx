import { useEffect, useState } from "react"
import {useNavigate} from "react-router-dom";
import { getCurrentUser, handleLogin } from "../services/usersService";

function Login(){
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        if(localStorage.getItem("access")){
            navigate("/");
        }
    },[])

    const onSubmit = async (e) => {
        e.preventDefault();

        try{
            const data = await handleLogin(userName, password);
            
        
            
            if(data){
                localStorage.setItem("access", data.access);
                localStorage.setItem("refresh", data.refresh);

                const user = await getCurrentUser();

                if(user.is_active){
                    localStorage.setItem("username", user.username);
                localStorage.setItem("role", user.role);
                

                navigate("/", {replace: true});
                }
                
            }
        }catch(err){
            setError(err.message)
        }
    }

    const goToRegister = () => {
        navigate("/register");
    }

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="flex flex-col bg-gray-100 rounded ring-1 ring-blue-100 items-center py-4 px-4 gap-6">
                <h1 className="text-2xl font-semibold">Todo App</h1>
                {error && <p className="text-red-500">{error}</p>}
                <form className="grid gap-4" onSubmit={onSubmit}>
                    <input
                        className="ring-1 ring-gray-200 rounded pl-2"
                        type="text"
                        placeholder="username..."
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                    />
                    <input
                        className="ring-1 ring-gray-200 rounded pl-2"
                        type="password"
                        placeholder="password..."
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="bg-blue-500 text-white rounded ring-1 ring-blue-400 hover:bg-blue-600">
                        Login
                    </button>
                </form>
                <button
                    onClick={goToRegister}
                    type="submit"
                    className="bg-yellow-500 text-white rounded ring-1 ring-yellow-500 hover:bg-yellow-600 w-full">
                    Register
                </button>
            </div>
        </div>
    )
}

export default Login