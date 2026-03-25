import { useEffect, useState, useCallback } from "react";
import { deleteTodo, getTodos, updateTodo } from "../../services/todoService";
import {formatDate} from "../../utils/formatDate.js";
import EditTodoModal from "./EditModal.jsx";

export function TodoList() {
  const [todos, setTodos] = useState([]);
  const [err, setErr] = useState("");
  const [page, setPage] = useState(1);
  const [next, setNext] = useState(null);
  const [previous, setPrevious] = useState(null);
  const [response, setResponse] = useState("");
  const [editTodo, setEditTodo] = useState(null);

  const role = localStorage.getItem("role");
  const id = localStorage.getItem("id");

  const load = async function load() {
      try{
        const data = await getTodos(page);

        setTodos(data.results);
        setNext(data.next);
        setPrevious(data.previous);
        setErr("");
      }catch(err){
        setErr(err.general || "Something went wrong");
      }
  };
  
  const openModal = (todo) => setEditTodo(todo);
  const closeModal = () => setEditTodo(null);

  useEffect(() => {   
    load();
  },[page])

  const handleDelete = async (id) => {
    try {
        const res = await deleteTodo(id);
        setResponse(res.message);

        const newTodo = todos.filter(todo => todo.id !==id);
        setTodos(newTodo);

        if(newTodo.length === 0){
          load();
        }
    }catch(err){
        setErr(err.general || "Something went Wrong")
    }
  }

  const handlePageNext = () => {
    if(next) setPage((prev) => prev + 1);
  }

  const handlePagePrev = () => {
    if(previous) setPage((prev) => prev - 1)
  }

  const handleSave = async (id, data) => {
    try{
      const response = await updateTodo(id, data);
      const updatedTodo = todos.map(todo => 
        todo.id === id ? response : todo
      );

      setTodos(updatedTodo)
    }catch(err){
      throw err;
    }
  }

  const handleApprove = async (id, data) => {
    try{
      const response = await updateTodo(id, data);
      const updatedTodo = todos.map(todo =>
        todo.id === id ? response : todo
      );

      setTodos(updatedTodo);
    }catch(err){
      throw err;
    }
  }
  return (

    <div className="bg-gray-100 ring-1 rounded ring-gray-200 flex flex-col">
      {response && <p className="bg-green-100 text-green-600 rounded text-center font-semibold py-1">{response}</p>}
      <div className="py-4 space-x-2">
        <input type="text" placeholder="Search..." className="ring-2 ring-gray-300 rounded ml-2 pl-2" />
        <button className="bg-blue-400 rounded text-white px-2">Search</button>
      </div>
      {err && <p className="text-red-500">{err}</p>}
      <div className="overflow-x-auto w-full">
        {todos.length > 0 && (
          <table className="min-w-full border-collapse border-gray-300">
              <thead>
                  <tr>
                      {role=== 'admin' && <th className="border border-gray-300 px-2 py-1 w-40">Worker</th>}
                      <th className="border border-gray-300 px-2 py-1 w-40">Title</th>
                      <th className="border border-gray-300 px-2 py-1 w-[1fr]">Description</th>
                      <th className="border border-gray-300 px-2 py-1 w-40">Date</th>
                      <th className="border border-gray-300 px-2 py-1 w-40">Status</th>
                      <th className="border border-gray-300 px-2 py-1 w-auto" colSpan={2}>Actions</th>
                  </tr>
              </thead>
              <tbody>
                  {todos.map((todo) => (
                      <tr key={todo.id}>
                          {role === 'admin' && <td className="border border-gray-300 px-2 py-1">{todo.user.first_name} {todo.user.last_name}</td>}
                          <td className="border border-gray-300 px-2 py-1">{todo.title}</td>
                          <td className="border border-gray-300 px-2 py-1">{todo.description}</td>
                          <td className="border border-gray-300 px-2 py-1">{formatDate(todo.created_at)}</td>
                          <td className="border border-gray-300 px-2 py-1">{todo.isApproved && "Approved" || todo.completed && "For Approval" || !todo.completed && "Ongoing"}</td>
                          <td className="border border-gray-300 px-2 py-1" colSpan={2}>
                            {role === 'admin' && 
                              <div className="flex justify-center space-x-2">
                              <button
                                disabled={!todo.completed}
                                onClick={() => handleApprove(todo.id, {
                                  isApproved: !todo.isApproved
                                })}
                                className={`bg-green-500 text-white font-semibold px-4 rounded hover:bg-green-400 ${todo.completed ? "cursor-pointer" : "cursor-not-allowed"}`}>
                                Approve
                              </button>
                              <button
                                onClick={() => openModal(todo)}
                                className="bg-blue-500 text-white font-semibold px-4 rounded hover:bg-blue-400 cursor-pointer">
                                Edit
                              </button>
                              <button
                                className="bg-red-500 text-white font-semibold px-4 rounded hover:bg-red-400 cursor-pointer"
                                onClick={() => handleDelete(todo.id)}
                              >
                                Delete
                              </button>
                            </div>
                            }
                            {role === "worker" &&
                              <div className="flex justify-center space-x-2">

                              <button
                                disabled={todo.isApproved}
                                onClick={() => handleSave(todo.id, {
                                  completed: !todo.completed
                                })}
                                className={`bg-blue-500 text-white font-semibold px-4 rounded hover:bg-blue-400 ${todo.isApproved ? "cursor-not-allowed" : "cursor-pointer"}`}>
                                  {todo.completed ? "Revert" : "Complete"}
                              </button>
                            </div>
                            }
                          </td>
                      </tr>
                  ))}
              </tbody>
              
          </table>
        )}
      </div>
        <div className="flex gap-2 justify-center py-4 font-semibold">
            <button className={`hover:bg-gray-200 rounded ${previous ? "cursor-pointer" : "cursor-not-allowed"}`} onClick={handlePagePrev}>&lt;&lt;</button>
            <p>Page {page}</p>
            <button className={`hover:bg-gray-200 rounded ${next ? "cursor-pointer" : "cursor-not-allowed"}`} onClick={handlePageNext}>&gt;&gt;</button>
        </div>
        {editTodo && 
          <EditTodoModal
            todo={editTodo}
            onClose={closeModal}
            onSave={handleSave}
            />}
    </div>
  );
}

export default TodoList;