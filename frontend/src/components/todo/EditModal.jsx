import { useState, useEffect } from "react";


export default function EditTodoModal({ todo, onClose, onSave }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    if (todo) {
      setTitle(todo.title);
      setDescription(todo.description);
    }
  }, [todo]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const modalData = {
        title: title,
        description: description,
    }
    try{
        await onSave(todo.id, modalData);
        onClose();  
    }catch(err){
        setError(err)
    }

  };

  if (!todo) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
        <div className="bg-white p-4 rounded w-100">
            <h2 className="font-semibold mb-2">Edit Todo</h2>

            {error?.general && <p className="text-red-500">{error.general}</p>}

            <form onSubmit={handleSubmit}>
            <label>Title</label>
            <input
                className="border w-full mb-2 p-1"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            {error?.title && <p className="text-red-500">Title field should not be blank.</p>}
            <label>Description</label>
            <input
                className="border w-full mb-2 p-1"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />

            <div className="flex justify-end gap-2">
                <button type="button" onClick={onClose}
                    className="bg-gray-100 rounded px-3 hover:bg-gray-200 hover:cursor-pointer">
                Cancel
                </button>
                <button className="bg-blue-500 hover:bg-blue-600 hover:cursor-pointer text-white px-3 rounded">
                Save
                </button>
            </div>
            </form>
        </div>
        </div>
  );
}