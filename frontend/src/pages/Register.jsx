import { useState, useMemo } from "react"
import { createUser } from "../services/usersService";
import { useNavigate } from "react-router-dom";

export default function Register() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState("");
    const [error, setError] = useState("");

    const roleItems = ["Select Role", 'Admin', "Worker"];
    const navigate = useNavigate();

    const formData = {
        first_name: firstName,
        last_name: lastName,
        username: username,
        email: email,
        password: password,
        role: role.toLowerCase(),
        is_active: false,
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try{
            const response = await createUser(formData);
            navigate("/login");
        }catch(err){
            console.log(err);
            setError(err);
        }
        
    }

    return(
        <div className="flex justify-center items-center h-screen">
            <div className="flex flex-col gap-10 bg-gray-200 w-1/3 py-10 px-20 justify-center rounded-xl">
                <h1 className="text-center font-bold text-3xl">Register</h1>
                <div>
                    {error && <p className="text-red-600 text-center bg-red-100 rounded-md my-2">Something went wrong</p>}
                    <form onSubmit={(e) => handleSubmit(e)} className="space-y-4">
                        <input
                            type="text"
                            placeholder="First Name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="ring-2 ring-gray-400 rounded w-full pl-3"
                        />
                        <input
                            type="text"
                            placeholder="Last Name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="ring-2 ring-gray-400 rounded w-full pl-3"
                        />
                        <input
                            type="text"
                            placeholder="username"
                            value={username}
                            onChange={(e) => setUserName(e.target.value)}
                            className="ring-2 ring-gray-400 rounded w-full pl-3"
                        />
                        <input
                            type="email"
                            placeholder="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="ring-2 ring-gray-400 rounded w-full pl-3"
                        />
                        <input
                            type="password"
                            placeholder="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="ring-2 ring-gray-400 rounded w-full pl-3"
                        />
                        <input
                            type="password"
                            placeholder="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="ring-2 ring-gray-400 rounded w-full pl-3"
                        />
                        <div className="relative">
                            <select
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="ring-2 ring-gray-400 rounded w-full pl-3 pr-8 text-gray-700 appearance-none"
                            >
                                {roleItems.map((item, idx) => (
                                <option key={idx} value={item === "Select Role" ? "" : item}>
                                    {item}
                                </option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-700">
                                ▼
                            </div>
                        </div>
                        
                        <button type="submit" className="bg-blue-500 ring-1 ring-blue-400 rounded-md w-full text-white font-semibold hover:bg-blue-600 mt-5">
                            Register
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}