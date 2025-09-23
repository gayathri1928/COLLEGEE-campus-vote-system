// Sample data for demonstration
const sampleElections = [
    {
        id: 1,
        title: "Student Council President Election",
        description: "Vote for the next Student Council President who will represent student interests for the 2025 academic year.",
        position: "President",
        department: "",
        startDate: "2025-01-15T08:00",
        endDate: "2025-01-20T17:00",
        status: "active",
        candidates: [
            { id: 1, name: "Gayathri", department: "CS", votes: 0 },
            { id: 2, name: "Rupa", department: "IT", votes: 0 },
            { id: 3, name: "Theema", department: "ECE", votes: 0 }
        ],
        totalVoters: 1500,
        voted: []
    },
    {
        id: 2,
        title: "Computer Science Department Representative",
        description: "Elect your representative for the Computer Science Department.",
        position: "Department Representative",
        department: "CS",
        startDate: "2025-01-10T09:00",
        endDate: "2025-01-15T16:00",
        status: "finished",
        candidates: [
            { id: 1, name: "Priya Dharshini", department: "CS", votes: 45 },
            { id: 2, name: "Pavithra", department: "CS", votes: 38 }
        ],
        totalVoters: 85,
        voted: ["student1", "student2"]
    },
    {
        id: 3,
        title: "Cultural Committee Head Election",
        description: "Elect the head of Cultural Committee for organizing college events.",
        position: "Cultural Committee Head",
        department: "",
        startDate: "2025-02-01T09:00",
        endDate: "2025-02-05T17:00",
        status: "upcoming",
        candidates: [
            { id: 1, name: "Kathija", department: "ME", votes: 0 },
            { id: 2, name: "Haarshika", department: "IT", votes: 0 }
        ],
        totalVoters: 2000,
        voted: []
    }
];

const sampleAnnouncements = [
    {
        title: "New Election Posted",
        content: "The Student Council President election is now open for voting until January 20th.",
        date: "2025-01-15"
    },
    {
        title: "System Maintenance",
        content: "The voting system will be unavailable on January 25th from 2:00 AM to 4:00 AM for maintenance.",
        date: "2025-01-10"
    },
    {
        title: "Voting Results Available",
        content: "Results for the Department Representative elections are now available to view.",
        date: "2025-01-16"
    }
];

const samplePoll = {
    question: "Favorite Campus Event",
    options: [
        { id: 1, text: "Tech Fest", votes: 0 },
        { id: 2, text: "Cultural Festival", votes: 0 },
        { id: 3, text: "Sports Day", votes: 0 },
        { id: 4, text: "Science Fair", votes: 0 }
    ]
};

// State management
let currentUser = null;
let selectedElection = null;
let selectedCandidate = null;
let selectedPollOption = null;

// DOM Elements
const elements = {
    // User controls
    userInfo: document.getElementById('userInfo'),
    userName: document.getElementById('userName'),
    loginBtn: document.getElementById('loginBtn'),
    registerBtn: document.getElementById('registerBtn'),
    logoutBtn: document.getElementById('logoutBtn'),
    
    // Navigation
    navAdmin: document.querySelector('.nav-admin'),
    
    // Content sections
    electionList: document.getElementById('electionList'),
    pollOptions: document.getElementById('pollOptions'),
    adminPanel: document.getElementById('adminPanel'),
    announcementList: document.getElementById('announcementList'),
    upcomingElections: document.getElementById('upcomingElections'),
    finishedElections: document.getElementById('finishedElections'),
    winnersList: document.getElementById('winnersList'),
    
    // Modals
    votingModal: document.getElementById('votingModal'),
    resultsModal: document.getElementById('resultsModal'),
    loginModal: document.getElementById('loginModal'),
    registerModal: document.getElementById('registerModal'),
    createElectionModal: document.getElementById('createElectionModal'),
    
    // Buttons
    submitVoteBtn: document.getElementById('submitVoteBtn'),
    submitPollVoteBtn: document.getElementById('submitPollVoteBtn'),
    createElectionBtn: document.getElementById('createElectionBtn')
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
});

function initializeApp() {
    loadElections();
    loadAnnouncements();
    loadPoll();
    loadElectionStatus();
    loadWinners();
    checkAuthentication();
}

function setupEventListeners() {
    // Navigation
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', handleNavigation);
    });
    
    // User controls
    elements.loginBtn.addEventListener('click', () => showModal(elements.loginModal));
    elements.registerBtn.addEventListener('click', () => showModal(elements.registerModal));
    elements.logoutBtn.addEventListener('click', handleLogout);
    
    // Modal close buttons
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', closeModals);
    });
    
    // Forms
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('registerForm').addEventListener('submit', handleRegister);
    document.getElementById('createElectionForm').addEventListener('submit', handleCreateElection);
    
    // Voting
    elements.submitVoteBtn.addEventListener('click', handleVoteSubmit);
    elements.submitPollVoteBtn.addEventListener('click', handlePollVoteSubmit);
    
    // Admin buttons
    elements.createElectionBtn.addEventListener('click', () => showModal(elements.createElectionModal));
    
    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target.classList.contains('voting-modal')) {
            closeModals();
        }
    });
}

function handleNavigation(e) {
    e.preventDefault();
    // Remove active class from all nav items
    document.querySelectorAll('nav li').forEach(li => li.classList.remove('active'));
    // Add active class to clicked item
    e.target.closest('li').classList.add('active');
    
    // Handle different navigation items
    const target = e.target.className.replace('nav-', '');
    switch(target) {
        case 'dashboard':
            // Already on dashboard
            break;
        case 'elections':
            showElectionsView();
            break;
        case 'results':
            showResultsView();
            break;
        case 'admin':
            showAdminView();
            break;
        case 'faq':
            showFAQView();
            break;
    }
}

function loadElections() {
    elements.electionList.innerHTML = '';
    
    const activeElections = sampleElections.filter(election => election.status === 'active');
    
    if (activeElections.length === 0) {
        elements.electionList.innerHTML = '<div class="election-card"><p>No active elections at the moment. Check back later!</p></div>';
        return;
    }
    
    activeElections.forEach(election => {
        const electionCard = document.createElement('div');
        electionCard.className = 'election-card';
        
        // Check if user is logged in
        const isLoggedIn = currentUser !== null;
        const voteButton = isLoggedIn ? 
            `<button class="vote-btn" onclick="openVotingModal(${election.id})">
                <i class="fas fa-vote-yea"></i> Vote Now
            </button>` :
            `<button class="vote-btn" onclick="showLoginRequired()" disabled>
                <i class="fas fa-lock"></i> Login to Vote
            </button>`;
        
        electionCard.innerHTML = `
            <h3>${election.title}</h3>
            <div class="election-meta">
                <span><i class="fas fa-briefcase"></i> ${election.position}</span>
                <span><i class="fas fa-calendar"></i> Ends: ${formatDate(election.endDate)}</span>
                ${election.department ? `<span><i class="fas fa-building"></i> ${election.department} Department</span>` : ''}
            </div>
            <p>${election.description}</p>
            ${voteButton}
        `;
        elements.electionList.appendChild(electionCard);
    });
    
    // Add login required message if user is not logged in
    if (!currentUser) {
        const loginMessage = document.createElement('div');
        loginMessage.className = 'login-required-message';
        loginMessage.innerHTML = `
            <h4><i class="fas fa-exclamation-triangle"></i> Authentication Required</h4>
            <p>Please register and login to participate in elections and polls.</p>
            <div class="login-required-buttons">
                <button class="submit-vote-btn" onclick="showModal(elements.registerModal)">
                    <i class="fas fa-user-plus"></i> Register Now
                </button>
                <button class="submit-vote-btn" onclick="showModal(elements.loginModal)">
                    <i class="fas fa-sign-in-alt"></i> Login
                </button>
            </div>
        `;
        elements.electionList.parentNode.insertBefore(loginMessage, elements.electionList);
    }
}

function loadElectionStatus() {
    // Upcoming elections
    const upcomingElections = sampleElections.filter(election => election.status === 'upcoming');
    elements.upcomingElections.innerHTML = '';
    
    if (upcomingElections.length === 0) {
        elements.upcomingElections.innerHTML = '<div class="status-item"><p>No upcoming elections scheduled.</p></div>';
    } else {
        upcomingElections.forEach(election => {
            const statusItem = document.createElement('div');
            statusItem.className = 'status-item';
            statusItem.innerHTML = `
                <h4>${election.title}</h4>
                <p><i class="fas fa-calendar"></i> Starts: ${formatDate(election.startDate)}</p>
                <p><i class="fas fa-briefcase"></i> ${election.position}</p>
            `;
            elements.upcomingElections.appendChild(statusItem);
        });
    }
    
    // Finished elections
    const finishedElections = sampleElections.filter(election => election.status === 'finished');
    elements.finishedElections.innerHTML = '';
    
    if (finishedElections.length === 0) {
        elements.finishedElections.innerHTML = '<div class="status-item"><p>No finished elections to display.</p></div>';
    } else {
        finishedElections.forEach(election => {
            const statusItem = document.createElement('div');
            statusItem.className = 'status-item';
            statusItem.innerHTML = `
                <h4>${election.title}</h4>
                <p><i class="fas fa-briefcase"></i> ${election.position}</p>
                <p><i class="fas fa-users"></i> ${election.voted.length} votes cast</p>
            `;
            elements.finishedElections.appendChild(statusItem);
        });
    }
}

function loadWinners() {
    elements.winnersList.innerHTML = '';
    
    const finishedElections = sampleElections.filter(election => election.status === 'finished');
    
    if (finishedElections.length === 0) {
        elements.winnersList.innerHTML = '<div class="winner-item"><p>No winners to display yet.</p></div>';
        return;
    }
    
    finishedElections.forEach(election => {
        // Find winner (candidate with most votes)
        const winner = election.candidates.reduce((prev, current) => 
            (prev.votes > current.votes) ? prev : current
        );
        
        const winnerItem = document.createElement('div');
        winnerItem.className = 'winner-item';
        winnerItem.innerHTML = `
            <h4>${election.position}</h4>
            <p><strong>Winner:</strong> ${winner.name}</p>
            <p><strong>Department:</strong> ${winner.department}</p>
            <p><strong>Votes:</strong> ${winner.votes}</p>
        `;
        elements.winnersList.appendChild(winnerItem);
    });
}

function loadAnnouncements() {
    elements.announcementList.innerHTML = '';
    
    sampleAnnouncements.forEach(announcement => {
        const announcementElement = document.createElement('div');
        announcementElement.className = 'announcement';
        announcementElement.innerHTML = `
            <h4>${announcement.title}</h4>
            <p>${announcement.content}</p>
            <small><i class="fas fa-calendar"></i> Posted on: ${announcement.date}</small>
        `;
        elements.announcementList.appendChild(announcementElement);
    });
}

function loadPoll() {
    elements.pollOptions.innerHTML = '';
    
    const isLoggedIn = currentUser !== null;
    
    samplePoll.options.forEach(option => {
        const optionElement = document.createElement('div');
        optionElement.className = 'poll-option';
        if (!isLoggedIn) {
            optionElement.style.cursor = 'not-allowed';
            optionElement.style.opacity = '0.6';
        }
        optionElement.innerHTML = `
            <input type="radio" name="pollOption" value="${option.id}" 
                   onchange="${isLoggedIn ? `selectPollOption(${option.id})` : 'showLoginRequired()'}" 
                   ${!isLoggedIn ? 'disabled' : ''}>
            <label>${option.text}</label>
        `;
        elements.pollOptions.appendChild(optionElement);
    });
    
    // Update poll submit button
    elements.submitPollVoteBtn.disabled = !isLoggedIn;
    if (!isLoggedIn) {
        elements.submitPollVoteBtn.innerHTML = '<i class="fas fa-lock"></i> Login to Vote';
        elements.submitPollVoteBtn.onclick = showLoginRequired;
    } else {
        elements.submitPollVoteBtn.innerHTML = '<i class="fas fa-check-circle"></i> Submit Poll Vote';
        elements.submitPollVoteBtn.onclick = handlePollVoteSubmit;
    }
}

function openVotingModal(electionId) {
    if (!currentUser) {
        showLoginRequired();
        return;
    }
    
    selectedElection = sampleElections.find(e => e.id === electionId);
    selectedCandidate = null;
    
    if (!selectedElection) return;
    
    document.getElementById('electionDescription').textContent = selectedElection.description;
    
    const candidateList = document.getElementById('candidateList');
    candidateList.innerHTML = '';
    
    selectedElection.candidates.forEach(candidate => {
        const candidateOption = document.createElement('div');
        candidateOption.className = 'candidate-option';
        candidateOption.innerHTML = `
            <h4>${candidate.name}</h4>
            <p><i class="fas fa-building"></i> Department: ${candidate.department}</p>
        `;
        candidateOption.addEventListener('click', () => selectCandidate(candidate.id, candidateOption));
        candidateList.appendChild(candidateOption);
    });
    
    elements.submitVoteBtn.disabled = true;
    showModal(elements.votingModal);
}

function selectCandidate(candidateId, element) {
    if (!currentUser) {
        showLoginRequired();
        return;
    }
    
    selectedCandidate = candidateId;
    
    // Remove selected class from all options
    document.querySelectorAll('.candidate-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    
    // Add selected class to clicked option
    element.classList.add('selected');
    
    // Enable submit button
    elements.submitVoteBtn.disabled = false;
}

function selectPollOption(optionId) {
    if (!currentUser) {
        showLoginRequired();
        return;
    }
    
    selectedPollOption = optionId;
}

function handleVoteSubmit() {
    if (!currentUser) {
        showLoginRequired();
        return;
    }
    
    if (!selectedCandidate || !selectedElection) return;
    
    // Find the selected candidate
    const candidate = selectedElection.candidates.find(c => c.id === selectedCandidate);
    
    if (!candidate) return;
    
    // Record the vote
    candidate.votes++;
    selectedElection.voted.push(currentUser.name);
    
    // Show success notification with candidate name
    showNotification(`Successfully voted for ${candidate.name} in "${selectedElection.title}"`, 'success');
    
    closeModals();
    
    // Disable voting for this election
    const voteBtn = document.querySelector(`.election-card button[onclick="openVotingModal(${selectedElection.id})"]`);
    if (voteBtn) {
        voteBtn.disabled = true;
        voteBtn.innerHTML = '<i class="fas fa-check"></i> Vote Submitted';
        voteBtn.style.background = '#4caf50';
    }
    
    // Refresh winners list
    loadWinners();
}

function handlePollVoteSubmit() {
    if (!currentUser) {
        showLoginRequired();
        return;
    }
    
    if (!selectedPollOption) {
        showNotification('Please select an option before voting.', 'error');
        return;
    }
    
    // Update poll results
    const option = samplePoll.options.find(opt => opt.id === selectedPollOption);
    if (option) {
        option.votes++;
        showNotification(`Poll vote submitted for "${option.text}"!`, 'success');
    }
    
    selectedPollOption = null;
    
    // Clear selection
    document.querySelectorAll('input[name="pollOption"]').forEach(radio => {
        radio.checked = false;
    });
}

function showLoginRequired() {
    showNotification('Please register and login to participate in voting.', 'warning');
    showModal(elements.loginModal);
}

function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Simple authentication (in real app, this would be server-side)
    if (username && password) {
        currentUser = {
            name: username === 'admin' ? 'Administrator' : 'Student User',
            isAdmin: username === 'admin',
            studentId: username === 'admin' ? 'ADMIN001' : '23UEC047'
        };
        
        checkAuthentication();
        closeModals();
        showNotification('Login successful! You can now participate in voting.', 'success');
        
        // Reload elections and poll to update voting buttons
        loadElections();
        loadPoll();
    } else {
        showNotification('Please enter both username and password.', 'error');
    }
}

function handleRegister(e) {
    e.preventDefault();
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;
    
    if (password !== confirmPassword) {
        showNotification('Passwords do not match!', 'error');
        return;
    }
    
    // In a real application, this would send registration data to the server
    showNotification('Successfully registered! Please login to participate in voting.', 'success');
    closeModals();
    
    // Clear form
    document.getElementById('registerForm').reset();
    
    // Show login modal after successful registration
    setTimeout(() => {
        showModal(elements.loginModal);
    }, 1000);
}

function handleCreateElection(e) {
    e.preventDefault();
    
    // In a real application, this would send the election data to the server
    showNotification('Election created successfully!', 'success');
    closeModals();
    
    // Clear form
    document.getElementById('createElectionForm').reset();
}

function handleLogout() {
    currentUser = null;
    checkAuthentication();
    showNotification('Logged out successfully!', 'success');
    
    // Reload elections and poll to update voting buttons
    loadElections();
    loadPoll();
}

function checkAuthentication() {
    if (currentUser) {
        elements.userInfo.style.display = 'flex';
        elements.userName.textContent = currentUser.name;
        elements.loginBtn.style.display = 'none';
        elements.registerBtn.style.display = 'none';
        elements.logoutBtn.style.display = 'block';
        
        // Show admin panel if user is admin
        if (currentUser.isAdmin) {
            elements.navAdmin.style.display = 'block';
            elements.adminPanel.style.display = 'block';
        } else {
            elements.navAdmin.style.display = 'none';
            elements.adminPanel.style.display = 'none';
        }
    } else {
        elements.userInfo.style.display = 'none';
        elements.loginBtn.style.display = 'block';
        elements.registerBtn.style.display = 'block';
        elements.logoutBtn.style.display = 'none';
        elements.navAdmin.style.display = 'none';
        elements.adminPanel.style.display = 'none';
    }
}

function showModal(modal) {
    modal.style.display = 'block';
    // Scroll to top when modal opens
    modal.scrollTop = 0;
}

function closeModals() {
    document.querySelectorAll('.voting-modal').forEach(modal => {
        modal.style.display = 'none';
    });
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function showNotification(message, type = 'success') {
    const notificationContainer = document.getElementById('notificationContainer');
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 
                      type === 'error' ? 'fa-exclamation-triangle' : 
                      'fa-exclamation-circle'}"></i>
        ${message}
    `;
    
    notificationContainer.appendChild(notification);
    
    // Remove notification after 5 seconds
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// Placeholder functions for different views
function showElectionsView() {
    alert('Elections view would be shown here');
}

function showResultsView() {
    alert('Results view would be shown here');
}

function showAdminView() {
    alert('Admin view would be shown here');
}

function showFAQView() {
    alert('FAQ view would be shown here');

}
