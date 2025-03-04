let taskList = document.getElementById("task-list");
function getNameFromAuth() {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      currentUser = db.collection("users").doc(user.uid);
      console.log(user.uid);
      console.log(user.displayName);

      //READ reads the user name from which the user is logged in---------------------N2
      currentUser.get().then((user) => {
        userName = user.data().name;
        console.log(userName);
        document.getElementById("name-goes-here").innerText = userName;
      });
    } else {
      console.log("No user is logged in");
    }
  });
}
//--------------------------------------------------------------------------------------

getNameFromAuth();

function setupChat() {
  document
    .getElementById("chat-form")
    .addEventListener("submit", async (event) => {
      event.preventDefault();
      const chatInputElement = document.getElementById("chat-input");
      const chatInput = chatInputElement.value;
      const chatDisplay = document.getElementById("chat-display");
      // CREATE  - creates a server stamp to order information------------------------N1
      try {
        await db.collection("messages").add({
          text: chatInput,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          name: firebase.auth().currentUser.displayName,
        });
        chatInputElement.value = "";
      } catch (error) {}
    });
  //--------------------------------------------------------------------------------

  const chatDisplay = document.getElementById("chat-display");
  db.collection("messages")
    .orderBy("createdAt")
    .onSnapshot((snapshot) => {
      chatDisplay.innerHTML = "";
      snapshot.forEach((doc) => {
        const messageData = doc.data();
        const messageElement = document.createElement("div");
        username = messageData.name;
        messageElement.textContent = messageData.text;
        messageElement.textContent += ` - ${username}`;
        chatDisplay.appendChild(messageElement);
      });
    });
}

function setupTasks() {
  document.querySelector("form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const task = document.getElementById("task").value;
    const dueDate = document.getElementById("due-date").value;
    const description = document.getElementById("description").value;
    const priority = document.getElementById("priorityDropdown").value
    try {
      await db.collection("tasks").add({
        task: task,
        dueDate: dueDate,
        description: description,
        priority: priority,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        name: firebase.auth().currentUser.displayName,
      });
    } catch (error) {}
    displayTask();
  });
}

function displayTask() {
  const taskList = document.getElementById("task-list");
  db.collection("tasks")
    .orderBy("createdAt", "desc")
    .onSnapshot((snapshot) => {
      taskList.innerHTML = "";
      snapshot.docs.forEach((doc) => {
        const taskData = doc.data();
        const taskElement = document.createElement("div");
        taskElement.classList.add("group-task-card");
        taskElement.innerHTML = `
          <h3>${taskData.task}</h3>
          <h4 class="my-task-priority">${taskData.priority}<img src="./assets/SVG/flag-${taskData.priority}.svg" class="priority-flag"></h4>
          <p>Due: ${taskData.dueDate}</p>
          <p class="text-sm">${taskData.description}</p>
          <div id="group-task-card-btns">
            <button class="red-btn delete-btn" data-id="${doc.id}">Delete</button>
            <a href="view-task.html?docID=${doc.id}">
              <button class="green-btn">View</button>
            </a>
          </div>
            `;
        taskList.appendChild(taskElement);
      });
    });
}

taskList.addEventListener("click", async (event) => {
  if (event.target.classList.contains("delete-btn")) {
    const taskId = event.target.getAttribute("data-id");

    //DELETE upon a click of the delete button it access the document id 'tasks' and removes it form the html and database ----------------N3
    try {
      await db.collection("tasks").doc(taskId).delete();
      displayTask();
    } catch (error) {}
  }
});
//----------------------------------------------------------------------------------------------------------------------------------

setupChat();
setupTasks();
displayTask();
