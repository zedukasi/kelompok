let students = [];
let groupsCount = 3; // jumlah kelompok default
const studentList = document.getElementById("studentList");
const groupsContainer = document.getElementById("groupsContainer");
const groupCountInput = document.getElementById("groupCount");

// Upload file .txt
document.getElementById("fileInput").addEventListener("change", function(e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      students = e.target.result.split("\n").map(s => s.trim()).filter(s => s);
      renderStudentList();
      groupsCount = parseInt(groupCountInput.value) || 3;
      createGroups(groupsCount);
    };
    reader.readAsText(file);
  }
});

// Tampilkan daftar siswa
function renderStudentList() {
  studentList.innerHTML = "";
  students.forEach((student, index) => {
    const li = document.createElement("li");
    li.textContent = student;
    li.className = "list-group-item draggable";
    li.draggable = true;
    li.dataset.index = index;

    // event drag
    li.addEventListener("dragstart", dragStart);
    studentList.appendChild(li);
  });
}

// Buat kolom kelompok
function createGroups(count) {
  groupsContainer.innerHTML = "";
  for (let i = 1; i <= count; i++) {
    const group = document.createElement("div");
    group.className = "border rounded p-2 bg-white flex-fill min-vh-50";
    group.innerHTML = `<h6>Kelompok ${i}</h6><ul class="list-group dropzone" data-group="${i}"></ul>`;
    groupsContainer.appendChild(group);
  }

  // event drop
  document.querySelectorAll(".dropzone").forEach(zone => {
    zone.addEventListener("dragover", dragOver);
    zone.addEventListener("drop", dropStudent);
  });
}

// Drag & Drop Functions
function dragStart(e) {
  e.dataTransfer.setData("text/plain", e.target.dataset.index);
}
function dragOver(e) {
  e.preventDefault();
}
function dropStudent(e) {
  e.preventDefault();
  const index = e.dataTransfer.getData("text/plain");
  if (index === "") return;

  const studentName = students[index];

  // Tambahkan ke kelompok
  const li = document.createElement("li");
  li.textContent = studentName;
  li.className = "list-group-item";
  e.target.appendChild(li);

  // Hapus dari daftar siswa
  const studentItem = studentList.querySelector(`[data-index='${index}']`);
  if (studentItem) {
    studentItem.remove();
  }
}

// Bagi otomatis
document.getElementById("btnAuto").addEventListener("click", function() {
  if (students.length === 0) return;
  groupsCount = parseInt(groupCountInput.value) || 3;
  createGroups(groupsCount);

  let shuffled = [...students].sort(() => 0.5 - Math.random());
  shuffled.forEach((student, i) => {
    let groupIndex = i % groupsCount;
    let zone = groupsContainer.querySelectorAll(".dropzone")[groupIndex];
    const li = document.createElement("li");
    li.textContent = student;
    li.className = "list-group-item";
    zone.appendChild(li);
  });

  // Kosongkan daftar siswa (karena semua sudah dibagi)
  studentList.innerHTML = "";
});

// Reset Data
document.getElementById("btnReset").addEventListener("click", function() {
  students = [];
  studentList.innerHTML = "";
  groupsContainer.innerHTML = "";
  document.getElementById("fileInput").value = "";
  groupCountInput.value = 3;
});
