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

// get current movie list, add new movie to end, then update visuals
function addMovie() {
    var code = ""
    while (code == "") {
        code=prompt("Please enter chosen code","");
        if (code == null) {
            return
        }
    }

    // fetch current movie list
    fetch('http://localhost:3000/movies?user=' + current_user.replace(" ", "_"))
    .then((res) => res.json())
    .then((res) => res.data[0].favourite_movies.split(","))
    .then((favourite_movies) => {
        if (favourite_movies.includes(code)) {
            alert("This is already in your favourite movies!");
            return
        }

        if (favourite_movies[0] == "") {
            favourite_movies = [code];
        } else {
            favourite_movies.push(code);
        }

        var names = current_user.split(" ");

        // send update to movie list
        fetch("http://localhost:3000/movies", {
        method: "POST",
        body: JSON.stringify({
            operation: "update-list",
            firstName: names[0],
            lastName: names[1],
            movielist: favourite_movies.join()
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
        .then((response) => response.json())
        .then((json) => console.log(json));
        return favourite_movies
    })
    .then((favourite_movies) => fillMovieTable(favourite_movies));
}

function removeMovie(code) {
    // get current movie list for user
    fetch('http://localhost:3000/movies?user=' + current_user.replace(" ", "_"))
    .then((res) => res.json())
    .then((res) => res.data[0].favourite_movies.split(","))
    .then((favourite_movies) => {
        if (!favourite_movies.includes(code)) {
            alert("This is not in your movie list?");
            return
        }

        const index = favourite_movies.indexOf(code);
        if (index > -1) {
            favourite_movies.splice(index, 1);
        }

        var names = current_user.split(" ");

        // send updated movie list to database
        fetch("http://localhost:3000/movies", {
        method: "POST",
        body: JSON.stringify({
            operation: "update-list",
            firstName: names[0],
            lastName: names[1],
            movielist: favourite_movies.join()
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
        .then((response) => response.json())
        .then((json) => console.log(json));
        return favourite_movies
    })
    .then((favourite_movies) => fillMovieTable(favourite_movies));
}