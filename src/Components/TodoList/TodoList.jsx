import { useState, useEffect } from "react";
import "./TodoList.css";

const TodoList = () => {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("todoTasks");
    return savedTasks ? JSON.parse(savedTasks) : []; 
  });
  const [inputValue, setInputValue] = useState("");
  const [editId, setEditId] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    localStorage.setItem("todoTasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleSubmit = () => {
    if (inputValue.trim() === "") return;

    if (editId !== null) {
      setTasks(
        tasks.map((task) =>
          task.id === editId ? { ...task, text: inputValue.trim() } : task
        )
      );
      setEditId(null);
    } else {
      const newTask = {
        id: Date.now(),
        text: inputValue.trim(),
        completed: false,
      };
      setTasks([...tasks, newTask]);
    }
    setInputValue("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  const handleEdit = (task) => {
    setEditId(task.id);
    setInputValue(task.text);
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setInputValue("");
  };

  const handleDelete = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
    if (editId === id) handleCancelEdit();
  };

  const handleToggle = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleClearCompleted = () => {
    setTasks(tasks.filter((task) => !task.completed));
    if (editId !== null && tasks.find((task) => task.id === editId)?.completed) {
      handleCancelEdit();
    }
  };

  const totalCount = tasks.length;
  const completedCount = tasks.filter((task) => task.completed).length;
  const pendingCount = totalCount - completedCount;
  const progressPercent =
    totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  const filteredTasks = tasks.filter((task) => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  const filterList = [
    { key: "all", label: "All", count: totalCount },
    { key: "active", label: "Pending", count: pendingCount },
    { key: "completed", label: "Completed", count: completedCount },
  ];

  return (
    <div className="TodoList-page">
      <header className="TodoList-header">
        <h1 className="TodoList-title">Todo List</h1>
        <p className="TodoList-subtitle">Stay organized and get things done</p>
      </header>

      <main className="TodoList-container">
        <section className="TodoList-stats">
          <div className="TodoList-statBox">
            <span className="TodoList-statNumber">{totalCount}</span>
            <span className="TodoList-statLabel">Total</span>
          </div>
          <div className="TodoList-statBox">
            <span className="TodoList-statNumber TodoList-statPending">
              {pendingCount}
            </span>
            <span className="TodoList-statLabel">Pending</span>
          </div>
          <div className="TodoList-statBox">
            <span className="TodoList-statNumber TodoList-statDone">
              {completedCount}
            </span>
            <span className="TodoList-statLabel">Completed</span>
          </div>
        </section>

        <div className="TodoList-progressWrap">
          <div className="TodoList-progressInfo">
            <span>Progress</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="TodoList-progressTrack">
            <div
              className="TodoList-progressBar"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        <div className="TodoList-inputBox">
          <input
            className="TodoList-input"
            type="text"
            placeholder={
              editId !== null ? "Update your task..." : "Add a new task..."
            }
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button className="TodoList-addButton" onClick={handleSubmit}>
            {editId !== null ? "Update" : "Add Task"}
          </button>
          {editId !== null && (
            <button className="TodoList-cancelButton" onClick={handleCancelEdit}>
              Cancel
            </button>
          )}
        </div>

        <nav className="TodoList-filters">
          {filterList.map((item) => (
            <button
              key={item.key}
              className={
                filter === item.key
                  ? "TodoList-filterButton TodoList-filterActive"
                  : "TodoList-filterButton"
              }
              onClick={() => setFilter(item.key)}
            >
              {item.label}
              <span className="TodoList-filterCount">{item.count}</span>
            </button>
          ))}
        </nav>

        {filteredTasks.length === 0 ? (
          <div className="TodoList-emptyBox">
            <p className="TodoList-emptyTitle">
              {totalCount === 0 ? "No tasks yet" : "Nothing to show here"}
            </p>
            <p className="TodoList-emptyText">
              {totalCount === 0
                ? "Add your first task using the box above."
                : "Try a different filter to see your tasks."}
            </p>
          </div>
        ) : (
          <ul className="TodoList-list">
            {filteredTasks.map((task) => (
              <li
                key={task.id}
                className={
                  editId === task.id
                    ? "TodoList-taskItem TodoList-taskEditing"
                    : "TodoList-taskItem"
                }
              >
                <div className="TodoList-taskInfo">
                  <span
                    className={
                      task.completed
                        ? "TodoList-taskText TodoList-taskCompleted"
                        : "TodoList-taskText"
                    }
                  >
                    {task.text}
                  </span>
                  <span
                    className={
                      task.completed
                        ? "TodoList-badge TodoList-badgeDone"
                        : "TodoList-badge TodoList-badgePending"
                    }
                  >
                    {task.completed ? "Completed" : "Pending"}
                  </span>
                </div>

                <div className="TodoList-actions">
                  <button
                    className={
                      task.completed
                        ? "TodoList-completeButton TodoList-undoButton"
                        : "TodoList-completeButton"
                    }
                    onClick={() => handleToggle(task.id)}
                  >
                    {task.completed ? "Undo" : "Complete"}
                  </button>
                  <button
                    className="TodoList-editButton"
                    onClick={() => handleEdit(task)}
                  >
                    Edit
                  </button>
                  <button
                    className="TodoList-deleteButton"
                    onClick={() => handleDelete(task.id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {totalCount > 0 && (
          <footer className="TodoList-footer">
            <span className="TodoList-footerText">
              {pendingCount} {pendingCount === 1 ? "task" : "tasks"} left
            </span>
            {completedCount > 0 && (
              <button
                className="TodoList-clearButton"
                onClick={handleClearCompleted}
              >
                Clear completed
              </button>
            )}
          </footer>
        )}
      </main>
    </div>
  );
};

export default TodoList;