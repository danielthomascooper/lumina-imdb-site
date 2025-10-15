// function for use in sorting strings
const compareStrings = (a, b) => {
    if (a < b) return -1;
    if (a > b) return 1;

    return 0;
}

// sort on last name, algorithm from https://stackoverflow.com/a/24173306
const compare = (a, b) => {
    const splitA = a.split(" ");
    const splitB = b.split(" ");
    const lastA = splitA[splitA.length - 1];
    const lastB = splitB[splitB.length - 1];

    return lastA === lastB ?
        compareStrings(splitA[0], splitB[0]) :
        compareStrings(lastA, lastB);
}

// globals to hold current state
let user_list = [];
let current_user = "";

// update the current user and hide user options if necessary
function updateCurrentUser(new_user) {
    current_user = new_user;
    document.getElementById("current-user").innerHTML = "<b>Current User: </b>" + current_user;
    let hidden_list_items = document.getElementsByClassName("selected-user-option");

    for (let i = 0; i < hidden_list_items.length; i++) {
        if (new_user == "") {
            hidden_list_items.item(i).classList.remove("show");
        } else {
            hidden_list_items.item(i).classList.add("show");
        }
    }
}

// refresh the user list from database and sort alphabetically by last name
function updateUserList() {
    fetch('http://localhost:3000/movies?userlist')
        .then((res) => res.json())
        .then((res) => {
            user_list = [];
            res.data.forEach(element => {
                var full_name = element.firstName + " " + element.lastName
                user_list.push(full_name)
            });
            user_list.sort(compare);
        });
}

// update user list by default at the start
updateUserList();

// add a person's name to the dropdown
function addListElement(name) {
    listContainer = document.getElementById("usernameList")

    var el = document.createElement("li");
    el.textContent = name;

    el.addEventListener("click", function () {
        updateCurrentUser(name);
        document.getElementById("userSearch").value = "";
        document.getElementById("userDropdown").classList.remove("show");

        fetchFavouriteMovies(name);
    });

    listContainer.appendChild(el);
}

// add users alphabetically to dropdown
function updateDropdown() {
    updateUserList();
    searchSubstring = document.getElementById("userSearch").value.toLowerCase();

    listContainer = document.getElementById("usernameList")
    listContainer.innerHTML = "";

    if (searchSubstring == "") {
        document.getElementById("userDropdown").classList.remove("show");
        return
    }
    document.getElementById("userDropdown").classList.add("show");

    filteredUsers = user_list.filter(element => element.toLowerCase().includes(searchSubstring));
    filteredUsers.forEach(addListElement);
}