import { useEffect, useState } from "react";
import API from "./api";
import "./index.css";

export default function App() {

  /* =====================
     STATES
  ====================== */

  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  // Loading counter
  const [loadingCount, setLoadingCount] = useState(0);


  /* =====================
     LOADING HANDLERS
  ====================== */

  const startLoading = () => {
    setLoadingCount(c => c + 1);
  };

  const stopLoading = () => {
    setLoadingCount(c => Math.max(0, c - 1));
  };

  const loading = loadingCount > 0;


  /* =====================
     LOAD TASKS
  ====================== */

  const loadTasks = async () => {
    try {

      startLoading();

      const res = await API.get("/");
      setTasks(res.data);

    } catch (err) {

      alert("Failed to load tasks");
      console.error(err);

    } finally {
      stopLoading();
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

      startLoading();

      await API.post("/", { title });

      setTitle("");

      await loadTasks();

    } catch (err) {

      alert("Failed to add task");
      console.error(err);

    } finally {
      stopLoading();
    }
  };


  /* =====================
     CHANGE STATUS
  ====================== */

  const changeStatus = async (id, status) => {
    try {

      startLoading();

      await API.patch(`/${id}/status`, { status });

      await loadTasks();

    } catch (err) {

      alert("Failed to update status");
      console.error(err);

    } finally {
      stopLoading();
    }
  };


  /* =====================
     DELETE TASK
  ====================== */

  const deleteTask = async (id) => {

    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {

      startLoading();

      await API.delete(`/${id}`);

      await loadTasks();

    } catch (err) {

      alert("Failed to delete task");
      console.error(err);

    } finally {
      stopLoading();
    }
  };


  /* =====================
     UI
  ====================== */

  return (
    <div className="container">

      <h1>MERN Task Manager</h1>


      {/* INPUT SECTION */}

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


      {/* LOADER */}

      {loading && (
        <div className="loader-container">

          <div className="spinner"></div>

          <p>Loading...</p>

        </div>
      )}


      {/* TASK LIST */}

      {!loading && (

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


              <div className="btn-group">

                {t.status === "todo" && (
                  <>
                    <button
                      className="start"
                      onClick={() => changeStatus(t._id, "in_progress")}
                      disabled={loading}
                    >
                      Start
                    </button>

                    <button
                      className="done"
                      onClick={() => changeStatus(t._id, "done")}
                      disabled={loading}
                    >
                      Done
                    </button>
                  </>
                )}


                {t.status === "in_progress" && (
                  <button
                    className="done"
                    onClick={() => changeStatus(t._id, "done")}
                    disabled={loading}
                  >
                    Complete
                  </button>
                )}


                <button
                  className="delete"
                  onClick={() => deleteTask(t._id)}
                  disabled={loading}
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
