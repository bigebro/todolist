document.addEventListener("DOMContentLoaded", function () {
    const taskInput = document.getElementById("task");
    const taskInput2 = document.getElementById("task2");
    const taskInput3 = document.getElementById("task3");
    const addTaskButton = document.getElementById("addTask");
    const addTaskButton2 = document.getElementById("addTask2");
    const addTaskButton3 = document.getElementById("addTask3");
    const taskList = document.getElementById("taskList");
    const clearListButton = document.getElementById("clearList");
    const taskCount = document.querySelector(".task-count");
    const dailyTaskGoalElement = document.getElementById("dailyTaskGoal");
    const dailyTaskGoalInput = document.getElementById("dailyTaskInput");
    const dailyTaskGoalInput2 = document.getElementById("dailyTaskInput2");
    const addNumberButton = document.querySelector(".add-number-button");
    const addNumberButton2 = document.querySelector(".add-number-button2");
    const button = document.getElementById("myButton");
    const button2 = document.getElementById("myButton2");
    const button3 = document.getElementById("myButton3");
    const button4 = document.getElementById("myButton4");
    const button5 = document.getElementById("myButton5");
    const dropdown = document.getElementById("myDropdown");
    const dropdown2 = document.getElementById("myDropdown2");
    const dropdown3 = document.getElementById("myDropdown3");
    const dropdown4 = document.getElementById("myDropdown4");
    const dropdown5 = document.getElementById("myDropdown5");
    const homeImage = document.getElementById("homeImage");
    const searchInput = document.getElementById("searchInput");
    const descriptionInput = document.getElementById("description");
    const descriptionInput2 = document.getElementById("description2");
    const descriptionInput3 = document.getElementById("description3");
    const cancelTaskButton = document.getElementById("cancelTask");
    const cancelTaskButton2 = document.getElementById("cancelTask2");
    const cancelTaskButton3= document.getElementById("cancelTask3");
    const userMessage2 = document.getElementById("userMessage2");
    const userMessage = document.getElementById("userMessage");
    const imageForUser = document.getElementById('Image-for-user');

    let completedTasks = 0;
    let dailyTaskGoal = 5; // Default goal
    let totalAddedTasks = 0;
    // todoDBSetup
    const request = window.indexedDB.open("todoDB", 1);
    let db;

    request.onupgradeneeded = function (event) {
        db = event.target.result;
        const objectStore = db.createObjectStore("tasks", { keyPath: "id", autoIncrement: true });
        objectStore.createIndex("task", "task", { unique: false });
    };

    request.onsuccess = function (event) {
        db = event.target.result;
        displayTasks();
    };

    request.onerror = function (event) {
        console.error("Database error: " + event.target.errorCode);
    };


    toggleEmptyStateMessage();
//function

    function updateEmptyState() {
        const taskList = document.getElementById('taskList');
        const emptyStateMessage2 = document.getElementById('emptyStateMessage2');

        if (taskList.children.length === 0) {
            emptyStateMessage2.style.display = 'block';
        } else {
            emptyStateMessage2.style.display = 'none';
        }
    }

    document.getElementById('addTask').addEventListener('click', updateEmptyState);
    document.getElementById('clearList').addEventListener('click', updateEmptyState);


    function isTaskListEmpty() {
        const taskList = document.getElementById('taskList');
        return taskList.childElementCount === 0;
    }

    function toggleEmptyStateMessage() {
        const emptyStateMessage2 = document.getElementById('emptyStateMessage2');
        const taskContainer = document.getElementById('taskContainer');

        if (isTaskListEmpty()) {

            userMessage2.style.display = 'block';
            userMessage.style.display = 'none';
            emptyStateMessage2.style.display = 'block';
            taskContainer.style.display = 'none';
            imageForUser.style.display = "block";
        } else {
            emptyStateMessage2.style.display = 'none';
            taskContainer.style.display = 'block';
        }
    }

    toggleEmptyStateMessage();


    function adjustDropdownHeight() {
        const dropdown = document.getElementById("myDropdown");
        const descriptionHeight = descriptionInput.scrollHeight;
        const maxDropdownHeight = 300;
        const maxTextareaHeight = 100;
        descriptionInput.style.height = Math.min(descriptionHeight, maxTextareaHeight) + "px";
        dropdown.style.height = Math.min(descriptionHeight, maxDropdownHeight) + "px";
    }


    function adjustDropdownHeight2() {
        const dropdown3 = document.getElementById("myDropdown3");
        const descriptionHeight2 = descriptionInput2.scrollHeight;
        const maxDropdownHeight = 300;
        const maxTextareaHeight = 100;
        descriptionInput2.style.height = Math.min(descriptionHeight2, maxTextareaHeight) + "px";
        dropdown3.style.height = Math.min(descriptionHeight2, maxDropdownHeight) + "px";
    }

    function adjustDropdownHeight3() {
        const dropdown4 = document.getElementById("myDropdown4");
        const descriptionHeight3 = descriptionInput2.scrollHeight;
        const maxDropdownHeight = 300;
        const maxTextareaHeight = 100;
        descriptionInput3.style.height = Math.min(descriptionHeight3, maxTextareaHeight) + "px";
        dropdown4.style.height = Math.min(descriptionHeight3, maxDropdownHeight) + "px";
    }


    descriptionInput.addEventListener("input", adjustDropdownHeight);
    descriptionInput2.addEventListener("input", adjustDropdownHeight2);
    descriptionInput3.addEventListener("input", adjustDropdownHeight3);


    function clearAllTasks() {
        const transaction = db.transaction(["tasks"], "readwrite");
        const objectStore = transaction.objectStore("tasks");
        const request = objectStore.clear();

        request.onsuccess = function () {
            totalAddedTasks = 0;
            displayTasks();
            updateTaskCount();
            imageForUser.style.display = "block";
        };

        transaction.onerror = function (event) {
            console.error("Transaction error: " + event.target.errorCode);
        };
    }


    function addNewTask() {
        const taskText = taskInput.value.trim();
        const taskDescription = descriptionInput.value.trim();
        if (taskText === "") return;
        const transaction = db.transaction(["tasks"], "readwrite");
        const objectStore = transaction.objectStore("tasks");
        const task = { task: taskText, description: taskDescription, completed: false };
        const request = objectStore.add(task);

        request.onsuccess = function () {
            taskInput.value = "";
            descriptionInput.value = "";
            taskInput.style.display = "block flex";
            descriptionInput.style.display = "block flex";
            addTaskButton.style.display = "block flex";
            cancelTaskButton.style.display = "block flex";
            totalAddedTasks++;
            updateTaskCount();
            displayTasks();
            imageForUser.style.display = "none";
        };
        toggleEmptyStateMessage();

        transaction.oncomplete = function () {
            console.log("Transaction completed");
        };

        transaction.onerror = function (event) {
            console.error("Transaction error: " + event.target.errorCode);
        };
    }

    function addNewTask2() {

        const taskText2 = taskInput2.value.trim();

        const taskDescription2 = descriptionInput2.value.trim();

        if (taskText2 === "") return;
        const transaction = db.transaction(["tasks"], "readwrite");
        const objectStore = transaction.objectStore("tasks");

        const task2 = { task: taskText2, description: taskDescription2, completed: false };

        const request2 = objectStore.add(task2);

        request2.onsuccess = function () {
            taskInput2.value = "";
            descriptionInput2.value = "";
            taskInput2.style.display = "block flex";
            descriptionInput2.style.display = "block flex";
            addTaskButton2.style.display = "block flex";
            cancelTaskButton2.style.display = "block flex";
            totalAddedTasks++;
            updateTaskCount();
            displayTasks();
            imageForUser.style.display = "none";
        };
        toggleEmptyStateMessage();
        transaction.oncomplete = function () {
            console.log("Transaction completed");
        };

        transaction.onerror = function (event) {
            console.error("Transaction error: " + event.target.errorCode);
        };
    }

    function addNewTask3() {

        const taskText3 = taskInput3.value.trim();
        const signedUpUsername = document.getElementById("profileSignupUsername").value;
        const taskDescription3 = descriptionInput3.value.trim();

        if (taskText3 === "") return;
        const transaction = db.transaction(["tasks"], "readwrite");
        const objectStore = transaction.objectStore("tasks");

        const task3 = { username: signedUpUsername, task: taskText3, description: taskDescription3, completed: false };

        const request3 = objectStore.add(task3);

        request3.onsuccess = function () {
            taskInput3.value = "";
            descriptionInput3.value = "";
            taskInput3.style.display = "block flex";
            descriptionInput3.style.display = "block flex";
            addTaskButton3.style.display = "block flex";
            cancelTaskButton3.style.display = "block flex";
            totalAddedTasks++;
            updateTaskCount();
            displayTasks(signedUpUsername);
            imageForUser.style.display = "none";
        };
        toggleEmptyStateMessage();
        transaction.oncomplete = function () {
            console.log("Transaction completed");
        };

        transaction.onerror = function (event) {
            console.error("Transaction error: " + event.target.errorCode);
        };
    }


    function updateTaskCount() {
        taskCount.textContent = `${completedTasks} / ${dailyTaskGoal}`;
        const percentage = (completedTasks / dailyTaskGoal) * 100;
        const slice = document.querySelector('.slice');
        const clipPathValue = `polygon(0 0, 100% 0, 100% ${100 - percentage}%, 0 ${100 - percentage}%)`;
        slice.style.clipPath = clipPathValue;
        toggleEmptyStateMessage();
    }

    function filterAndDisplayTasks(searchText) {
        const taskItems = document.querySelectorAll("#taskList li");

        taskItems.forEach(function (taskItem) {
            const taskText = taskItem.textContent.toLowerCase();
            if (taskText.includes(searchText)) {
                taskItem.style.display = "";
            } else {
                taskItem.style.display = "none";
            }
        });
    }
    function updateDailyTaskGoal(newGoal) {
        dailyTaskGoal = newGoal;
        dailyTaskGoalElement.textContent = newGoal;
        updateTaskCount();
    }

    function updateDailyTaskGoal2(newGoal2) {
        dailyTaskGoal = newGoal2;
        dailyTaskGoalElement.textContent = newGoal2;
        updateTaskCount();
    }

    function displayTasks(username) {
        while (taskList.firstChild) {
            taskList.removeChild(taskList.firstChild);
        }

        const objectStore = db.transaction("tasks").objectStore("tasks");

        objectStore.openCursor().onsuccess = function (event) {
            const cursor = event.target.result;

            if (cursor) {
                const task = cursor.value;
                if (task.username === username) {
                    const listItem = document.createElement("li");
                    listItem.setAttribute("data-id", cursor.key);
                    listItem.innerHTML = `
                 <div class="task-info">  
                    <span class="task ${cursor.value.completed ? "completed" : ""}">${cursor.value.task}</span>
                      <p class="description">${cursor.value.description}</p>
                   </div>
                    <button class="delete"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                  <path d="M3.5 1a.5.5 0 0 1 .5.5V2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h1.5V1zm1 .5a.5.5 0 0 1 .5-.5H11a.5.5 0 0 1 .5.5V2H4V1.5zm1 
                  1V2h6v.5a.5.5 0 0 1-.5.5H5a.5.5 0 0 1-.5-.5zM1 4v9a1 1 0 0 1 1 1h12a1 1 0 0 1-1-1V4H1z"/>
                     </svg></button>
                `;
                    listItem.querySelector(".delete").addEventListener("click", function () {
                        const taskId = listItem.getAttribute("data-id");
                        deleteTask(taskId);
                    });
                    listItem.querySelector(".task").addEventListener("click", function () {
                        toggleTaskStatus(cursor.key, !cursor.value.completed);
                    });
                    taskList.appendChild(listItem);

                    if (cursor.value.completed) {
                        completedTasks++;
                    }
                }
                cursor.continue();
            }
            updateTaskCount();
        };
    }

    function deleteTask(id) {
        const transaction = db.transaction(["tasks"], "readwrite");
        const objectStore = transaction.objectStore("tasks");
        const request = objectStore.delete(parseInt(id));
        console.log(request,"request");
        const signedUpUsername = document.getElementById("profileSignupUsername").value;
        const signedInUsername = document.getElementById("profileSigninUsername").value;
        request.onsuccess = function () {
            totalAddedTasks--;
            if (signedUpUsername) {
                displayTasks(signedUpUsername);
            } else {
                displayTasks(signedInUsername);
            }

        };

        transaction.onerror = function (event) {
            console.error("Transaction error: " + event.target.errorCode);
        };

        completedTasks++;
        updateTaskCount();
        toggleEmptyStateMessage();
    }

    function toggleTaskStatus(id, completed) {
        const transaction = db.transaction(["tasks"], "readwrite");
        const objectStore = transaction.objectStore("tasks");
        const request = objectStore.get(id);

        request.onsuccess = function () {
            const task = request.result;
            task.completed = completed;
            const updateRequest = objectStore.put(task);

            updateRequest.onsuccess = function () {
                displayTasks();
            };
        };

        transaction.onerror = function (event) {
            console.error("Transaction error: " + event.target.errorCode);
        };

        if (completed) {
            completedTasks++;
        } else {
            completedTasks--;
        }
        updateTaskCount();
        toggleEmptyStateMessage();
    }
//event listener




    document.getElementById("cancelTask").addEventListener("click", function () {
        taskInput.style.display = "block flex";
        descriptionInput.style.display = "block flex";
        addTaskButton.style.display = "block flex";
        cancelTaskButton.style.display = "block flex";
        taskInput.value = "";
        descriptionInput.value = "";
    });


    document.getElementById("cancelTask2").addEventListener("click", function () {

        taskInput2.style.display = "block flex";
        descriptionInput2.style.display = "block flex";
        addTaskButton2.style.display = "block flex";
        cancelTaskButton2.style.display = "block flex";
        taskInput2.value = "";
        descriptionInput2.value = "";
    });

    document.getElementById("cancelTask3").addEventListener("click", function () {

        taskInput3.style.display = "block flex";
        descriptionInput3.style.display = "block flex";
        addTaskButton3.style.display = "block flex";
        cancelTaskButton3.style.display = "block flex";
        taskInput3.value = "";
        descriptionInput3.value = "";
    });


    clearListButton.addEventListener("click", function () {
        if (totalAddedTasks === 0) {
            alert("Устгах даалгавар алга.");
        } else if (confirm("Та бүх даалгаврыг устгахдаа итгэлтэй байна уу?")) {
            clearAllTasks();
        }
    });

    addTaskButton.addEventListener("click", addNewTask);
    addTaskButton2.addEventListener("click", addNewTask2);
    addTaskButton3.addEventListener("click", addNewTask3);

    button.addEventListener("click", function() {
        // Toggle the display style of the dropdown
        if (dropdown.style.display === "block") {
            dropdown.style.display = "none";
        } else {
            dropdown.style.display = "block";
        }
    });

    button2.addEventListener("click", function() {
        // Toggle the display style of the dropdown
        if (dropdown2.style.display === "block") {
            dropdown2.style.display = "none";
        } else {
            dropdown2.style.display = "block";
        }
    });
    button3.addEventListener("click", function() {
        // Toggle the display style of the dropdown
        if (dropdown3.style.display === "block") {
            dropdown3.style.display = "none";
        } else {
            dropdown3.style.display = "block";
        }
    });

    button4.addEventListener("click", function() {
        // Toggle the display style of the dropdown
        if (dropdown4.style.display === "block") {
            dropdown4.style.display = "none";
        } else {
            dropdown4.style.display = "block";
        }
    });

    button5.addEventListener("click", function() {
        // Toggle the display style of the dropdown
        if (dropdown5.style.display === "block") {
            dropdown5.style.display = "none";
        } else {
            dropdown5.style.display = "block";
        }
    });


    window.addEventListener("click", function(event) {
        if (event.target !== button && event.target !== dropdown) {
            dropdown.style.display = "none";

        }
    });

    window.addEventListener("click", function(event) {
        if (event.target !== button2 && event.target !== dropdown2) {
            dropdown2.style.display = "none";
        }
    });

    window.addEventListener("click", function(event) {
        if (event.target !== button3 && event.target !== dropdown3) {
            dropdown3.style.display = "none";
        }
    });
    window.addEventListener("click", function(event) {
        if (event.target !== button4 && event.target !== dropdown4) {
            dropdown4.style.display = "none";
        }
    });

    window.addEventListener("click", function(event) {
        if (event.target !== button5 && event.target !== dropdown5) {
            dropdown5.style.display = "none";
        }
    });

    searchInput.addEventListener("input", function () {
        const searchText = searchInput.value.toLowerCase();
        filterAndDisplayTasks(searchText);
        const taskItems = document.querySelectorAll("#taskList li");

        taskItems.forEach(function (taskItem) {
            const taskText = taskItem.textContent.toLowerCase();
            if (taskText.includes(searchText)) {
                taskItem.style.display = "block flex";
            } else {
                taskItem.style.display = "none";
            }
        });
    });


    homeImage.addEventListener("click", function () {
        const taskItems = document.querySelectorAll("#taskList li");

        if (taskItems.length === 0) {
            displayTasks();
        } else {
            taskItems.forEach(function (taskItem) {
                taskItem.style.display = "";
            });
        }

        searchInput.value = "";
    });


    document.getElementById("task").addEventListener("click", function(event) {
        event.stopPropagation();
    });
    document.getElementById("task2").addEventListener("click", function(event) {
        event.stopPropagation();
    });
    document.getElementById("task3").addEventListener("click", function(event) {
        event.stopPropagation();
    });
    document.getElementById("dailyTaskInput").addEventListener("click", function(event) {
        event.stopPropagation();
    });
    document.getElementById("dailyTaskInput2").addEventListener("click", function(event) {
        event.stopPropagation();
    });
    document.getElementById("description").addEventListener("click", function (event) {
        event.stopPropagation();
    });
    document.getElementById("description2").addEventListener("click", function (event) {
        event.stopPropagation();
    });
    document.getElementById("description3").addEventListener("click", function (event) {
        event.stopPropagation();
    });
    document.getElementById("profileDropdown").addEventListener("click", function (event) {
        event.stopPropagation();
    });
    document.getElementById("myDropdown4").addEventListener("click", function (event) {
        event.stopPropagation();
    });



    addNumberButton.addEventListener("click", function () {
        const newGoal = parseInt(dailyTaskGoalInput.value);
        if (!isNaN(newGoal) && newGoal >= 0) {
            updateDailyTaskGoal(newGoal);
            dailyTaskGoalInput.value = "";
        } else {
            alert("Буруу оролт. Эерэг тоо оруулна уу.");
        }
    });
    addNumberButton2.addEventListener("click", function () {
        const newGoal2 = parseInt(dailyTaskGoalInput2.value);
        if (!isNaN(newGoal2) && newGoal2 >= 0) {
            updateDailyTaskGoal2(newGoal2);
            dailyTaskGoalInput2.value = "";
        } else {
            alert("Буруу оролт. Эерэг тоо оруулна уу.");
        }
    });

    taskInput.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
            addNewTask();
        }
    });
    taskInput2.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
            addNewTask2();
        }
    });
    taskInput3.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
            addNewTask3();
        }
    });
});