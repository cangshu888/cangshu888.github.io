from flask import Flask
from flask import request
import requests
import json

app = Flask(__name__)

_SESSION = requests.session()
GENRES = []
 
@app.route("/")
def hello():
    getGenres()
    return app.send_static_file('index.html')

@app.route("/search")
def search():
    getGenres()
    return app.send_static_file('search.html')

@app.route('/get_data', methods=["GET"])
def get_data():
    r = _SESSION.get('https://api.themoviedb.org/3/trending/movie/week?api_key=97588ddc4a26e3091152aa0c9a40de22')
    temp = json.loads(r.text)
    results = temp['results'][0:5]
    trending = []
    for x in results:
        obj = {
            "title": x["title"],
            "backdrop_path": x["backdrop_path"],
            "release_date": x["release_date"]
        }
        trending.append(obj)

    r2 = _SESSION.get('https://api.themoviedb.org/3/tv/airing_today?api_key=97588ddc4a26e3091152aa0c9a40de22')
    temp2 = json.loads(r2.text)
    results2 = temp2['results'][0:5]
    air = []
    for x2 in results2:
        obj = {
            "name": x2["name"],
            "backdrop_path": x2["backdrop_path"],
            "first_air_date": x2["first_air_date"]
        }
        air.append(obj)

    output = {
        "trending": trending,
        "air": air
    }

    return json.dumps(output)

@app.route('/get_movies', methods=["GET"])
def getMovies():
    print("movies")
    param = request.args.get("query")
    link = re.sub(' ', '%20', param)
    r = _SESSION.get('https://api.themoviedb.org/3/search/movie?api_key=97588ddc4a26e3091152aa0c9a40de22&language=en-US&query=' + link + '&page=1&include_adult=false')
    temp = json.loads(r.text)
    results = temp['results']

    movies = []
    for i in range(0,len(results)):
        x = results[i]
        genreString = ""
        for genreID in x["genre_ids"]:
            for genre in GENRES:
                if genreID == genre["id"]:
                    genreString += genre["name"] + ", "
        genreString = genreString[:-2]

        obj = {
            "id": x["id"],
            "title": x["title"],
            "overview": x["overview"],
            "posterPath": x["poster_path"],
            "releaseDate": x["release_date"],
            "voteAverage": x["vote_average"],
            "voteCount": x["vote_count"],
            "genres": genreString
        }
        movies.append(obj)

    return json.dumps(movies[0:min(10, len(movies))])

@app.route('/get_shows', methods=["GET"])
def getShows():
    print("shows")
    param = request.args.get("query")
    link = re.sub(' ', '%20', param)
    r = _SESSION.get('https://api.themoviedb.org/3/search/tv?api_key=97588ddc4a26e3091152aa0c9a40de22&language=en-US&query=' + link + '&page=1&include_adult=false')
    temp = json.loads(r.text)
    results = temp['results']
    shows = []
    for i in range(0,len(results)):
        x = results[i]
        genreString = ""
        for genreID in x["genre_ids"]:
            for genre in GENRES:
                if genreID == genre["id"]:
                    genreString += genre["name"] + ", "
        genreString = genreString[:-2]
        obj = {
            "id": x["id"],
            "name": x["name"],
            "overview": x["overview"],
            "posterPath": x["poster_path"],
            "firstAirDate": x["first_air_date"],
            "voteAverage": x["vote_average"],
            "voteCount": x["vote_count"],
            "genres": genreString
        }
        shows.append(obj)

    return json.dumps(shows[0:min(10, len(shows))])

@app.route('/get_both', methods=["GET"])
def getBoth():
    param = request.args.get("query")
    link = re.sub(' ', '%20', param)
    print(link)
    r = _SESSION.get('https://api.themoviedb.org/3/search/multi?api_key=97588ddc4a26e3091152aa0c9a40de22&language=en-US&query=' + link + '&page=1&include_adult=false')
    temp = json.loads(r.text)
    print(temp)
    results = temp['results']
    multi = []
    for i in range(0,len(results)):
        x = results[i]
        genreString = ""
        for genreID in x["genre_ids"]:
            for genre in GENRES:
                if genreID == genre["id"]:
                    genreString += genre["name"] + ", "
        genreString = genreString[:-2]

        if x["media_type"] == "show":
            obj = {
                "id": x["id"],
                "name": x["name"],
                "overview": x["overview"],
                "posterPath": x["poster_path"],
                "firstAirDate": x["first_air_date"],
                "voteAverage": x["vote_average"],
                "voteCount": x["vote_count"],
                "genres": genreString
            }
            multi.append(obj)
        elif x["media_type"] == "movie":
            obj = {
                "id": x["id"],
                "title": x["title"],
                "overview": x["overview"],
                "posterPath": x["poster_path"],
                "releaseDate": x["release_date"] ,
                "voteAverage": x["vote_average"],
                "voteCount": x["vote_count"],
                "genres": genreString
            }
            multi.append(obj)
        
    return json.dumps(multi[0:min(10, len(multi))])

@app.route('/get_movie_details', methods=["GET"])
def getMovieDetails():
    movieID = request.args.get("id")
    r = _SESSION.get('https://api.themoviedb.org/3/movie/' + str(movieID) + '?api_key=97588ddc4a26e3091152aa0c9a40de22&language=en-US')
    temp = json.loads(r.text)
    x = temp
    genreString = ""
    for genreObj in x["genres"]:
        for genre in GENRES:
            if genreObj["name"] == genre["name"]:
                genreString += genre["name"] + ", "
    genreString = genreString[:-2]

    languagesString = ""
    for language in x["spoken_languages"]:
        languagesString += language["english_name"] + ", "
    languagesString = languagesString[:-2]

    cast = getMovieCredits(movieID)
    reviews = getMovieReviews(movieID)

    obj = {
        "id": x["id"],
        "title": x["title"],
        "runtime": x["runtime"],
        "posterPath": x["poster_path"],
        "releaseDate": x["release_date"],
        "voteAverage": x["vote_average"],
        "voteCount": x["vote_count"],
        "genres": genreString,
        "spokenLanguages": languagesString,
        "backdropPath": x["backdrop_path"],
        "overview": x["overview"],
        "cast": cast,
        "reviews": reviews
    }

    return json.dumps(obj)

def getMovieCredits(movieID):
    r = _SESSION.get('https://api.themoviedb.org/3/movie/' + str(movieID) + '/credits?api_key=97588ddc4a26e3091152aa0c9a40de22&language=en-US')
    temp = json.loads(r.text)
    length = min(8, len(temp["cast"]))
    actors = []
    for i in range(0, length):
        x = temp["cast"][i]
        obj = {
            "name": x["name"],
            "profilePath": x["profile_path"],
            "character": x["character"]
        }
        actors.append(obj)

    return actors

def getMovieReviews(movieID):
    r = _SESSION.get('https://api.themoviedb.org/3/movie/' + str(movieID) + '/reviews?api_key=97588ddc4a26e3091152aa0c9a40de22&language=en-US')
    temp = json.loads(r.text)
    length = min(5, len(temp["results"]))
    reviews = []
    for i in range(0, length):
        x = temp["results"][i]
        obj = {
            "username": x["author_details"]["username"],
            "content": x["content"],
            "rating": x["author_details"]["rating"],
            "createdAt": x["created_at"]
        }
        reviews.append(obj)

    return reviews

@app.route('/get_show_details', methods=["GET"])
def getShowDetails():
    showID = request.args.get("id")
    r = _SESSION.get('https://api.themoviedb.org/3/tv/' + str(showID) + '?api_key=97588ddc4a26e3091152aa0c9a40de22&language=en-US')
    temp = json.loads(r.text)
    x = temp

    genreString = ""
    for genreObj in x["genres"]:
        for genre in GENRES:
            if genreObj["name"] == genre["name"]:
                genreString += genre["name"] + ", "
    genreString = genreString[:-2]

    languagesString = ""
    for language in x["spoken_languages"]:
        languagesString += language["english_name"] + ", "
    languagesString = languagesString[:-2]

    cast = getShowCredits(showID)
    reviews = getShowReviews(showID)

    obj = {
        "id": x["id"],
        "name": x["name"],
        "episodeRunTime": x["episode_run_time"],
        "firstAirDate": x["first_air_date"],
        "overview": x["overview"],
        "number_of_seasons": x["number_of_seasons"],
        "posterPath": x["poster_path"],
        "voteAverage": x["vote_average"],
        "voteCount": x["vote_count"],
        "genres": genreString,
        "spokenLanguages": languagesString,
        "backdropPath": x["backdrop_path"],
        "cast": cast,
        "reviews": reviews
    }

    return json.dumps(obj)

def getShowCredits(showID):
    r = _SESSION.get('https://api.themoviedb.org/3/tv/' + str(showID) + '/credits?api_key=97588ddc4a26e3091152aa0c9a40de22&language=en-US')
    temp = json.loads(r.text)
    length = min(8, len(temp["cast"]))
    actors = []
    for i in range(0, length):
        x = temp["cast"][i]
        obj = {
            "name": x["name"],
            "profilePath": x["profile_path"],
            "character": x["character"]
        }
        actors.append(obj)

    return actors

def getShowReviews(showID):
    r = _SESSION.get('https://api.themoviedb.org/3/tv/' + str(showID) + '/reviews?api_key=97588ddc4a26e3091152aa0c9a40de22&language=en-US')
    temp = json.loads(r.text)
    print(temp)
    length = min(5, len(temp["results"]))
    reviews = []
    for i in range(0, length):
        x = temp["results"][i]
        obj = {
            "username": x["author_details"]["username"],
            "content": x["content"],
            "rating": x["author_details"]["rating"],
            "createdAt": x["created_at"]
        }
        reviews.append(obj)

    return reviews

def getGenres():
    global GENRES
    r = _SESSION.get('https://api.themoviedb.org/3/genre/movie/list?api_key=97588ddc4a26e3091152aa0c9a40de22&language=en-US')
    response = json.loads(r.text)
    GENRES = response["genres"]
 
if __name__ == "__main__":
    app.run()