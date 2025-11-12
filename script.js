// Data array holding project groups and subtasks
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
    subtasks: [
      {
        id: generateId(),
        num: "1.1",
        title: "Capture all the verticals and tasks in the project plan",
        owner: "Rohit",
        progress: 100,
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
        progress: 100,
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
    progress: 100,
    plannedStart: "06/15/23",
    plannedDue: "06/22/23",
    plannedDuration: 8,
    actualStart: "06/15/23",
    actualDue: "06/22/23",
    actualDuration: 8,
    delay: 0,
    subtasks: [],
  },
];

function generateId() {
  return "_" + Math.random().toString(36).substr(2, 9);
}

// Convert M/D/YY to YYYY-MM-DD for input[type=date]
function formatInputDate(dateStr) {
  if (!dateStr) return "";
  const parts = dateStr.split("/");
  if (parts.length !== 3) return "";
  let year = parts[2].length === 2 ? "20" + parts[2] : parts[2];
  let month = parts[0].padStart(2, "0");
  let day = parts[1].padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Convert YYYY-MM-DD from input to M/D/YY format
function formatDisplayDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d)) return "";
  let m = d.getMonth() + 1;
  let day = d.getDate();
  let year = d.getFullYear() % 100;
  return `${m}/${day}/${year}`;
}

// Calculate days difference inclusive
function daysDiff(startDate, endDate) {
  if (!startDate || !endDate) return 0;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const msPerDay = 1000 * 60 * 60 * 24;
  const diff = (end.getTime() - start.getTime()) / msPerDay + 1;
  return diff < 0 ? 0 : Math.round(diff);
}

// Update durations/delay for a project or task object
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

// Render one row: for project group or task
// level = 0 for group, 1 for subtask, 2 for deeper subtasks (not used here but reserved)
function renderRow(item, level = 0, parentIndex = null) {
  const tr = document.createElement("tr");
  tr.dataset.id = item.id;
  tr.classList.add(level === 0 ? "task-group" : "subtask");
  if (level > 1) tr.classList.add("subsubtask");

  const indentStyle =
    level === 0
      ? ""
      : level === 1
      ? "padding-left:15px;"
      : "padding-left:35px;";

  const delayClass = item.delay > 0 ? "delay-positive" : "delay-zero";

  tr.innerHTML = `
      <td><input class="text-input" value="${
        item.num
      }" style="width: 80px; font-weight:bold;" data-prop="num" data-id="${
    item.id
  }" /></td>
      <td><input class="text-input" value="${
        item.title
      }" style="${indentStyle}" data-prop="title" data-id="${item.id}" /></td>
      <td><input class="text-input" value="${
        item.owner
      }" data-prop="owner" data-id="${item.id}" /></td>
      <td class="progress-cell">
        <input type="number" class="number-input" value="${
          item.progress
        }" data-prop="progress" data-id="${item.id}" />
        <div class="progress-bar" aria-hidden="true" title="${item.progress}%">
          <div class="progress-bar-fill" style="width: ${item.progress}%;"></div>
        </div>
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
      </td>
    `;

  return tr;
}

// Render full table body
function renderTable() {
  const tbody = document.getElementById("tableBody");
  tbody.innerHTML = "";

  data.forEach((group) => {
    recalcDurations(group);
    // Render group row
    tbody.appendChild(renderRow(group, 0));

    // Render subtasks
    if (group.subtasks) {
      group.subtasks.forEach((task) => {
        recalcDurations(task);
        tbody.appendChild(renderRow(task, 1, group.id));
      });
    }
  });
  updateOverallProgress();
}

// Find object in data by id
function findById(id) {
  for (const group of data) {
    if (group.id === id) return { obj: group, parent: null };
    if (group.subtasks) {
      for (const task of group.subtasks) {
        if (task.id === id) return { obj: task, parent: group };
      }
    }
  }
  return null;
}

// Update overall progress (average of all subtasks)
function updateOverallProgress() {
  let totalProgress = 0;
  let count = 0;
  data.forEach((group) => {
    group.subtasks.forEach((task) => {
      totalProgress += Number(task.progress);
      count++;
    });
  });
  const overallPercent = count ? Math.round(totalProgress / count) : 0;
  document.getElementById("overallProgressFill").style.width =
    overallPercent + "%";
  document.getElementById("overallProgressLabel").textContent =
    overallPercent + "%";
}

// Event delegation for edits and buttons
document.getElementById("tableBody").addEventListener("input", (e) => {
  const el = e.target;
  const id = el.dataset.id;
  const prop = el.dataset.prop;
  if (!id || !prop) return;
  const found = findById(id);
  if (!found) return;

  let val = el.value.trim();

  // Validation and type conversion for specific props
  if (prop === "progress") {
    val = Number(val);
    // CHANGE 3.2: Removed the validation that capped the value at 100
    // if (val < 0) val = 0;
    // else if (val > 100) val = 100;
    el.value = val;
  }

  if (
    prop === "plannedStart" ||
    prop === "plannedDue" ||
    prop === "actualStart" ||
    prop === "actualDue"
  ) {
    // Dates as M/D/YY format internally
    val = formatDisplayDate(val);
  }

  found.obj[prop] = val;

  // Recalculate durations and delay if dates changed
  if (
    ["plannedStart", "plannedDue", "actualStart", "actualDue"].includes(prop)
  ) {
    recalcDurations(found.obj);
  }

  renderTable();
});

document.getElementById("tableBody").addEventListener("click", (e) => {
  const btn = e.target;
  if (btn.classList.contains("delete-btn")) {
    const id = btn.dataset.id;
    const found = findById(id);
    if (!found) return;
    if (!found.parent) {
      // Delete whole project group
      if (
        confirm(
          `Delete project group "${found.obj.title}" and all its subtasks?`
        )
      ) {
        data = data.filter((g) => g.id !== id);
        renderTable();
      }
    } else {
      if (confirm(`Delete task "${found.obj.title}"?`)) {
        found.parent.subtasks = found.parent.subtasks.filter(
          (t) => t.id !== id
        );
        renderTable();
      }
    }
  } else if (btn.classList.contains("add-subtask-btn")) {
    const groupId = btn.dataset.id;
    const group = data.find((g) => g.id === groupId);
    if (!group) return;

    // Generate new subtask number
    let subtaskNum = getNextSubtaskNumber(group);

    // Add subtask with default values
    group.subtasks.push({
      id: generateId(),
      num: subtaskNum,
      title: "New Subtask",
      owner: "",
      progress: 0,
      plannedStart: "",
      plannedDue: "",
      plannedDuration: 0,
      actualStart: "",
      actualDue: "",
      actualDuration: 0,
      delay: 0,
    });
    renderTable();
  }
});

// Add new project group button
function addProjectGroup() {
  // Generate next project group number based on current max
  let nextNum = getNextGroupNumber();

  let newGroup = {
    id: generateId(),
    num: nextNum,
    title: "New Project Group",
    owner: "",
    progress: 0,
    plannedStart: "",
    plannedDue: "",
    plannedDuration: 0,
    actualStart: "",
    actualDue: "",
    actualDuration: 0,
    delay: 0,
    subtasks: [],
  };
  data.push(newGroup);
  renderTable();
}

// Calculate next project group number as max existing + 1
function getNextGroupNumber() {
  let nums = data.map((g) => Number(g.num));
  let max = nums.length ? Math.max(...nums) : 0;
  return (max + 1).toString();
}

// Calculate next subtask number in format "X.Y" or "X.Ya" etc.
function getNextSubtaskNumber(group) {
  if (!group.subtasks.length) return group.num + ".1";

  // Find max numeric or alphabetical suffix
  let maxN = 0;
  let suffixes = [];

  group.subtasks.forEach((t) => {
    let subNum = t.num.trim();
    if (subNum.startsWith(group.num + ".")) {
      let remainder = subNum.substring(group.num.length + 1);
      // Check if numeric or letter suffix
      if (!isNaN(remainder)) {
        let n = parseInt(remainder);
        if (n > maxN) maxN = n;
      } else {
        suffixes.push(remainder);
      }
    }
  });

  // If numeric subtask numbers, increment maxN
  if (maxN > 0) return `${group.num}.${maxN + 1}`;

  // Otherwise try alphabetic suffix (a,b,c,...)
  if (suffixes.length === 0) return group.num + ".a";

  // Find next letter suffix from existing
  suffixes.sort();
  let lastSuffix = suffixes[suffixes.length - 1];
  if (!lastSuffix) return group.num + ".a";
  let lastChar = lastSuffix.charCodeAt(lastSuffix.length - 1);
  if (lastChar < 97) lastChar = 97; // forcing 'a' ascii start

  let nextChar = String.fromCharCode(lastChar + 1);
  return group.num + "." + nextChar;
}

// Initial render
renderTable();
