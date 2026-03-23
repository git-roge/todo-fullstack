import { useEffect, useState } from "react"
import { getUsers, getUserSelectedById, updateUser } from "../../services/usersService";
import EditUser from "./EditUser";

export default function UsersList() {
    const [usersList, setUsersList] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [error, setError] = useState("");

    const users = async () => {
        try{
            const response = await getUsers();
            setUsersList(response);
            
        }catch(err){
            setError(err.message);
        }
    }

    const handleEditUser = async (id, data) => {
        alert("This will change the status.")
        try{
            const patchUser = await updateUser(id, data)
            const updatedUser = usersList.map(user =>
                user.id === id ? patchUser : user
            )
            setUsersList(updatedUser);
            setSelectedUser(null);
        }catch(err){
            setError(err);
        }
    }

    useEffect(() => {
        users();
    },[])

    const openModal = (user) => setSelectedUser(user);
    const onClose = () => setSelectedUser(null);

    return(
        <div className="bg-gray-100 ring-1 rounded ring-gray-200 flex flex-col">
            {error && <p className="bg-red-100 text-red-500 text-center py-1 font-semibold">{error}</p>}
            <table className="table-fixed table-auto border-collapse border border-gray-300 w-full text-center">
                <thead>
                    <tr>
                        <th className="table-fixed table-auto border-collapse border border-gray-300 w-full">First Name</th>
                        <th className="table-fixed table-auto border-collapse border border-gray-300 w-full">Last Name</th>
                        <th className="table-fixed table-auto border-collapse border border-gray-300 w-full">Username</th>
                        <th className="table-fixed table-auto border-collapse border border-gray-300 w-full">Email</th>
                        <th className="table-fixed table-auto border-collapse border border-gray-300 w-full">Status</th>
                        <th className="table-fixed table-auto border-collapse border border-gray-300 w-full">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {usersList.map((user) => (
                        <tr key={user.id}>
                            <td className="table-fixed table-auto border-collapse border border-gray-300 w-full">{user.first_name}</td>
                            <td className="table-fixed table-auto border-collapse border border-gray-300 w-full">{user.last_name}</td>
                            <td className="table-fixed table-auto border-collapse border border-gray-300 w-full">{user.username}</td>
                            <td className="table-fixed table-auto border-collapse border border-gray-300 w-full">{user.email}</td>
                            <td className="table-fixed table-auto border-collapse border border-gray-300 w-full">{user.is_active ? "Active" : "Not Active"}</td>
                            <td className="table-fixed table-auto border-collapse border border-gray-300 w-full">
                                <div className="flex justify-center py-1">
                                    <button
                                        onClick={() => openModal(user)}
                                        className="bg-blue-400 px-4 text-white font-semibold rounded ring-1 ring-blue-300 hover:bg-blue-500 cursor-pointer">
                                            View
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {selectedUser && 
                <EditUser
                    selectedUser = {selectedUser}
                    onClose = {onClose}
                    onSave = {handleEditUser}
                />
            }
        </div>
    )
}