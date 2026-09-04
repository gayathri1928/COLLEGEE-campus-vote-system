/* =========================================================
   CAMPUSVOTE - SMVEC ELECTION SYSTEM
   JavaScript
   ========================================================= */


/* =========================================================
   GLOBAL DATA
   ========================================================= */

let currentUser = null;
let selectedCandidate = null;
let selectedPollOption = null;
let currentElection = null;


/* =========================================================
   SAMPLE ELECTION DATA
   ========================================================= */

const elections = [
    {
        id: 1,
        title: "Student Council President Election",
        description: "Election for the Student Council President.",
        position: "President",
        department: "All Departments",
        startDate: "2026-09-01",
        endDate: "2026-09-10",
        status: "active",

        candidates: [
            {
                id: 1,
                name: "Candidate A",
                department: "CSE",
                symbol: "★"
            },
            {
                id: 2,
                name: "Candidate B",
                department: "ECE",
                symbol: "◆"
            },
            {
                id: 3,
                name: "Candidate C",
                department: "IT",
                symbol: "●"
            }
        ]
    },

    {
        id: 2,
        title: "Sports Secretary Election",
        description: "Election for the Sports Secretary.",
        position: "Sports Secretary",
        department: "All Departments",
        startDate: "2026-09-15",
        endDate: "2026-09-20",
        status: "upcoming",

        candidates: [
            {
                id: 4,
                name: "Candidate D",
                department: "ME",
                symbol: "▲"
            },
            {
                id: 5,
                name: "Candidate E",
                department: "ECE",
                symbol: "■"
            }
        ]
    }
];


/* =========================================================
   SAMPLE POLL
   ========================================================= */

const pollOptions = [
    "Candidate A",
    "Candidate B",
    "Candidate C"
];


/* =========================================================
   PAGE LOAD
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    initializeApplication();

});


/* =========================================================
   INITIALIZE APPLICATION
   ========================================================= */

function initializeApplication() {

    setupButtons();

    setupModals();

    setupForms();

    displayElections();

    displayUpcomingElections();

    displayFinishedElections();

    displayWinners();

    displayAnnouncements();

    displayPoll();

    loadSavedUser();

}


/* =========================================================
   BUTTON SETUP
   ========================================================= */

function setupButtons() {

    const loginBtn =
        document.getElementById("loginBtn");

    const registerBtn =
        document.getElementById("registerBtn");

    const logoutBtn =
        document.getElementById("logoutBtn");

    const createElectionBtn =
        document.getElementById("createElectionBtn");

    const manageCandidatesBtn =
        document.getElementById("manageCandidatesBtn");

    const manageVotersBtn =
        document.getElementById("manageVotersBtn");

    const auditLogBtn =
        document.getElementById("auditLogBtn");

    const submitVoteBtn =
        document.getElementById("submitVoteBtn");

    const submitPollVoteBtn =
        document.getElementById("submitPollVoteBtn");

    const cancelElectionBtn =
        document.getElementById("cancelElectionBtn");


    /* LOGIN */

    if (loginBtn) {

        loginBtn.addEventListener("click", function () {

            openModal("loginModal");

        });

    }


    /* REGISTER */

    if (registerBtn) {

        registerBtn.addEventListener("click", function () {

            openModal("registerModal");

        });

    }


    /* LOGOUT */

    if (logoutBtn) {

        logoutBtn.addEventListener("click", function () {

            logoutUser();

        });

    }


    /* CREATE ELECTION */

    if (createElectionBtn) {

        createElectionBtn.addEventListener("click", function () {

            if (!currentUser) {

                showNotification(
                    "Please login as administrator.",
                    "error"
                );

                return;
            }

            openModal("createElectionModal");

        });

    }


    /* MANAGE CANDIDATES */

    if (manageCandidatesBtn) {

        manageCandidatesBtn.addEventListener("click", function () {

            showNotification(
                "Candidate management module will be connected to the backend.",
                "success"
            );

        });

    }


    /* MANAGE VOTERS */

    if (manageVotersBtn) {

        manageVotersBtn.addEventListener("click", function () {

            showNotification(
                "Voter management module will be connected to the backend.",
                "success"
            );

        });

    }


    /* AUDIT LOG */

    if (auditLogBtn) {

        auditLogBtn.addEventListener("click", function () {

            showNotification(
                "Audit log module will be connected to the backend.",
                "success"
            );

        });

    }


    /* SUBMIT VOTE */

    if (submitVoteBtn) {

        submitVoteBtn.addEventListener("click", function () {

            submitVote();

        });

    }


    /* SUBMIT POLL */

    if (submitPollVoteBtn) {

        submitPollVoteBtn.addEventListener("click", function () {

            submitPollVote();

        });

    }


    /* CANCEL ELECTION */

    if (cancelElectionBtn) {

        cancelElectionBtn.addEventListener("click", function () {

            closeModal("createElectionModal");

        });

    }

}


/* =========================================================
   MODAL SETUP
   ========================================================= */

function setupModals() {

    const closeButtons =
        document.querySelectorAll(".close");

    closeButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const modal =
                button.closest(".voting-modal");

            if (modal) {

                modal.style.display = "none";

            }

        });

    });


    /* Close when clicking outside modal */

    window.addEventListener("click", function (event) {

        if (event.target.classList.contains("voting-modal")) {

            event.target.style.display = "none";

        }

    });

}


/* =========================================================
   OPEN MODAL
   ========================================================= */

function openModal(id) {

    const modal =
        document.getElementById(id);

    if (modal) {

        modal.style.display = "block";

    }

}


/* =========================================================
   CLOSE MODAL
   ========================================================= */

function closeModal(id) {

    const modal =
        document.getElementById(id);

    if (modal) {

        modal.style.display = "none";

    }

}


/* =========================================================
   FORM SETUP
   ========================================================= */

function setupForms() {

    const loginForm =
        document.getElementById("loginForm");

    const registerForm =
        document.getElementById("registerForm");

    const createElectionForm =
        document.getElementById("createElectionForm");


    /* LOGIN FORM */

    if (loginForm) {

        loginForm.addEventListener(
            "submit",
            handleLogin
        );

    }


    /* REGISTER FORM */

    if (registerForm) {

        registerForm.addEventListener(
            "submit",
            handleRegistration
        );

    }


    /* CREATE ELECTION FORM */

    if (createElectionForm) {

        createElectionForm.addEventListener(
            "submit",
            handleCreateElection
        );

    }

}


/* =========================================================
   REGISTRATION
   ========================================================= */

function handleRegistration(event) {

    event.preventDefault();


    const name =
        document.getElementById("regName").value.trim();

    const studentId =
        document.getElementById("regStudentId").value
        .trim()
        .toUpperCase();

    const email =
        document.getElementById("regEmail").value
        .trim()
        .toLowerCase();

    const mobile =
        document.getElementById("regMobile").value.trim();

    const department =
        document.getElementById("regDepartment").value;

    const password =
        document.getElementById("regPassword").value;

    const confirmPassword =
        document.getElementById("regConfirmPassword").value;


    /* CHECK EMPTY VALUES */

    if (
        !name ||
        !studentId ||
        !email ||
        !mobile ||
        !department ||
        !password ||
        !confirmPassword
    ) {

        showNotification(
            "Please fill all required fields.",
            "error"
        );

        return;
    }


    /* MOBILE VALIDATION */

    const mobilePattern =
        /^[6-9][0-9]{9}$/;

    if (!mobilePattern.test(mobile)) {

        showNotification(
            "Enter a valid 10-digit Indian mobile number.",
            "error"
        );

        return;
    }


    /* EMAIL VALIDATION */

    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {

        showNotification(
            "Please enter a valid email address.",
            "error"
        );

        return;
    }


    /* PASSWORD LENGTH */

    if (password.length < 8) {

        showNotification(
            "Password must contain at least 8 characters.",
            "error"
        );

        return;
    }


    /* PASSWORD MATCH */

    if (password !== confirmPassword) {

        showNotification(
            "Password and Confirm Password do not match.",
            "error"
        );

        return;
    }


    /*
     * IMPORTANT:
     *
     * This localStorage check is only for demonstration.
     *
     * Real security MUST be implemented in the backend/database.
     */

    let users =
        JSON.parse(
            localStorage.getItem("campusVoteUsers")
        ) || [];


    /* CHECK STUDENT ID */

    const studentExists =
        users.some(function (user) {

            return user.studentId === studentId;

        });

    if (studentExists) {

        showNotification(
            "This Student ID is already registered.",
            "error"
        );

        return;
    }


    /* CHECK EMAIL */

    const emailExists =
        users.some(function (user) {

            return user.email === email;

        });

    if (emailExists) {

        showNotification(
            "This email address is already registered.",
            "error"
        );

        return;
    }


    /* CHECK MOBILE */

    const mobileExists =
        users.some(function (user) {

            return user.mobile === mobile;

        });

    if (mobileExists) {

        showNotification(
            "This mobile number is already registered.",
            "error"
        );

        return;
    }


    /*
     * CREATE USER
     *
     * WARNING:
     * Do NOT use this localStorage approach
     * for a real production voting system.
     */

    const newUser = {

        name: name,

        studentId: studentId,

        email: email,

        mobile: mobile,

        department: department,

        password: password,

        role: "voter",

        registeredAt:
            new Date().toISOString()

    };


    users.push(newUser);


    localStorage.setItem(
        "campusVoteUsers",
        JSON.stringify(users)
    );


    showNotification(
        "Registration successful!",
        "success"
    );


    document.getElementById(
        "registerForm"
    ).reset();


    closeModal("registerModal");

}


/* =========================================================
   LOGIN
   ========================================================= */

function handleLogin(event) {

    event.preventDefault();


    const username =
        document.getElementById("username").value
        .trim()
        .toLowerCase();

    const password =
        document.getElementById("password").value;


    if (!username || !password) {

        showNotification(
            "Please enter login details.",
            "error"
        );

        return;
    }


    let users =
        JSON.parse(
            localStorage.getItem("campusVoteUsers")
        ) || [];


    /*
     * Demo admin account.
     *
     * For production, admin authentication
     * must be handled securely on the server.
     */

    if (
        username === "admin" &&
        password === "Admin@123"
    ) {

        currentUser = {

            name: "Administrator",

            studentId: "ADMIN",

            email: "admin@smvec.ac.in",

            role: "admin"

        };


        saveCurrentUser();

        updateUserInterface();

        closeModal("loginModal");

        showNotification(
            "Administrator login successful.",
            "success"
        );

        return;
    }


    const user =
        users.find(function (user) {

            return (
                user.studentId.toLowerCase() === username ||
                user.email.toLowerCase() === username
            );

        });


    if (!user) {

        showNotification(
            "Account not found. Please register first.",
            "error"
        );

        return;
    }


    if (user.password !== password) {

        showNotification(
            "Incorrect password.",
            "error"
        );

        return;
    }


    currentUser = user;


    saveCurrentUser();

    updateUserInterface();

    closeModal("loginModal");


    showNotification(
        "Login successful. Welcome " +
        user.name + "!",
        "success"
    );

}


/* =========================================================
   SAVE CURRENT USER
   ========================================================= */

function saveCurrentUser() {

    localStorage.setItem(
        "campusVoteCurrentUser",
        JSON.stringify(currentUser)
    );

}


/* =========================================================
   LOAD SAVED USER
   ========================================================= */

function loadSavedUser() {

    const savedUser =
        localStorage.getItem(
            "campusVoteCurrentUser"
        );


    if (savedUser) {

        currentUser =
            JSON.parse(savedUser);

        updateUserInterface();

    }

}


/* =========================================================
   LOGOUT
   ========================================================= */

function logoutUser() {

    currentUser = null;

    localStorage.removeItem(
        "campusVoteCurrentUser"
    );

    updateUserInterface();


    showNotification(
        "You have been logged out.",
        "success"
    );

}


/* =========================================================
   UPDATE USER INTERFACE
   ========================================================= */

function updateUserInterface() {

    const userInfo =
        document.getElementById("userInfo");

    const userName =
        document.getElementById("userName");

    const loginBtn =
        document.getElementById("loginBtn");

    const registerBtn =
        document.getElementById("registerBtn");

    const logoutBtn =
        document.getElementById("logoutBtn");

    const adminPanel =
        document.getElementById("adminPanel");

    const adminNav =
        document.querySelector(".nav-admin");


    if (currentUser) {

        if (userInfo) {

            userInfo.style.display = "flex";

        }

        if (userName) {

            userName.textContent =
                currentUser.name;

        }

        if (loginBtn) {

            loginBtn.style.display = "none";

        }

        if (registerBtn) {

            registerBtn.style.display = "none";

        }

        if (logoutBtn) {

            logoutBtn.style.display = "inline-block";

        }


        /* ADMIN */

        if (
            currentUser.role === "admin"
        ) {

            if (adminPanel) {

                adminPanel.style.display =
                    "block";

            }

            if (adminNav) {

                adminNav.style.display =
                    "block";

            }

        }

    } else {

        if (userInfo) {

            userInfo.style.display = "none";

        }

        if (loginBtn) {

            loginBtn.style.display =
                "inline-block";

        }

        if (registerBtn) {

            registerBtn.style.display =
                "inline-block";

        }

        if (logoutBtn) {

            logoutBtn.style.display =
                "none";

        }

        if (adminPanel) {

            adminPanel.style.display =
                "none";

        }

        if (adminNav) {

            adminNav.style.display =
                "none";

        }

    }

}


/* =========================================================
   DISPLAY ELECTIONS
   ========================================================= */

function displayElections() {

    const electionList =
        document.getElementById(
            "electionList"
        );


    if (!electionList) {
        return;
    }


    electionList.innerHTML = "";


    const activeElections =
        elections.filter(function (election) {

            return election.status === "active";

        });


    if (activeElections.length === 0) {

        electionList.innerHTML =
            "<p>No active elections currently.</p>";

        return;
    }


    activeElections.forEach(function (election) {

        const card =
            document.createElement("div");

        card.className =
            "election-card";


        card.innerHTML = `

            <h3>${escapeHTML(election.title)}</h3>

            <p>
                <strong>Position:</strong>
                ${escapeHTML(election.position)}
            </p>

            <p>
                ${escapeHTML(election.description)}
            </p>

            <p>
                <strong>Department:</strong>
                ${escapeHTML(election.department)}
            </p>

            <p>
                <strong>Voting Period:</strong>
                ${formatDate(election.startDate)}
                -
                ${formatDate(election.endDate)}
            </p>

            <button
                class="submit-vote-btn"
                onclick="openVoting(${election.id})"
            >
                <i class="fas fa-vote-yea"></i>
                Vote Now
            </button>

            <button
                class="submit-vote-btn"
                style="margin-left:8px;"
                onclick="showResults(${election.id})"
            >
                <i class="fas fa-chart-bar"></i>
                Results
            </button>

        `;


        electionList.appendChild(card);

    });

}


/* =========================================================
   OPEN VOTING
   ========================================================= */

function openVoting(electionId) {

    if (!currentUser) {

        showNotification(
            "Please login before voting.",
            "error"
        );

        openModal("loginModal");

        return;
    }


    currentElection =
        elections.find(function (election) {

            return election.id === electionId;

        });


    if (!currentElection) {

        showNotification(
            "Election not found.",
            "error"
        );

        return;
    }


    const description =
        document.getElementById(
            "electionDescription"
        );


    if (description) {

        description.textContent =
            currentElection.description;

    }


    displayCandidates();


    selectedCandidate = null;


    const submitButton =
        document.getElementById(
            "submitVoteBtn"
        );


    if (submitButton) {

        submitButton.disabled = true;

    }


    openModal("votingModal");

}


/* =========================================================
   DISPLAY CANDIDATES
   ========================================================= */

function displayCandidates() {

    const candidateList =
        document.getElementById(
            "candidateList"
        );


    if (!candidateList || !currentElection) {
        return;
    }


    candidateList.innerHTML = "";


    currentElection.candidates.forEach(
        function (candidate) {

            const card =
                document.createElement("label");

            card.className =
                "candidate-card";


            card.innerHTML = `

                <input
                    type="radio"
                    name="candidate"
                    value="${candidate.id}"
                >

                <div>
                    <strong>
                        ${escapeHTML(candidate.name)}
                    </strong>

                    <br>

                    <small>
                        Department:
                        ${escapeHTML(candidate.department)}
                    </small>

                    <br>

                    <small>
                        Symbol:
                        ${escapeHTML(candidate.symbol)}
                    </small>
                </div>

            `;


            const radio =
                card.querySelector(
                    "input"
                );


            radio.addEventListener(
                "change",
                function () {

                    selectedCandidate =
                        candidate.id;


                    const submitButton =
                        document.getElementById(
                            "submitVoteBtn"
                        );


                    if (submitButton) {

                        submitButton.disabled =
                            false;

                    }

                }
            );


            candidateList.appendChild(card);

        }
    );

}


/* =========================================================
   SUBMIT VOTE
   ========================================================= */

function submitVote() {

    if (!currentUser) {

        showNotification(
            "Please login before voting.",
            "error"
        );

        return;
    }


    if (!currentElection) {

        showNotification(
            "No election selected.",
            "error"
        );

        return;
    }


    if (!selectedCandidate) {

        showNotification(
            "Please select a candidate.",
            "error"
        );

        return;
    }


    /*
     * Prevent duplicate voting in this browser.
     *
     * REAL SECURITY:
     * Backend/database must enforce
     * one vote per student per election.
     */

    const voteKey =
        "vote_" +
        currentUser.studentId +
        "_" +
        currentElection.id;


    if (localStorage.getItem(voteKey)) {

        showNotification(
            "You have already voted in this election.",
            "error"
        );

        return;
    }


    localStorage.setItem(
        voteKey,
        JSON.stringify({

            electionId:
                currentElection.id,

            candidateId:
                selectedCandidate,

            studentId:
                currentUser.studentId,

            timestamp:
                new Date().toISOString()

        })
    );


    showNotification(
        "Your vote has been recorded successfully.",
        "success"
    );


    closeModal("votingModal");

}


/* =========================================================
   DISPLAY POLL
   ========================================================= */

function displayPoll() {

    const pollContainer =
        document.getElementById(
            "pollOptions"
        );


    if (!pollContainer) {
        return;
    }


    pollContainer.innerHTML = "";


    pollOptions.forEach(function (option, index) {

        const label =
            document.createElement("label");

        label.className =
            "poll-option";


        label.innerHTML = `

            <input
                type="radio"
                name="pollOption"
                value="${index}"
            >

            <span>
                ${escapeHTML(option)}
            </span>

        `;


        const radio =
            label.querySelector("input");


        radio.addEventListener(
            "change",
            function () {

                selectedPollOption =
                    index;

            }
        );


        pollContainer.appendChild(label);

    });

}


/* =========================================================
   SUBMIT POLL
   ========================================================= */

function submitPollVote() {

    if (!currentUser) {

        showNotification(
            "Please login before participating in the poll.",
            "error"
        );

        openModal("loginModal");

        return;
    }


    if (
        selectedPollOption === null
    ) {

        showNotification(
            "Please select an option.",
            "error"
        );

        return;
    }


    const pollKey =
        "poll_" +
        currentUser.studentId;


    if (localStorage.getItem(pollKey)) {

        showNotification(
            "You have already participated in this poll.",
            "error"
        );

        return;
    }


    localStorage.setItem(
        pollKey,
        JSON.stringify({

            option:
                selectedPollOption,

            studentId:
                currentUser.studentId,

            timestamp:
                new Date().toISOString()

        })
    );


    showNotification(
        "Poll vote submitted successfully.",
        "success"
    );

}


/* =========================================================
   UPCOMING ELECTIONS
   ========================================================= */

function displayUpcomingElections() {

    const container =
        document.getElementById(
            "upcomingElections"
        );


    if (!container) {
        return;
    }


    container.innerHTML = "";


    const upcoming =
        elections.filter(function (election) {

            return election.status === "upcoming";

        });


    if (upcoming.length === 0) {

        container.innerHTML =
            "<p>No upcoming elections.</p>";

        return;
    }


    upcoming.forEach(function (election) {

        const item =
            document.createElement("div");

        item.className =
            "status-item";


        item.innerHTML = `

            <strong>
                ${escapeHTML(election.title)}
            </strong>

            <span>
                Starts:
                ${formatDate(election.startDate)}
            </span>

        `;


        container.appendChild(item);

    });

}


/* =========================================================
   FINISHED ELECTIONS
   ========================================================= */

function displayFinishedElections() {

    const container =
        document.getElementById(
            "finishedElections"
        );


    if (!container) {
        return;
    }


    container.innerHTML = `

        <div class="status-item">

            <strong>
                Previous Student Council Election
            </strong>

            <span>
                Completed
            </span>

        </div>

    `;

}


/* =========================================================
   WINNERS
   ========================================================= */

function displayWinners() {

    const container =
        document.getElementById(
            "winnersList"
        );


    if (!container) {
        return;
    }


    container.innerHTML = `

        <div class="winner-item">

            <strong>
                Student Council President
            </strong>

            <p>
                Results will appear after election.
            </p>

        </div>

    `;

}


/* =========================================================
   ANNOUNCEMENTS
   ========================================================= */

function displayAnnouncements() {

    const container =
        document.getElementById(
            "announcementList"
        );


    if (!container) {
        return;
    }


    container.innerHTML = `

        <div class="announcement-item">

            <strong>
                Election Announcement
            </strong>

            <p>
                Please make sure your voter
                registration details are correct.
            </p>

        </div>

        <div class="announcement-item">

            <strong>
                Secure Voting
            </strong>

            <p>
                Each registered student can
                vote only once per election.
            </p>

        </div>

    `;

}


/* =========================================================
   RESULTS
   ========================================================= */

function showResults(electionId) {

    const election =
        elections.find(function (item) {

            return item.id === electionId;

        });


    if (!election) {
        return;
    }


    const title =
        document.getElementById(
            "resultsTitle"
        );

    const totalVotes =
        document.getElementById(
            "totalVotesStat"
        );

    const turnout =
        document.getElementById(
            "turnoutStat"
        );

    const container =
        document.getElementById(
            "resultsContainer"
        );


    if (title) {

        title.textContent =
            election.title;

    }


    if (totalVotes) {

        totalVotes.textContent =
            "Total Votes: 0";

    }


    if (turnout) {

        turnout.textContent =
            "Turnout: 0%";

    }


    if (container) {

        container.innerHTML = "";


        election.candidates.forEach(
            function (candidate) {

                const result =
                    document.createElement("div");

                result.className =
                    "result-item";


                result.innerHTML = `

                    <h4>
                        ${escapeHTML(candidate.name)}
                    </h4>

                    <div class="result-bar">

                        <div
                            class="result-bar-fill"
                            style="width:0%"
                        ></div>

                    </div>

                    <small>
                        0 votes
                    </small>

                `;


                container.appendChild(result);

            }
        );

    }


    openModal("resultsModal");

}


/* =========================================================
   CREATE ELECTION
   ========================================================= */

function handleCreateElection(event) {

    event.preventDefault();


    if (
        !currentUser ||
        currentUser.role !== "admin"
    ) {

        showNotification(
            "Only administrators can create elections.",
            "error"
        );

        return;
    }


    const title =
        document.getElementById(
            "electionTitle"
        ).value.trim();


    const description =
        document.getElementById(
            "electionDescriptionInput"
        ).value.trim();


    const position =
        document.getElementById(
            "electionPosition"
        ).value.trim();


    const department =
        document.getElementById(
            "electionDepartment"
        ).value;


    const startDate =
        document.getElementById(
            "startDate"
        ).value;


    const endDate =
        document.getElementById(
            "endDate"
        ).value;


    if (
        !title ||
        !description ||
        !position ||
        !startDate ||
        !endDate
    ) {

        showNotification(
            "Please fill all election details.",
            "error"
        );

        return;
    }


    if (
        new Date(endDate) <=
        new Date(startDate)
    ) {

        showNotification(
            "End date must be after start date.",
            "error"
        );

        return;
    }


    const newElection = {

        id:
            elections.length + 1,

        title:
            title,

        description:
            description,

        position:
            position,

        department:
            department || "All Departments",

        startDate:
            startDate,

        endDate:
            endDate,

        status:
            "upcoming",

        candidates:
            []

    };


    elections.push(newElection);


    showNotification(
        "Election created successfully.",
        "success"
    );


    document.getElementById(
        "createElectionForm"
    ).reset();


    closeModal("createElectionModal");


    displayElections();

    displayUpcomingElections();

}


/* =========================================================
   NOTIFICATION
   ========================================================= */

function showNotification(
    message,
    type = "success"
) {

    const container =
        document.getElementById(
            "notificationContainer"
        );


    if (!container) {

        alert(message);

        return;

    }


    const notification =
        document.createElement("div");

    notification.className =
        "notification " + type;


    notification.textContent =
        message;


    container.appendChild(
        notification
    );


    setTimeout(function () {

        notification.remove();

    }, 4000);

}


/* =========================================================
   FORMAT DATE
   ========================================================= */

function formatDate(dateString) {

    if (!dateString) {
        return "";
    }


    const date =
        new Date(dateString);


    if (isNaN(date.getTime())) {

        return dateString;

    }


    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}


/* =========================================================
   HTML SECURITY
   ========================================================= */

function escapeHTML(value) {

    if (value === null ||
        value === undefined) {

        return "";

    }


    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =========================================================
   NAVIGATION
   ========================================================= */

document.addEventListener(
    "click",
    function (event) {

        const dashboard =
            event.target.closest(
                ".nav-dashboard"
            );

        const electionsNav =
            event.target.closest(
                ".nav-elections"
            );

        const resultsNav =
            event.target.closest(
                ".nav-results"
            );

        const faqNav =
            event.target.closest(
                ".nav-faq"
            );


        if (dashboard) {

            event.preventDefault();

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }


        if (electionsNav) {

            event.preventDefault();

            const section =
                document.querySelector(
                    ".elections-container"
                );

            if (section) {

                section.scrollIntoView({
                    behavior: "smooth"
                });

            }

        }


        if (resultsNav) {

            event.preventDefault();

            showNotification(
                "Select an election to view its results.",
                "success"
            );

        }


        if (faqNav) {

            event.preventDefault();

            showNotification(
                "FAQ section will be available soon.",
                "success"
            );

        }

    }
);