import { useEffect, useState } from "react";
import API from "./api";
import "./index.css";

export default function App() {

  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);


  /* =====================
     LOAD TASKS
  ====================== */

  const loadTasks = async () => {
    try {

      setLoading(true);

      const res = await API.get("/");
      setTasks(res.data);

    } catch (err) {

      if (err.response?.status === 429) {
        alert("Too many requests. Please wait.");
      } else {
        alert("Failed to load tasks");
      }

      console.error(err);

    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    loadTasks();
  }, []);


  /* =====================
     ADD TASK
  ====================== */

  const addTask = async () => {

    if (title.trim().length < 3) {
      alert("Title must be at least 3 characters");
      return;
    }

    try {

      setLoading(true);

      await API.post("/", { title });

      setTitle("");
      loadTasks();

    } catch (err) {

      alert("Failed to add task");
      console.error(err);

    } finally {
      setLoading(false);
    }
  };


  /* =====================
     CHANGE STATUS
  ====================== */

  const changeStatus = async (id, status) => {
    try {

      setLoading(true);

      await API.patch(`/${id}/status`, { status });

      loadTasks();

    } catch (err) {

      alert("Failed to update status");
      console.error(err);

    } finally {
      setLoading(false);
    }
  };


  /* =====================
     DELETE TASK
  ====================== */

  const deleteTask = async (id) => {

    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {

      setLoading(true);

      await API.delete(`/${id}`);

      loadTasks();

    } catch (err) {

      alert("Failed to delete task");
      console.error(err);

    } finally {
      setLoading(false);
    }
  };


  /* =====================
     UI
  ====================== */

  return (
    <div className="container">

      <h1>MERN Task Manager</h1>


      {/* INPUT BOX */}

      <div className="input-box">

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task..."
          disabled={loading}
        />

        <button onClick={addTask} disabled={loading}>
          {loading ? "Please wait..." : "Add"}
        </button>

      </div>


      {/* LOADING */}

      {loading ? (

        <div className="loader-container">

          <div className="spinner"></div>

          <p>Loading...</p>

        </div>

      ) : (

        /* TASK LIST */

        <div className="task-list">

          {tasks.length === 0 && (
            <p style={{ textAlign: "center" }}>No tasks found</p>
          )}

          {tasks.map((t) => (

            <div key={t._id} className="task-card">

              <h3>{t.title}</h3>

              <p>
                Status: <b>{t.status}</b>
              </p>


              {/* BUTTONS */}

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

      )}

    </div>
  );
}
