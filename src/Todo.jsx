import React, { useRef, useState, useEffect } from 'react';

const Todo = () => {
  const inputRef = useRef();
  const [taskName, setTaskName] = useState('');
  const [tasks, setTasks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 5;

  useEffect(() => {
    const storedTasks = localStorage.getItem('todo-tasks');
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('todo-tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleAdd = () => {
    const name = taskName.trim();
    if (!name) return;

    const dateTime = new Date().toLocaleString();
    const newTask = {
      id: Date.now(),
      text: name,
      done: false,
      time: dateTime,
    };

    setTasks([newTask, ...tasks]); 
    setTaskName('');
    inputRef.current.focus();
  };

  const handleToggle = (id) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  const handleDelete = (id) => {
    const updated = tasks.filter((t) => t.id !== id);
    setTasks(updated);

    const newTotalPages = Math.ceil(updated.length / tasksPerPage);
    if (currentPage > newTotalPages) {
      setCurrentPage(newTotalPages || 1);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleAdd();
    }
  };

  
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = tasks.slice(indexOfFirstTask, indexOfLastTask);
  const totalPages = Math.ceil(tasks.length / tasksPerPage);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-3xl">
        <h1 className="text-2xl font-bold mb-4 text-center">To‑Do List</h1>

        <div className="flex gap-2 mb-4">
          <input
            ref={inputRef}
            type="text"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Enter a task"
            className="border p-2 flex-grow rounded"
          />
          <button
            onClick={handleAdd}
            className="bg-lime-600 text-white px-4 py-2 rounded"
          >
            Add
          </button>
        </div>

        <table className="table-auto w-full border border-gray-300 mb-4 text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="border px-4 py-2">Task</th>
              <th className="border px-4 py-2">Time</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentTasks.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-500">
                  No tasks available.
                </td>
              </tr>
            ) : (
              currentTasks.map((task) => (
                <tr key={task.id} className="text-center">
                  <td className={`border px-4 py-2 ${task.done ? 'line-through text-gray-400' : ''}`}>
                    {task.text}
                  </td>
                  <td className="border px-4 py-2 text-gray-500">{task.time}</td>
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => handleToggle(task.id)}
                      className={`px-3 py-1 rounded text-white ${task.done ? 'bg-green-600' : 'bg-yellow-500'}`}
                    >
                      {task.done ? 'Done' : 'Pending'}
                    </button>
                  </td>
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => handleDelete(task.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {tasks.length > tasksPerPage && (
          <div className="flex justify-between items-center mt-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="bg-gray-200 text-gray-600 px-4 py-2 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-gray-600">Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage >= totalPages}
              className="bg-gray-200 text-gray-600 px-4 py-2 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Todo;
