// ---------- Data ----------
let data = [
  {
    id: generateId(),
    num: "1",
    title: "Project Initiation",
    owner: "Rohit",
    progress: 100,
    plannedStart: "06/07/23",
    plannedDue: "06/20/23",
    plannedDuration: 14,
    actualStart: "03/20/23",
    actualDue: "03/20/23",
    actualDuration: 1,
    delay: 0,
    isCollapsed: false,
    subtasks: [
      {
        id: generateId(),
        num: "1.1",
        title: "Capture all the verticals and tasks in the project plan",
        owner: "Rohit",
        progress: 5,
        plannedStart: "06/07/23",
        plannedDue: "06/07/23",
        plannedDuration: 1,
        actualStart: "03/20/23",
        actualDue: "03/20/23",
        actualDuration: 1,
        delay: 0,
      },
      {
        id: generateId(),
        num: "1.2",
        title: "Assign due dates for all A4 tasks",
        owner: "Rohit",
        progress: 5,
        plannedStart: "06/07/23",
        plannedDue: "06/07/23",
        plannedDuration: 1,
        actualStart: "03/20/23",
        actualDue: "03/20/23",
        actualDuration: 1,
        delay: 0,
      },
    ],
  },
  {
    id: generateId(),
    num: "2",
    title: "Project Facility Readiness",
    owner: "Various",
    progress: 0,
    plannedStart: "06/15/23",
    plannedDue: "06/22/23",
    plannedDuration: 8,
    actualStart: "06/15/23",
    actualDue: "06/22/23",
    actualDuration: 8,
    delay: 0,
    isCollapsed: false,
    subtasks: [],
  },
];

// ---------- Utility ----------
function generateId() {
  return "_" + Math.random().toString(36).substr(2, 9);
}

function formatInputDate(dateStr) {
  if (!dateStr) return "";
  const parts = dateStr.split("/");
  if (parts.length !== 3) return "";
  let year = parts[2].length === 2 ? "20" + parts[2] : parts[2];
  let month = parts[0].padStart(2, "0");
  let day = parts[1].padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDisplayDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d)) return "";
  let m = d.getMonth() + 1;
  let day = d.getDate();
  let year = d.getFullYear() % 100;
  return `${m}/${day}/${year}`;
}

function daysDiff(startDate, endDate) {
  if (!startDate || !endDate) return 0;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diff = (end - start) / (1000 * 60 * 60 * 24) + 1;
  return diff < 0 ? 0 : Math.round(diff);
}

function recalcDurations(item) {
  item.plannedDuration = daysDiff(
    formatInputDate(item.plannedStart),
    formatInputDate(item.plannedDue)
  );
  item.actualDuration = daysDiff(
    formatInputDate(item.actualStart),
    formatInputDate(item.actualDue)
  );
  item.delay = Math.max(0, item.actualDuration - item.plannedDuration);
}

// ---------- Rendering ----------
function renderRow(item, level = 0) {
  const tr = document.createElement("tr");
  tr.dataset.id = item.id;
  tr.classList.add(level === 0 ? "task-group" : "subtask");

  const delayClass = item.delay > 0 ? "delay-positive" : "delay-zero";
  const progressPercent = Number(item.progress) || 0;
  const barWidth = Math.min(progressPercent, 100);

  const isGroupWithTasks =
    level === 0 && item.subtasks && item.subtasks.length > 0;
  const progressDisabled = isGroupWithTasks ? "disabled" : "";

  tr.innerHTML = `
      <td>
        ${
          level === 0 && item.subtasks.length > 0
            ? `<button class="toggle-btn" data-id="${item.id}">${
                item.isCollapsed ? "+" : "-"
              }</button>`
            : `<span style="display:inline-block;width:18px"></span>`
        }
        <input class="text-input" value="${item.num}" style="width:${
    level === 0 ? "50px" : "80px"
  }" data-prop="num" data-id="${item.id}" />
      </td>
      <td><textarea class="text-input" data-prop="title" data-id="${
        item.id
      }">${item.title}</textarea></td>
      <td><input class="text-input" value="${item.owner}" data-prop="owner" data-id="${item.id}" /></td>
      <td class="progress-cell">
        <input type="number" class="number-input" value="${progressPercent}" data-prop="progress" data-id="${item.id}" ${progressDisabled} />
        <div class="progress-bar"><div class="progress-bar-fill" style="width:${barWidth}%"></div></div>
      </td>
      <td><input type="date" value="${formatInputDate(
        item.plannedStart
      )}" data-prop="plannedStart" data-id="${item.id}" /></td>
      <td><input type="date" value="${formatInputDate(
        item.plannedDue
      )}" data-prop="plannedDue" data-id="${item.id}" /></td>
      <td><input class="number-input" value="${
        item.plannedDuration
      }" disabled /></td>
      <td><input type="date" value="${formatInputDate(
        item.actualStart
      )}" data-prop="actualStart" data-id="${item.id}" /></td>
      <td><input type="date" value="${formatInputDate(
        item.actualDue
      )}" data-prop="actualDue" data-id="${item.id}" /></td>
      <td><input class="number-input" value="${
        item.actualDuration
      }" disabled /></td>
      <td class="${delayClass}"><input class="number-input" value="${
    item.delay
  }" disabled /></td>
      <td>
        ${
          level === 0
            ? `<button class="add-subtask-btn" data-id="${item.id}">+ Subtask</button>`
            : ""
        }
        <button class="delete-btn" data-id="${item.id}">Delete</button>
      </td>`;
  return tr;
}

function renderTable() {
  const tbody = document.getElementById("tableBody");
  tbody.innerHTML = "";

  data.forEach((group) => {
    if (group.subtasks.length) {
      group.progress = Math.round(
        group.subtasks.reduce((a, b) => a + Number(b.progress), 0) /
          group.subtasks.length
      );
    }
    recalcDurations(group);
    tbody.appendChild(renderRow(group, 0));
    if (group.subtasks && !group.isCollapsed) {
      group.subtasks.forEach((task) => {
        recalcDurations(task);
        tbody.appendChild(renderRow(task, 1));
      });
