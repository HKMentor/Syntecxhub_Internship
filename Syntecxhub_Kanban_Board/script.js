let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentStatus = "";
let editingId = null;
let modal = new bootstrap.Modal(document.getElementById("taskModal"));

const taskTitle = document.getElementById("taskTitle");
const taskDate = document.getElementById("taskDate");
const taskPriority = document.getElementById("taskPriority");
const searchInput = document.getElementById("searchInput");
const priorityFilter = document.getElementById("priorityFilter");
const modalTitle = document.getElementById("modalTitle");

const countTodo = document.getElementById("count-todo");
const countDoing = document.getElementById("count-doing");
const countDone = document.getElementById("count-done");

/* THEME */
function toggleMode(){
  document.body.classList.toggle("light-mode");
  localStorage.setItem("mode",
    document.body.classList.contains("light-mode") ? "light" : "dark"
  );
}
(function(){ if(localStorage.getItem("mode")==="light"){ document.body.classList.add("light-mode"); } })();

/* MODAL */
function openModal(status,id=null){
  currentStatus = status;
  editingId = id;

  if(id){
    const t = tasks.find(t=>t.id===id);
    taskTitle.value = t.title;
    taskDate.value = t.date;
    taskPriority.value = t.priority;
    modalTitle.textContent = "Edit Task";
  }else{
    taskTitle.value = "";
    taskDate.value = "";
    taskPriority.value = "medium";
    modalTitle.textContent = "Add Task";
  }

  modal.show();
}

/* SAVE TASK */
document.getElementById("saveBtn").addEventListener("click", ()=>{
  if(!taskTitle.value.trim()) return alert("Task title required");

  if(editingId){ // edit mode
    const t = tasks.find(t=>t.id===editingId);
    t.title = taskTitle.value;
    t.date = taskDate.value;
    t.priority = taskPriority.value;
    editingId = null;
  }else{ // add mode
    tasks.push({
      id: Date.now(),
      title: taskTitle.value,
      date: taskDate.value,
      priority: taskPriority.value,
      status: currentStatus
    });
  }

  localStorage.setItem("tasks", JSON.stringify(tasks));
  modal.hide();
  render();
});

/* DELETE */
function removeTask(id){
  if(confirm("Delete this task?")){
    tasks = tasks.filter(t => t.id !== id);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    render();
  }
}

/* RENDER */
function render(){
  ["todo","doing","done"].forEach(id=>{
    document.getElementById(id).innerHTML="";
    // Add progress bar at top
    let colTasks = tasks.filter(t=>t.status===id);
    let doneCount = colTasks.filter(t=>t.status==='done').length;
    let progress = id==='done' ? 100 : colTasks.length===0?0: Math.round((doneCount/colTasks.length)*100);
    document.getElementById(id).innerHTML = `<div class="progress mb-2" style="height:6px;">
      <div class="progress-bar" role="progressbar" style="width:${progress}%"></div>
    </div>`;
  });

  const search = searchInput.value.toLowerCase();
  const filter = priorityFilter.value;

  let counts = { todo:0, doing:0, done:0 };

  tasks
    .filter(t=>t.title.toLowerCase().includes(search) && (!filter || t.priority===filter))
    .forEach(t=>{
      counts[t.status]++;

      const div = document.createElement("div");
      div.className = `task priority-${t.priority}`;
      div.draggable = true;

      let dueClass = "";
      if(t.date){
        const today = new Date().toISOString().split("T")[0];
        if(t.date<today) dueClass="due-past";
        else if(t.date===today) dueClass="due-today";
        else dueClass="due-future";
      }

      // Reminder notification alert if task is due today
      if(t.date===new Date().toISOString().split("T")[0]){
        div.style.border = "2px solid orange";
      }

      div.innerHTML = `
        <strong>${t.title}</strong>
        <small class="${dueClass}">${t.date||""}</small>
        <div class="d-flex justify-content-between mt-2">
          <span class="badge bg-secondary">${t.priority}</span>
          <div>
            <i class="bi bi-pencil-square text-info me-2" onclick="openModal('${t.status}',${t.id})"></i>
            <i class="bi bi-trash text-danger" onclick="removeTask(${t.id})"></i>
          </div>
        </div>
      `;

      div.addEventListener("dragstart", e=>{
        e.dataTransfer.setData("id", t.id);
      });

      document.getElementById(t.status).appendChild(div);
    });

  countTodo.textContent = counts.todo;
  countDoing.textContent = counts.doing;
  countDone.textContent = counts.done;
}

/* DRAG & DROP */
document.querySelectorAll(".task-list").forEach(col=>{
  col.addEventListener("dragover", e=>{
    e.preventDefault();
    col.classList.add("drag-over");
  });
  col.addEventListener("dragleave", ()=>col.classList.remove("drag-over"));
  col.addEventListener("drop", e=>{
    e.preventDefault();
    col.classList.remove("drag-over");
    const id = Number(e.dataTransfer.getData("id"));
    const task = tasks.find(t=>t.id===id);
    if(task){ task.status = col.id; localStorage.setItem("tasks", JSON.stringify(tasks)); render(); }
  });
});

/* SEARCH & FILTER */
searchInput.addEventListener("input", render);
priorityFilter.addEventListener("change", render);

render();
