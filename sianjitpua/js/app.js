var TRENDING = [];
var AIR = [];
var INDEX;

document.addEventListener("DOMContentLoaded", async function() {
    document.getElementById('top').addEventListener('click', function(){
        window.location.href = 'http://localhost:5000/';
    });
    document.getElementById('bottom').addEventListener('click', function(){
        window.location.href = 'http://localhost:5000/search';
    });

    if (document.getElementById('searchButton'))
    {
        document.getElementById('searchButton').addEventListener('click', function(){
            let keywordValue = document.getElementById("keyword").value;
            let categoryValue = document.getElementById("category").value;

            if (keywordValue == "" || categoryValue == "")
            {
                alert("Please enter valid values");
            }
            else
            {
                //make API call and display search results
                displayResults(keywordValue, categoryValue);
            }
        });
    }

    if (document.getElementById('clearButton'))
    {
        document.getElementById('clearButton').addEventListener('click', function(){
            document.getElementById("keyword").value = "";
            document.getElementById("category").selectedIndex = 0;

            clearResults();
        });
    }

    if (document.getElementById('modalClose'))
    {
        document.getElementById('modalClose').addEventListener('click', function(){
            document.getElementById("modal").style.display = "none";
        });
        document.getElementById('modalClose').addEventListener('mouseover', function(){
            document.getElementById("modal").style.cursor = "pointer";
        });
    }

    if (document.getElementById("trendingImage"))
    {
        // get slideshow data
        const xhttpRep = new XMLHttpRequest();
        xhttpRep.onload = function(e) {
            const response = JSON.parse(xhttpRep.responseText);

            TRENDING = response.trending;
            AIR = response.air;

            INDEX = 0;

            slideshow();

            setInterval(slideshow, 5000);
        };
        xhttpRep.open("GET", '/get_data', false);
        xhttpRep.send();
    }
});

function displayResults(keywordValue, categoryValue)
{

    let searchResults = document.getElementById("searchResults");
    document.getElementById("showingResults").style.display = "none";
    document.getElementById("noResults").style.display = "none";

    while (searchResults.hasChildNodes())
    {
        searchResults.removeChild(searchResults.firstChild);
    }

    if (categoryValue == "movies")
    {
        searchMovies(keywordValue);
    }
    else if (categoryValue == "tv")
    {
        searchTV(keywordValue);
    }
    else if (categoryValue == "both")
    {
        searchBoth(keywordValue);
    }
}

function searchMovies(keyword)
{
    // Making a GET request for the reports associated with the specific user:
    const xhttpRep = new XMLHttpRequest();
    xhttpRep.onload = function(e) {
        // Handling response from the API for GET reports:
        const response = JSON.parse(xhttpRep.responseText);

        if (typeof response == "undefined" || response.length == 0)
        {
            document.getElementById("noResults").style.display = "block";
        }
        else
        {
            //display results
            document.getElementById("showingResults").style.display = "block";
            generateSearchContent(response);
        }
    };
    xhttpRep.open("GET", "/get_movies?query=" + encodeURIComponent(keyword), false);
    xhttpRep.send();
}

function searchTV(keyword)
{
    // Making a GET request for the reports associated with the specific user:
    const xhttpRep = new XMLHttpRequest();
    xhttpRep.onload = function(e) {
        // Handling response from the API for GET reports:
        const response = JSON.parse(xhttpRep.responseText);

        if (typeof response == "undefined" || response.length == 0)
        {
            document.getElementById("noResults").style.display = "block";
        }
        else
        {
            //display results
            document.getElementById("showingResults").style.display = "block";
            generateSearchContent(response);
        }
    };
    xhttpRep.open("GET", "/get_shows?query=" + encodeURIComponent(keyword), false);
    xhttpRep.send();
}

function searchBoth(keyword)
{
    // Making a GET request for the reports associated with the specific user:
    const xhttpRep = new XMLHttpRequest();
    xhttpRep.onload = function(e) {
        // Handling response from the API for GET reports:
        const response = JSON.parse(xhttpRep.responseText);

        if (typeof response == "undefined" || response.length == 0)
        {
            document.getElementById("noResults").style.display = "block";
        }
        else
        {
            //display results
            document.getElementById("showingResults").style.display = "block";
            generateSearchContent(response);
        }
    };
    xhttpRep.open("GET", "/get_both?query=" + encodeURIComponent(keyword), false);
    xhttpRep.send();
}

function clearResults()
{
    document.getElementById("showingResults").style.display = "none";
    document.getElementById("noResults").style.display = "none";

    let results = document.getElementById("searchResults");

    while (results.hasChildNodes())
    {
        results.removeChild(results.firstChild);
    }
}

function slideshow()
{
    if (TRENDING[INDEX].backdrop_path)
    {
        document.getElementById("trendingImage").src = 'https://image.tmdb.org/t/p/w780/' + TRENDING[INDEX].backdrop_path;
    }
    else
    {
        document.getElementById("trendingImage").src = "static/img/movie-placeholder.jpg"
    }
    
    if (AIR[INDEX].backdrop_path)
    {
        document.getElementById("airImage").src = 'https://image.tmdb.org/t/p/w780/' + AIR[INDEX].backdrop_path;
    }
    else
    {
        document.getElementById("airImage").src = "static/img/movie-placeholder.jpg"
    }

    document.getElementById("trendingTitle").innerText = TRENDING[INDEX].title;
    document.getElementById("airTitle").innerText = AIR[INDEX].name;

    INDEX = (INDEX + 1) % 5;
}

function generateSearchContent(results)
{
    let searchResults = document.getElementById("searchResults");

    while (searchResults.hasChildNodes())
    {
        searchResults.removeChild(searchResults.firstChild);
    }

    for (var i = 0; i < results.length; i++)
    {
        let panel = document.createElement("div");
        panel.setAttribute("class", "searchResultsPanel");

        let src = "";
        if (results[i].posterPath)
        {
            src = 'https://image.tmdb.org/t/p/w185/' + results[i].posterPath;
        }
        else
        {
            src = "static/img/movie-placeholder.jpg";
        }

        let imageDiv = document.createElement("div");
        let image = document.createElement("img");
        image.style.height = "280px";
        image.src = src;
        imageDiv.setAttribute("class", "searchResultsImage");
        imageDiv.appendChild(image);

        let textDiv = document.createElement("div");
        textDiv.setAttribute("class", "searchResultsText");
        let title = document.createElement("div");
        title.setAttribute("class", "searchResultsTextTitle");
        if (results[i].title)
        {
            title.innerText = results[i].title;
        }
        else
        {
            title.innerText = results[i].name;
        }
        
        textDiv.appendChild(title);

        //second row
        let secondRow = document.createElement("div");
        secondRow.setAttribute("class", "searchResultsTextSecondRow");
        let year = "";

        if (results[i].releaseDate)
        {
            year = results[i].releaseDate.split("-")[0];
        }
        else
        {
            year = results[i].firstAirDate.split("-")[0];
        }
        let genres = results[i].genres;
        secondRow.innerText = year + " | " + genres;
        textDiv.appendChild(secondRow);

        //third row
        let thirdRow = document.createElement("div");
        thirdRow.setAttribute("class", "searchResultsTextSecondRow");
        let rating = results[i].voteAverage / 2;
        let votes = results[i].voteCount;
        let left = document.createElement("a");
        left.innerText = "★" + rating + "/5 ";
        left.style.color = "red";
        let right = document.createElement("a");
        right.innerText = "   " + votes + " votes";
        thirdRow.appendChild(left);
        thirdRow.appendChild(right);
        thirdRow.style.marginBottom = "20px";
        textDiv.appendChild(thirdRow);

        //content
        let fourthRow = document.createElement("div");
        let words = results[i].overview.split(" ");
        let firstLine = words.splice(0, 13);
        let firstString = "";
        for (var j = 0; j < firstLine.length; j++)
        {
            firstString += firstLine[j] + " ";
        }
        fourthRow.innerHTML = firstString;
        textDiv.appendChild(fourthRow);
        let fifthRow = document.createElement("div");
        let secondLine = words.splice(0, 13);
        let secondString = "";
        for (var j = 0; j < secondLine.length; j++)
        {
            secondString += secondLine[j] + " ";
        }
        fifthRow.innerHTML = secondString;
        textDiv.appendChild(fifthRow);
        let sixthRow = document.createElement("div");
        let thirdLine = words.splice(0, 13);
        let thirdString = "";
        for (var j = 0; j < thirdLine.length; j++)
        {
            thirdString += thirdLine[j] + " ";
        }
        sixthRow.innerHTML = thirdString;
        textDiv.appendChild(sixthRow);

        let button = document.createElement("button");
        button.innerText = "Show more";
        button.style.backgroundColor = "red";
        button.style.color = "white";
        button.style.marginTop = "20px";
        let ID = results[i].id;
        button.addEventListener('click', function(){
            displayModal(ID);
        });
        textDiv.appendChild(button);

        imageDiv.style.marginRight = "20px";

        panel.appendChild(imageDiv);
        panel.appendChild(textDiv);

        if (i == results.length - 1)
        {
            panel.style.marginBottom = "100px";
        }

        searchResults.appendChild(panel);
    }

    document.getElementById("sideBar").style.height = document.getElementById("searchResults").style.height;
}

function displayModal(ID)
{
    let route = "";

    if (ID.toString().length == 4 || ID.toString().length == 5)
    {
        route = "/get_show_details?id=" + encodeURIComponent(ID);
    }
    else if (ID.toString().length == 6)
    {
        route = "/get_movie_details?id=" + encodeURIComponent(ID);
    }

    document.getElementById("modal").style.display = "block";
    
    // Making a GET request for the reports associated with the specific user:
    const xhttpRep = new XMLHttpRequest();
    xhttpRep.onload = function(e) {
        // Handling response from the API for GET reports:
        const response = JSON.parse(xhttpRep.responseText);

        let imageLink1 = "";
        if (response.backdropPath)
        {
            imageLink1 = 'https://image.tmdb.org/t/p/w780/' + response.backdropPath;
        }
        else
        {
            imageLink1 = "static/img/movie-placeholder.jpg"
        }
        
        document.getElementById("detailsImage").src = imageLink1;
        document.getElementById("detailsImage").style.height = "400px";
        document.getElementById("detailsImage").style.width = "95%";

        let title = "";
        if (response.title)
        {
            title = response.title
        }
        else
        {
            title = response.name;
        }

        document.getElementById("detailsTitle").innerText = title;
        document.getElementById("detailsTitle").style.fontSize = "22px";
        document.getElementById("detailsFirstRow").style.marginTop = "20px";
        document.getElementById("detailsFirstRow").style.marginBottom = "20px";

        document.getElementById("detailsInfoIcon").innerText = " ⓘ";
        document.getElementById("detailsInfoIcon").style.color = "red";
        let ID = response.id;
        document.getElementById("detailsInfoIcon").addEventListener('click', function(){
            if (ID.toString().length == 6)
            {
                window.location.href = "https://www.themoviedb.org/movie/" + ID;
            }
            else
            {
                window.location.href = "https://www.themoviedb.org/tv/" + ID;
            }
        });
        document.getElementById("detailsInfoIcon").addEventListener('mouseover', function(){
            document.getElementById("detailsInfoIcon").style.cursor = "pointer";
        });

        //second row
        let secondRow = document.getElementById("detailsSecondRow");
        let year = "";

        if (response.releaseDate)
        {
            year = response.releaseDate.split("-")[0];
        }
        else
        {
            year = response.firstAirDate.split("-")[0];
        }
        let genres = response.genres;
        secondRow.innerText = year + " | " + genres;
        secondRow.style.marginBottom = "20px";

        //third row
        let rating = response.voteAverage / 2;
        let votes = response.voteCount;
        let left = document.getElementById("left");
        left.innerText = "★" + rating + "/5 ";
        left.style.color = "red";
        let right = document.getElementById("right");
        right.innerText = "   " + votes + " votes";
        let thirdRow = document.getElementById("detailsThirdRow");
        thirdRow.style.marginBottom = "30px";

        document.getElementById("detailsOverview").innerText = response.overview;
        document.getElementById("detailsOverview").style.marginBottom = "20px";

        document.getElementById("detailsSpokenLanguages").innerText = "Spoken languages: " + response.spokenLanguages;
        document.getElementById("detailsSpokenLanguages").style.marginBottom = "50px";

        document.getElementById("cast").style.fontSize = "22px";

        for (var k = 0; k < 8; k++)
        {
            document.getElementById("detailsCast" + (k + 1).toString()).style.display = "none";
        }

        //cast
        for (var k = 0; k < response.cast.length; k++)
        {
            let imageLink = "";
            if (response.cast[k].profilePath)
            {
                imageLink = 'https://image.tmdb.org/t/p/w185/' + response.cast[k].profilePath;
            }
            else
            {
                imageLink = "static/img/person-placeholder.png"
            }
            document.getElementById("detailsCastImage" + (k + 1).toString()).src = imageLink;
            document.getElementById("detailsCastName" + (k + 1).toString()).innerText = response.cast[k].name;
            document.getElementById("detailsCastName" + (k + 1).toString()).style.fontWeight = "550";
            document.getElementById("detailsCastRole" + (k + 1).toString()).innerText = response.cast[k].character;
            document.getElementById("detailsCast" + (k + 1).toString()).style.display = "block";
        }

        for (var k = 0; k < 5; k++)
        {
            document.getElementById("review" + (k + 1).toString()).style.display = "none";
        }

        //reviews
        for (var k = 0; k < response.reviews.length; k++)
        {
            let date = response.reviews[k].createdAt;
            let dateString = "";
            let dates = date.split("-");
            let year = dates[0];
            let month = dates[1];
            let day = dates[2].split("T")[0];
            dateString = month + "/" + day + "/" + year;

            document.getElementById("review" + (k + 1).toString()).style.display = "block";

            document.getElementById("reviewUsername" + (k + 1).toString()).innerText = response.reviews[k].username + " ";
            document.getElementById("reviewUsername" + (k + 1).toString()).style.fontWeight = "550";
            document.getElementById("reviewDate" + (k + 1).toString()).innerText = " on " + dateString;
            
            let rating = response.reviews[k].rating;

            if (rating)
            {
                document.getElementById("reviewRating" + (k + 1).toString()).innerText = "★" + (rating / 2).toString() + "/5 ";
                document.getElementById("reviewRating" + (k + 1).toString()).style.color = "red";
            }

            document.getElementById("reviewContent" + (k + 1).toString()).innerText = response.reviews[k].content;
            document.getElementById("reviewContent" + (k + 1).toString()).style.height = "60px";
            document.getElementById("reviewContent" + (k + 1).toString()).style.overflow = "hidden";

            document.getElementById("review" + (k + 1).toString()).style.marginBottom = "30px";
        }

        document.getElementById("reviews").style.fontSize = "22px";

    };
    xhttpRep.open("GET", route, false);
    xhttpRep.send();
}
