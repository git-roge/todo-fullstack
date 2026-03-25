import { useEffect, useState } from "react";
import { createTodo } from "../../services/todoService";
import { getCurrentUser, getUsers } from "../../services/usersService";

export default function CreateTodoForm({addTodo}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [todoAdded, setTodoAdded] = useState("");
  const [error, setError] = useState("");
  const [workerId, setWorkerId] = useState(null);
  const [users, setUsers] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      title: title,
      description: description,
      user: workerId,
    };

    try{
      const res = await createTodo(formData);
      
      setTodoAdded("New Todo added Successfully!")
      setTitle("");
      setDescription("");
      setError("");
    }catch(err){
      console.log(err)
      setError(err)
    }
  };

  useEffect(() => {
    if(!todoAdded) return;

    const timer = setTimeout(() => {
      setTodoAdded("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [todoAdded])

  const fetchUsers = async () => {
    try{
      const user = await getUsers();
      const workerUser = user.filter((u) => u.role === 'worker')
      setUsers(workerUser);
    }catch(err){
      setError(err)
    }
  }
  useEffect(() => {
    fetchUsers()
  },[]);
  
  return (
    <div className="bg-gray-100 rounded p-4">
      {todoAdded && <p className="text-green-500 bg-green-100 rounded text-center font-semibold py-1">{todoAdded}</p>}
      {error.generalError && <p className="text-red-600 bg-red-100 rounded text-center font-semibold py-1">{error.generalError}</p>}
      <form onSubmit={handleSubmit}>
        <div className="">
          <div className="w-full flex flex-col lg:flex-row gap-2 p-2">
            <label className="font-semibold w-30 px-2 py-1 rounded">
              Worker
            </label>
            <select
              value={workerId || ""}
              onChange={(e) => setWorkerId(Number(e.target.value))}
              className="flex-1 border-2 border-gray-400 rounded px-2 py-1">
              <option>Select User</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>{user.username} | {user.role}</option>
              ))}
              
            </select>
          </div>
          <div className="w-full flex flex-col lg:flex-row gap-2 p-2">
            <label className="font-semibold w-30 px-2 py-1 rounded">
              Title
            </label>
            <input
              type="text"
              placeholder="title..."
              className="flex-1 border-2 border-gray-400 rounded px-2 py-1"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          {error.title_error && <p className="text-red-600 bg-red-100 w-full pl-4 rounded">{error.title_error}</p>}
          <div>
            {error.title && <p className="text-red-500">{error.title[0]}</p>}
          </div>
          <div className="w-full flex flex-col lg:flex-row gap-2 p-2">
            <label className="font-semibold w-30 px-2 py-1 rounded">
              Description
            </label>

            <input
              type="text"
              placeholder="description..."
              className="flex-1 border-2 border-gray-400 rounded px-2 py-1"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button 
              type="submit" 
              className="bg-blue-400 w-20 rounded text-white ring-1 ring-blue-300 hover:bg-blue-500">Submit</button>
            <button 
              disabled={!users}
              type="button"
              onClick={() => {
                setTitle("");
                setDescription("");
              }}
              className="bg-amber-500 w-20 rounded text-white ring-1 ring-amber-300 hover:bg-amber-600">Clear</button>
          </div>
        </div>
      </form>
    </div>
  );
}