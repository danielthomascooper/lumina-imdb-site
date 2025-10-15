// fetch movie info from omdb api and add to table
async function addMovieTableRow(table, movie_code) {
    var table_row = document.createElement("tr");
    table_row.id = movie_code;

    // get movie info from api
    var movie_info = await getMovieInfo(movie_code);

    console.log(movie_info);

    // set up poster cell
    var poster_cell = document.createElement("td");
    var poster_link = document.createElement("a");
    var poster_image = document.createElement("img");
    poster_image.src = movie_info["Poster"];
    poster_image.style.height = "150px";
    poster_image.alt = "Poster for " + movie_info["Title"] + "."
    poster_link.href = "https://www.imdb.com/title/" + movie_code;
    poster_link.target = "_blank";
    poster_link.appendChild(poster_image);
    poster_cell.appendChild(poster_link);
    table_row.appendChild(poster_cell);

    // regular text attributes to populate with
    var attributes_to_get = ["Title", "Year", "Plot"];
    attributes_to_get.forEach(function (attribute) {
        var attribute_cell = document.createElement("td");
        attribute_cell.innerHTML = movie_info[attribute];
        table_row.appendChild(attribute_cell);
    })

    // add remove movie option to remove from list
    remove_movie_icon = document.createElement("img");
    remove_movie_icon.src = "/assets/minus-square.svg"
    remove_movie_icon.style.cursor = "pointer";
    remove_movie_icon.style.height = "40px";
    remove_movie_icon.addEventListener("click", function () {
        removeMovie(movie_code);
    })
    remove_movie_cell = document.createElement("td");
    remove_movie_cell.appendChild(remove_movie_icon);
    table_row.appendChild(remove_movie_cell);

    // add finished row to table
    table.appendChild(table_row);
}

// create and populate table 
function fillMovieTable(movie_codes) {
    console.log(movie_codes);
    table = document.getElementById("movieTable");
    table.innerHTML = '';

    // catch if user has no movies in their favourite movies
    if ((movie_codes[0] == "") || (movie_codes.length == 0)) {
        return
    }

    // add header row to table
    var table_headers = ["Poster", "Movie Title", "Release Year", "Plot Summary", "Remove movie"];
    var table_header_row = document.createElement("tr");
    table_headers.forEach(function (headerName) {
        header_cell = document.createElement("th");
        header_cell.innerHTML = headerName;
        table_header_row.appendChild(header_cell);
    })
    table.appendChild(table_header_row);

    movie_codes.forEach(function (movie_code) {addMovieTableRow(table, movie_code)});
}

// get favourite movies for a user and populate table
function fetchFavouriteMovies(user) {
    fetch('http://localhost:3000/movies?user=' + user.replace(" ", "_"))
    .then((res) => res.json())
    .then((res) => {
        let favourite_movies = res.data[0].favourite_movies.split(",")
        fillMovieTable(favourite_movies);
    });   
}

// get info from omdb api about movie code
async function getMovieInfo(code) {
    return fetch('http://localhost:3000/imdb?code=' + code).then((res) => res.json());   
}

function validateIMDBCode(code) {
    var re = new RegExp(/^tt\d+$/);
    return re.test(code);
}

// get current movie list, add new movie to end, then update visuals
function addMovie(code="") {
    while (code == "") {
        code=prompt("Please enter chosen code","");
        if (code == null) {
            return
        }

        if (!validateIMDBCode(code)) {
            code = "";
            continue
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

function addMovieByIMDB() {
    var imdb_url = "";
    while (imdb_url == "") {
        imdb_url=prompt("Please enter IMDB URL","");

        if (imdb_url == null) {
            return
        }

        try {
            var parsed_url = new URL(imdb_url);
            console.log(parsed_url);

            if (parsed_url.hostname != "www.imdb.com") {
                console.warn("Invalid hostname");
                imdb_url = "";
                continue
            }
            
            var code = parsed_url.pathname.split("/")[2];
            if (!validateIMDBCode(code)) {
                console.warn("Invalid code");
                imdb_url = "";
                continue
            }

            addMovie(code);
            
        } catch (error) {
            imdb_url = "";
            continue
        }
    }

    
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