import { useEffect, useState } from "react";
import API from "./api";
import "./index.css";

export default function App() {

  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  const loadTasks = async () => {
    const res = await API.get("/");
    setTasks(res.data);
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const addTask = async () => {

    if (title.trim().length < 3) {
      alert("Title must be at least 3 characters");
      return;
    }

    await API.post("/", { title });
    setTitle("");
    loadTasks();
  };

  const changeStatus = async (id, status) => {
    await API.patch(`/${id}/status`, { status });
    loadTasks();
  };

  const deleteTask = async (id) => {

    const confirm = window.confirm("Are you sure you want to delete this task?");

    if (!confirm) return;

    try {
      await API.delete(`/${id}`);
      loadTasks();

    } catch (err) {
      alert("Failed to delete task");
      console.error(err);
    }
  };


  return (
    <div className="container">

      <h1>Mini Task Manager (Vite + MERN)</h1>

      <div className="input-box">

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task..."
        />

        <button onClick={addTask}>Add</button>

      </div>

      <div className="task-list">

        {tasks.map((t) => (

          <div key={t._id} className="task-card">

            <h3>{t.title}</h3>

            <p>Status: <b>{t.status}</b></p>

            <div className="btn-group">

              {t.status === "todo" && (
                <>
                  <button
                    className="start"
                    onClick={() => changeStatus(t._id, "in_progress")}
                  >
                    Start
                  </button>

                  <button
                    className="done"
                    onClick={() => changeStatus(t._id, "done")}
                  >
                    Done
                  </button>
                </>
              )}

              {t.status === "in_progress" && (
                <button
                  className="done"
                  onClick={() => changeStatus(t._id, "done")}
                >
                  Complete
                </button>
              )}

              {/* DELETE BUTTON */}
              <button
                className="delete"
                onClick={() => deleteTask(t._id)}
              >
                Delete
              </button>

            </div>
          </div>
        ))}

      </div>

    </div>
  );
}
