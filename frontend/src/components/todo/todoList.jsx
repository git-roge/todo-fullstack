import { useEffect, useState, useCallback } from "react";
import { deleteTodo, getTodos, updateTodo } from "../../services/todoService";
import {formatDate} from "../../utils/formatDate.js";
import EditTodoModal from "./EditModal.jsx";
import useDebounce from "../../hooks/useDebounce.js";
import { getAccessToken } from "../../auth/tokenStore.js";
import { jwtDecode } from "jwt-decode";

export function TodoList() {
  const [todos, setTodos] = useState([]);
  const [err, setErr] = useState("");
  const [page, setPage] = useState(1);
  const [next, setNext] = useState(null);
  const [previous, setPrevious] = useState(null);
  const [response, setResponse] = useState("");
  const [editTodo, setEditTodo] = useState(null);

  const [search, setSearch] = useState("");
  const [field, setField] = useState("title");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [appliedSearch, setAppliedSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const token = getAccessToken();
  const decode = jwtDecode(token);
  const role = decode.role;
  const id = localStorage.getItem("id");

  const searchFields = [
    {label: "Full Name", value:"user"},
    {label: "Title", value:"title"},
    {label: "Description", value:"description"},
  ]

  const debouncedSearch = useDebounce(search, 400);

  const load = async function load() {
      try{
        const data = await getTodos(page, appliedSearch, field);
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
  },[page, appliedSearch])

  useEffect(() => {
    if(!debouncedSearch){
      setResults([]);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try{
        const data = await getTodos(1, debouncedSearch, field);

        const seen = new Set();

        if(field === "title"){
          const uniqueResults = data.results.filter(todo => {
            if(seen.has(todo.title)) return false;

            seen.add(todo.title)
            return true;
          })
          
          setResults(uniqueResults);
        }else if(field === "description"){
          const uniqueResults = data.results.filter(todo => {
            if(seen.has(todo.description)) return false;

            seen.add(todo.title)
            return true;
          })

          setResults(uniqueResults);
        }
      }catch(err){
        console.log(err)
        setResults([]);
      }
      setLoading(false);
    };

    fetchData();
  },[debouncedSearch, field])

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
        setErr(err.general || "Something went Wrong");
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
      <div className="">
        <div className="py-4 flex w-2/4">

          <div className="flex items-center bg-white ring-2 ring-gray-300 rounded-l-md rounded-r-none px-2 w-full">
            
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setShowDropdown(true);
              }}
              type="text"
              placeholder="Search..."
              className="flex-1 outline-none py-1"
            />

            {search && (
              <button
                onClick={() => {
                  setSearch("");
                  setResults([]);
                  setAppliedSearch("");
                }}
                className="text-gray-400 hover:text-gray-600 font-bold px-2"
              >
                ×
              </button>
            )}
          </div>

          {/* Select */}
          <select
            value={field}
            onChange={(e) => setField(e.target.value)}
            className="ring-2 ring-gray-300 border-l-0 rounded-r-md rounded-l-none px-3 py-1 bg-gray-100"
          >
            {searchFields.map((searchField) => (
              <option
                key={searchField.value}
                value={searchField.value}
              >
                {searchField.label}
              </option>
            ))}
          </select>

        </div>
        <div className="relative">
          {showDropdown && search && (
            <div className="absolute ml-2 w-1/4 bg-white border border-gray-300 rounded -mt-4 max-h-60 overflow-y-auto shadow-lg z-10">
              {loading ? (
                <div>
                  Loading...
                </div>
              ) : results.length > 0 ? (
                <ul>
                  {results.map(todo => (
                    <li
                      key={todo.id}
                      onClick={() => {
                        let value = ""
                        if(field === 'title'){
                          value = todo.title
                        }else if(field === 'description'){
                          value = todo.description
                        } 
                        setSearch(value);
                        setAppliedSearch(value);
                        setResults([]);
                        setPage(1);
                        setShowDropdown(false)
                      }}
                      className="px-3 py2 ring-1"
                    >
                      {field === 'title' && <div className="font-medium">{todo.title}</div>}
                      {field === 'description' && <div className="font-medium">{todo.description.slice(0,20)}</div>}
                    </li>
                  ))}
              </ul>
              ) : debouncedSearch ? (
                <div>No results</div>
              ) : null }
            </div>
          )} 
        </div>
      </div>
      {err && <p className="text-red-500">{err}</p>}
      <div className="overflow-x-auto w-full">
        {todos.length > 0 && (
          <table className="min-w-full border-collapse border-gray-300">
              <thead>
                  <tr>
                      {role=== 'admin' && <th className="border border-gray-300 px-2 py-1 w-1/8">Worker</th>}
                      <th className="border border-gray-300 px-2 py-1 w-2/8">Title</th>
                      <th className="border border-gray-300 px-2 py-1 w-4/8">Description</th>
                      <th className="border border-gray-300 px-2 py-1 w-1/4">Date</th>
                      <th className="border border-gray-300 px-2 py-1 w-2/4">Status</th>
                      <th className="border border-gray-300 px-2 py-1 w-1/4" colSpan={2}>Actions</th>
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
                              <div className="flex flex-col gap-1 lg:flex-row justify-center space-x-2">
                                <button
                                  disabled={!todo.completed}
                                  onClick={() => handleApprove(todo.id, {
                                    isApproved: !todo.isApproved
                                  })}
                                  className={`bg-green-500 text-white w-full font-semibold px-4 rounded hover:bg-green-400 ${todo.completed ? "cursor-pointer" : "cursor-not-allowed"}`}>
                                  {todo.isApproved ? "Disapprove":"Approve"}
                                </button>
                                <button
                                  onClick={() => openModal(todo)}
                                  className="bg-blue-500 text-white w-full font-semibold px-4 rounded hover:bg-blue-400 cursor-pointer">
                                  Edit
                                </button>
                                <button
                                  className="bg-red-500 text-white w-full font-semibold px-4 rounded hover:bg-red-400 cursor-pointer"
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