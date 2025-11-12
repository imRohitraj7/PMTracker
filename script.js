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
        progress: 50, // Changed for demo
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
        progress: 50, // Changed for demo
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

  // Use progress value for text, but cap the visual bar at 100%
  const progressPercent = Number(item.progress) || 0;
  const barWidth = Math.min(progressPercent, 100);

  // **** CHANGE: Check if this is a group with subtasks ****
  const isGroupWithTasks =
    level === 0 && item.subtasks && item.subtasks.length > 0;
  const progressDisabled = isGroupWithTasks ? "disabled" : "";

  tr.innerHTML = `
      <td><input class="text-input" value="${
        item.num
      }" style="width: 80px; font-weight:bold;" data-prop="num" data-id="${
    item.id
  }" /></td>
      
      <td><textarea class="text-input" style="${indentStyle}" data-prop="title" data-id="${
    item.id
  }">${item.title}</textarea></td>
      
      <td><input class="text-input" value="${
        item.owner
      }" data-prop="owner" data-id="${item.id}" /></td>
      
      <td class="progress-cell">
        <input type="number" class="number-input" value="${progressPercent}" data-prop="progress" data-id="${
    item.id
  }" ${progressDisabled} />
        <div class="progress-bar" aria-hidden="true" title="${progressPercent}%">
          <div class="progress-bar-fill" style="width: ${barWidth}%;"></div>
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

  // **** CHANGE: Recalculate all group progress *before* rendering ****
  data.forEach((group) => {
    if (group.subtasks && group.subtasks.length > 0) {
      let total = 0;
      group.subtasks.forEach((task) => {
        total += Number(task.progress);
      });
      group.progress = Math.round(total / group.subtasks.length);
    }
  });
  // **** END OF CHANGE ****

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

// **** CHANGE: Updated logic to average groups ****
function updateOverallProgress() {
  if (data.length === 0) {
    document.getElementById("overallProgressFill").style.width = "0%";
    document.getElementById("overallProgressLabel").textContent = "0%";
    return;
  }

  let totalProgress = 0;
  data.forEach((group) => {
    totalProgress += Number(group.progress);
  });

  const overallPercent = Math.round(totalProgress / data.length);

  // Cap the visual bar at 100%
  const barWidth = Math.min(overallPercent, 100);

  document.getElementById("overallProgressFill").style.width = barWidth + "%";
  document.getElementById("overallProgressLabel").textContent =
    overallPercent + "%";
}
// **** END OF CHANGE ****

// Event delegation for edits and buttons
document.getElementById("tableBody").addEventListener("input", (e) => {
  const el = e.target;
  const id = el.dataset.id;
  const prop = el.dataset.prop;
  if (!id || !prop) return;
  const found = findById(id);
  if (!found) return;

  if (prop === "progress") {
    let val = el.value; // Get raw value
    let numVal = Number(val);
    if (val === "") numVal = 0; // Treat empty string as 0
    if (isNaN(numVal)) numVal = found.obj[prop] || 0; // Keep old value if invalid
    if (numVal < 0) numVal = 0;

    found.obj[prop] = numVal; // Update data

    // Update visual bar
    const barEl = el.closest("td").querySelector(".progress-bar-fill");
    if (barEl) {
      const barWidth = Math.min(numVal, 100);
      barEl.style.width = barWidth + "%";
      barEl.closest(".progress-bar").title = numVal + "%";
    }

    // **** CHANGE: Recalculate parent group if this is a subtask ****
    if (found.parent) {
      let group = found.parent;
      if (group.subtasks.length > 0) {
        let total = 0;
        group.subtasks.forEach((task) => {
          total += Number(task.progress);
        });
        let avg = Math.round(total / group.subtasks.length);
        group.progress = avg; // Update data model

        // Update the parent group's UI
        const groupRow = document.querySelector(`tr[data-id="${group.id}"]`);
        if (groupRow) {
          const groupInput = groupRow.querySelector(
            '.number-input[data-prop="progress"]'
          );
          const groupBarFill = groupRow.querySelector(".progress-bar-fill");
          const groupBar = groupRow.querySelector(".progress-bar");

          if (groupInput) groupInput.value = avg;
          if (groupBar) groupBar.title = avg + "%";
          if (groupBarFill) groupBarFill.style.width = Math.min(avg, 100) + "%";
        }
      }
    }
    // **** END OF CHANGE ****

    updateOverallProgress(); // Update overall bar
  } else {
    // This is for all other fields
    let val = el.value.trim();

    if (
      prop === "plannedStart" ||
      prop === "plannedDue" ||
      prop === "actualStart" ||
      prop === "actualDue"
    ) {
      val = formatDisplayDate(val);
    }

    found.obj[prop] = val; // Update data

    if (
      ["plannedStart", "plannedDue", "actualStart", "actualDue"].includes(prop)
    ) {
      recalcDurations(found.obj);
    }

    if (prop !== "title") {
      renderTable(); // Re-render table
    }
  }
});

// Separate blur event to handle re-rendering after text edit
document.getElementById("tableBody").addEventListener("change", (e) => {
  const el = e.target;
  const prop = el.dataset.prop;

  // If a date was changed, the 'input' event already handled it
  if (
    ["plannedStart", "plannedDue", "actualStart", "actualDue"].includes(prop)
  ) {
    recalcDurations(findById(el.dataset.id).obj);
    renderTable();
  }
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
    let subTaskNum = getNextSubtaskNumber(group);

    // Add subtask with default values
    group.subtasks.push({
      id: generateId(),
      num: subTaskNum,
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
      if (!isNaN(remainder) && remainder !== "") {
        let n = parseInt(remainder);
        if (n > maxN) maxN = n;
      } else {
        suffixes.push(remainder);
      }
    }
  });

  // If numeric subtask numbers, increment maxN
  if (maxN > 0) return `${group.num}.${maxN + 1}`;

  // If only non-numeric suffixes or no suffixes, start with .1
  if (suffixes.length === 0 && maxN === 0) return group.num + ".1";

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
