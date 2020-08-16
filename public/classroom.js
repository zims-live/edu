// Client ID and API key from the Developer Console
var CLIENT_ID = '1018724970822-u6qsmn0hhq0k0sanvqd715kl4el1vtjg.apps.googleusercontent.com';
var API_KEY = 'AIzaSyDYs7YSKkHp88-fYM7ayxR5N-wteWi0ZYo';

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/classroom/v1/rest"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
//var SCOPES = "https://www.googleapis.com/auth/classroom.courses.readonly";
const SCOPES = 'https://www.googleapis.com/auth/classroom.courses https://www.googleapis.com/auth/classroom.announcements https://www.googleapis.com/auth/classroom.rosters.readonly https://www.googleapis.com/auth/classroom.rosters';

var authorizeButton = document.getElementById('authorize_button');
var signoutButton = document.getElementById('signout_button');

/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
    gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
    }).then(function () {
        // Listen for sign-in state changes.
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

        // Handle the initial sign-in state.
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        authorizeButton.onclick = handleAuthClick;
        signoutButton.onclick = handleSignoutClick;
    }, function(error) {
        console.log(JSON.stringify(error, null, 2));
    });
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        authorizeButton.style.display = 'none';
        signoutButton.style.display = 'block';
        listCourses();
    } else {
        authorizeButton.style.display = 'block';
        signoutButton.style.display = 'none';
    }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(event) {
    gapi.auth2.getAuthInstance().signIn();
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick(event) {
    gapi.auth2.getAuthInstance().signOut();
}

/**
 * Append a pre element to the body containing the given message
 * as its text node. Used to display the results of the API call.
 *
 * @param {string} message Text to be placed in pre element.
 */
function showCourse(course) {
    var pre = document.getElementById('title-header');
    var courseBtn = document.createElement('button');
    courseBtn.innerText = course.name;
    courseBtn.addEventListener('click', () => roleInCourse(course), false);
    pre.appendChild(courseBtn);
}


function listAnnouncements(course) {
    gapi.client.classroom.courses.announcements.list({
        "courseId": course.id
    }).then(function(response) {
        // Handle the results here (response.result has the parsed body).
        response.data.announcements.forEach(announcement => {
            console.log("\t" + course.name + " Announcement: ", announcement.text);
        });
    }, function(err) { console.error("Execute error", err); });
}

function listCourses() {
    gapi.client.classroom.courses.list({
        pageSize: 10,
    }).then(response  => {
        const courses = response.result.courses;
        if (courses && courses.length) {
            console.log('Available lectures: ');
            courses.forEach((course, index) => {
                console.log((index + 1) + `.${course.name}`);
                showCourse(course);
            });
        } else {
            console.log('No courses found.');
        }
    });
}

function listTeachers(course) {
    gapi.client.classroom.courses.teachers.list({
        "courseId": course.id
    }).then(function(response) {
        response.data.teachers.forEach(teacher => {
            console.log("\t" + course.name + " Lecturer: ", teacher.profile.name);
        });
    }, function(err) { console.error("Execute error", err); });
}

function getUserProfile() {
    gapi.client.classroom.userProfiles.get({
        "userId": "me"
    }).then(function(response) {
        console.log("User profile: ", response.data);
    }, function(err) { console.error("Execute error", err); });
}

function roleInCourse(course) {
    gapi.client.classroom.courses.teachers.get({
        "courseId": course.id,
        "userId": "me"
    }).then(function(response) {
        console.log("Role: Teacher");
        myroom = Number(course.id);
        document.getElementById('start').click();
    }, function(err) { 
        console.log("Role: Student"); 
        myroom = Number(course.id);
        document.getElementById('start').click();
    });
}

