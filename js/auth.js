// auth.js

document.addEventListener("DOMContentLoaded", () => {
    const signupForm = document.getElementById("profileSignupForm");
    const signinForm = document.getElementById("profileSigninForm");
    const profileButton = document.getElementById('profileButton');
    const signupUsernameError = document.getElementById('signupUsernameError');
    const signinUsernameError = document.getElementById('signinUsernameError');
    const profileForm = document.getElementById('profileForm');
    const profileSignupForm = document.getElementById('profileSignupForm');
    const profileSignupUsername = document.getElementById('profileSignupUsername');
    const profileSignupPassword = document.getElementById('profileSignupPassword');
    const profileSigninForm = document.getElementById('profileSigninForm');
    const profileSigninUsername = document.getElementById('profileSigninUsername');
    const profileSigninPassword = document.getElementById('profileSigninPassword');
    const welcomeMessage = document.getElementById('welcomeMessage');
    const userMessage = document.getElementById('userMessage');
    const userMessage2 = document.getElementById('userMessage2');
    const signOutButton = document.getElementById('signOutButton');
    const profileSignin = document.getElementById('profile-signin');
    const imageForUser = document.getElementById('Image-for-user');
    const taskList = document.getElementById("taskList");
    const taskCount = document.querySelector(".task-count");

    let loggedIn = false;
    let signedUp = false;
    let isOnSignupForm = false;
    let isProfileFormVisible = false;
    let dropdownVisible = false;
    let completedTasks = 0;
    let totalAddedTasks = 0;
    let dailyTaskGoal = 5; // Default goal

    // userDatabase setup
    const dbName = "userDatabase";
    const dbVersion = 1;

    const request = indexedDB.open(dbName, dbVersion);

    request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains("users")) {
            db.createObjectStore("users", { keyPath: "username" });
        }
    };

    request.onerror = (event) => {
        console.error("Database error:", event.target.error);
    };

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    function resetDefaults() {
        completedTasks = 0; //
        dailyTaskGoal = 5; //

    }

    request.onsuccess = ((event) => {
        const db = event.target.result;

        // Sign-up
        signupForm.addEventListener("submit", (event) => {
            event.preventDefault();
            const username = document.getElementById("profileSignupUsername").value;
            const password = document.getElementById("profileSignupPassword").value;

            signupUsernameError.textContent = "";

            const transaction = db.transaction(["users"], "readwrite");
            const store = transaction.objectStore("users");

            const addUserRequest = store.add({ username, password });

            addUserRequest.onsuccess = () => {
                console.log("User registered successfully.");
                signedUp = true;
                userMessage.innerHTML  = `<span style="text-transform: capitalize; font-weight: bold; font-size: 16px;">${username}</span>! Үлдсэн өдрийг сайхан өнгөрүүлээрэй, мөн #Todolist-ийн 
                гайхалтай байдлыг хуваалцахаа бүү мартаарай ↓`;
                userMessage2.innerHTML  = `Та долоо хоногоо дуусгалаа, <span style="text-transform: capitalize; font-weight: bold; font-size: 16px;">${username}</span>! Үлдсэн өдрийг сайхан өнгөрүүлээрэй, мөн #Todolist-ийн 
                гайхалтай байдлыг хуваалцахаа бүү мартаарай ↓`;
                userMessage.style.display = 'block';
                userMessage2.style.display = 'none';
                toggleForms(username);
                profileForm.style.display = "none";
                imageForUser.style.display = "block";
                showDropdown();
                displayTasks(username);

            };

            addUserRequest.onerror = (e) => {
                console.error("Error registering user:", e.target.error);
                signupUsernameError.textContent = "Бүртгэлтэй хэрэглэгчийн нэр байна.";
            };
        });

        // Sign-in
           signinForm.addEventListener("submit", (event) => {
            event.preventDefault();
            const username = document.getElementById("profileSigninUsername").value;
            const password = document.getElementById("profileSigninPassword").value;

            signinUsernameError.textContent = "";

            const transaction = db.transaction(["users"], "readonly");
            const store = transaction.objectStore("users");

            const getUserRequest = store.get(username);

            getUserRequest.onsuccess = (event) => {
                const user = event.target.result;

                if (user && user.password === password) {
                    console.log("Login successful.");
                    loggedIn = true;
                    userMessage2.innerHTML  = `Та долоо хоногоо дуусгалаа, <span style="text-transform: capitalize; font-weight: bold; font-size: 16px;">${username}</span>! Үлдсэн өдрийг сайхан өнгөрүүлээрэй, мөн #Todolist-ийн 
                гайхалтай байдлыг хуваалцахаа бүү мартаарай ↓`;
                    userMessage.innerHTML  = `<span style="text-transform: capitalize; font-weight: bold; font-size: 16px;">${username}</span>! Үлдсэн өдрийг сайхан өнгөрүүлээрэй, мөн #Todolist-ийн 
                гайхалтай байдлыг хуваалцахаа бүү мартаарай ↓`;
                    userMessage.style.display = 'block'; // Show the user message
                    userMessage2.style.display = 'none';
                    toggleForms(username);
                    profileForm.style.display = "none";
                    imageForUser.style.display = "block";
                    showDropdown();
                    displayTasks(username);

                } else {
                    console.error("Login failed. Invalid credentials.");
                    userMessage.style.display = 'none';
                    userMessage2.style.display = 'none';
                    signinUsernameError.textContent = "Буруу хэрэглэгчийн нэр эсвэл нууц үг байна.";
                }
            };

            getUserRequest.onerror = (e) => {
                console.error("Error fetching user:", e.target.error);
                signinUsernameError.textContent = "Мэдээдээлэлд алдаа гарлаа.";
            };
        });






        function toggleForms(username) {
            const signupForm = document.getElementById("profileSignupForm");
            const signinForm = document.getElementById("profileSigninForm");

            if (signedUp || loggedIn) {
                signupForm.style.display = "none";
                signinForm.style.display = "none";
                welcomeMessage.style.display = "block";
                welcomeMessage.textContent = `Сайн уу, ${capitalizeFirstLetter(username)}!`;
                signOutButton.style.display = "block";
                profileSignin.style.display = "none";

            } else {
                signupForm.style.display = "block";
                signinForm.style.display = "block";
                welcomeMessage.style.display = "none";
                signOutButton.style.display = "none";
            }
        }


    });


    // todoDBSetup
    const request2 = window.indexedDB.open("todoDB", 1);
    let db2;

    request2.onupgradeneeded = function (event) {
        db2 = event.target.result;
        const objectStore = db2.createObjectStore("tasks", { keyPath: "id", autoIncrement: true });
        objectStore.createIndex("task", "task", { unique: false });
    };

    request2.onsuccess = function (event) {
        db2 = event.target.result;
        displayTasks();
    };

    request2.onerror = function (event) {
        console.error("Database error: " + event.target.errorCode);
    };



    function displayTasks(username) {
        while (taskList.firstChild) {
            taskList.removeChild(taskList.firstChild);
        }

        const objectStore = db2.transaction("tasks").objectStore("tasks");
        objectStore.openCursor().onsuccess = function (event) {
            const cursor = event.target.result;


            if (cursor) {
                const task = cursor.value;
                if (task.username === username) {
                    const listItem = document.createElement("li");
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
                        deleteTask(cursor.key);
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
    function updateTaskCount() {
        taskCount.textContent = `${completedTasks} / ${dailyTaskGoal}`;
        const percentage = (completedTasks / dailyTaskGoal) * 100;
        const slice = document.querySelector('.slice');
        const clipPathValue = `polygon(0 0, 100% 0, 100% ${100 - percentage}%, 0 ${100 - percentage}%)`;
        slice.style.clipPath = clipPathValue;
        toggleEmptyStateMessage();
    }
    function toggleTaskStatus(id, completed) {
        const transaction = db2.transaction(["tasks"], "readwrite");
        const objectStore = transaction.objectStore("tasks");
        const request2 = objectStore.get(id);
        request2.onsuccess = function () {
            const task = request2.result;
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
    function deleteTask(id) {
        const transaction = db2.transaction(["tasks"], "readwrite");
        const objectStore = transaction.objectStore("tasks");
        const request2 = objectStore.delete(id);
        request2.onsuccess = function () {
            totalAddedTasks--;
            displayTasks();
        };
        transaction.onerror = function (event) {
            console.error("Transaction error: " + event.target.errorCode);
        };
        completedTasks++;
        updateTaskCount();
        toggleEmptyStateMessage();
    }







    function showDropdown() {
        const profileDropdown = document.getElementById('profileDropdown');
        profileDropdown.classList.add('active');
        dropdownVisible = true; // Set the flag to true
    }

// When a user signs out, remove the 'active' class to hide the dropdown.
    function hideDropdown() {
        const profileDropdown = document.getElementById('profileDropdown');
        profileDropdown.classList.remove('active');
        dropdownVisible = false; // Set the flag to false
    }

    profileDropdown.addEventListener('mouseleave', () => {
        hideDropdown();
    });

    profileForm.addEventListener('mouseleave', () => {
        hideDropdown();
    });


    profileButton.addEventListener('mouseenter', () => {
        if (loggedIn) {
            showDropdown();
        }
        if (signedUp) {
            showDropdown();
        }

    });


    profileButton.addEventListener('mouseleave', () => {
        if (loggedIn || signedUp) {
            setTimeout(() => {
                if (!dropdownVisible) {
                    hideDropdown();
                }
            }, 200);
        } else {
            // Move the hideDropdown() call here to ensure it hides the dropdown
            hideDropdown();
        }
    });


    profileButton.addEventListener('click', () => {
        if (loggedIn || signedUp) {
            signOutButton.style.display = 'block';
            showDropdown();
        } else {
            if (!isOnSignupForm && !loggedIn && !signedUp) {
                profileSigninForm.style.display = 'block';
                showSignupForm();
                isOnSignupForm = true;
            } else {

            }
        }

        if (!isProfileFormVisible) {

            profileForm.style.display = 'block';
            isProfileFormVisible = true;
        }
    });



    signOutButton.addEventListener('click', () => {
        profileSignupUsername.value = '';
        profileSignupPassword.value = '';
        profileSigninUsername.value = '';
        profileSigninPassword.value = '';
        showSignupForm();
        loggedIn = false;
        welcomeMessage.style.display = 'none';
        signOutButton.style.display = 'none';
        profileSignin.style.display = "block";
    });

    function showSignupForm() {
        profileForm.style.display = 'block';
        signOutButton.style.display = 'none';
        profileSigninForm.style.display = 'block';
        profileSignupForm.style.display = "none";
        welcomeMessage.style.display = 'none';
    }
});