// get user to provide first and last names and create a user for them
function addUser() {
    // validate chosen names
    var firstName = ""
    while (firstName == "") {
        firstName=prompt("Please enter your first name","").trim();
        if (firstName == null) {
            return
        }
        if (firstName.includes(" ")) {
            alert("Names cannot contain spaces");
            firstName = ""
        }
        
    }
    firstName = firstName[0].toUpperCase() + firstName.slice(1)

    var lastName = ""
    while (lastName == "") {
        lastName=prompt("Please enter your last name","").trim();
        if (lastName == null) {
            return
        }
        if (lastName.includes(" ")) {
            alert("Names cannot contain spaces");
            lastName = ""
        }
    }
    lastName = lastName[0].toUpperCase() + lastName.slice(1)

    // allow only unique names
    updateUserList();
    if (user_list.includes(firstName + " " + lastName)) {
        alert("User already exists with this name, either select or remove user.");
        return
    }
    
    // send add user requrest to POST api route
    fetch("http://localhost:3000/movies", {
        method: "POST",
        body: JSON.stringify({
            operation: "add-user",
            firstName: firstName,
            lastName: lastName,
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
        .then((response) => response.json())
        .then((json) => console.log(json))
        .then(updateUserList());
}

function removeUser() {
    if (confirm("Are you sure you want to delete " + current_user + ", this CANNOT be undone!") == false) {
        return
    }

    // send remove user requrest to POST api route
    var names = current_user.split(" ");
    fetch("http://localhost:3000/movies", {
        method: "POST",
        body: JSON.stringify({
            operation: "remove-user",
            firstName: names[0],
            lastName: names[1],
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
        .then((response) => response.json())
        .then((json) => console.log(json))
        .then(updateUserList())
        .then(updateCurrentUser(""));
}
