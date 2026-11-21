const todoForm = document.getElementById("todoForm");
const taskInput = document.getElementById("taskInput");
const formError = document.getElementById("formError");
const todoList = document.getElementById("todoList");
const taskCounter = document.getElementById("taskCounter");
const emptyState = document.getElementById("emptyState");
const filterButtons = document.querySelectorAll(".filter-btn");
const clearCompletedBtn = document.getElementById("clearCompletedBtn");

const STORAGE_KEY = "vinix_mobile_todos_v1";
let todos = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
let activeFilter = "all";

function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function getFilteredTodos() {
  if (activeFilter === "active") {
    return todos.filter((item) => !item.completed);
  }
  if (activeFilter === "completed") {
    return todos.filter((item) => item.completed);
  }
  return todos;
}

function updateCounter() {
  const remaining = todos.filter((item) => !item.completed).length;
  taskCounter.textContent = `${remaining} ${remaining === 1 ? "task" : "tasks"} remaining`;
}

function renderTodos() {
  const filtered = getFilteredTodos();
  todoList.innerHTML = "";

  if (filtered.length === 0) {
    emptyState.hidden = false;
  } else {
    emptyState.hidden = true;
    filtered.forEach((item) => {
      const li = document.createElement("li");
      li.className = `todo-item ${item.completed ? "completed" : ""}`;

      const leftDiv = document.createElement("div");
      leftDiv.className = "todo-left";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.className = "todo-checkbox";
      checkbox.checked = item.completed;
      checkbox.setAttribute("aria-label", `Mark "${item.title}" as completed`);
      checkbox.addEventListener("change", () => toggleTodo(item.id));

      const titleSpan = document.createElement("span");
      titleSpan.className = "todo-title";
      titleSpan.textContent = item.title;

      leftDiv.appendChild(checkbox);
      leftDiv.appendChild(titleSpan);

      const deleteBtn = document.createElement("button");
      deleteBtn.type = "button";
      deleteBtn.className = "delete-btn";
      deleteBtn.textContent = "Delete";
      deleteBtn.setAttribute("aria-label", `Delete "${item.title}"`);
      deleteBtn.addEventListener("click", () => deleteTodo(item.id));

      li.appendChild(leftDiv);
      li.appendChild(deleteBtn);
      todoList.appendChild(li);
    });
  }

  updateCounter();
}

function addTodo(title) {
  todos.unshift({
    id: Date.now().toString(),
    title,
    completed: false
  });
  saveTodos();
  renderTodos();
}

function toggleTodo(id) {
  todos = todos.map((item) =>
    item.id === id ? { ...item, completed: !item.completed } : item
  );
  saveTodos();
  renderTodos();
}

function deleteTodo(id) {
  todos = todos.filter((item) => item.id !== id);
  saveTodos();
  renderTodos();
}

todoForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = taskInput.value.trim();

  if (!text) {
    formError.textContent = "Please enter a task before adding.";
    taskInput.focus();
    return;
  }

  formError.textContent = "";
  addTodo(text);
  taskInput.value = "";
  taskInput.focus();
});

taskInput.addEventListener("input", () => {
  if (formError.textContent) {
    formError.textContent = "";
  }
});

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    activeFilter = btn.dataset.filter;
    renderTodos();
  });
});

clearCompletedBtn.addEventListener("click", () => {
  todos = todos.filter((item) => !item.completed);
  saveTodos();
  renderTodos();
});

renderTodos();
    
