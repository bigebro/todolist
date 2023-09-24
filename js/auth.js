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

    let loggedIn = false;
    let signedUp = false;
    let isOnSignupForm = false;
    let isProfileFormVisible = false;
    let dropdownVisible = false;

    // Database setup
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
