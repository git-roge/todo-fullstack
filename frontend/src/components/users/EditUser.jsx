export default function EditUser({selectedUser, onClose, onSave}){
    return(
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
            <div className="bg-gray-100 w-1/3 pt-4 pb-10 px-10 rounded-md">
                <button 
                    onClick={onClose}
                    className="text-3xl text-end w-full cursor-pointer">
                        &times;
                </button>
                <h1 className="text-center font-semibold text-4xl pb-10">User Profile</h1>
                <hr className="py-2"/>
                <div className="flex gap-4">
                    <p className="font-semibold text-lg w-30">First Name:</p>
                    <p className="text-lg">{selectedUser.first_name}</p>
                </div>
                <div className="flex gap-4">
                    <p className="font-semibold text-lg w-30">Last Name:</p>
                    <p className="text-lg">{selectedUser.last_name}</p>
                </div>
                <div className="flex gap-4">
                    <p className="font-semibold text-lg w-30">Email:</p>
                    <p className="text-lg">{selectedUser.email}</p>
                </div>
                <div className="flex gap-4">
                    <p className="font-semibold text-lg w-30">Role:</p>
                    <p className="text-lg">{selectedUser.role}</p>
                </div>
                <div className="flex gap-4">
                    <p className="font-semibold text-lg w-30">Status:</p>
                    <p className="text-lg">{selectedUser.is_active ? "Active" : "Not active"}
                        <span 
                            onClick={() => onSave(selectedUser.id, {
                                is_active: !selectedUser.is_active
                            })}
                            className="ml-3 text-sm text-blue-600 cursor-pointer">
                            change status
                        </span>
                    </p>
                </div>
            </div>
        </div>
    )
}