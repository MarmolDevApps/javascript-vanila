const jsUtils = (function ($) {
    const jsUtils = {
       
       

        movies: [],

        URL_ACCESS_TEST: 'http://www.omdbapi.com/?i=tt3896198&apikey=',

        
        _ready: function () {
            this.btnAccess = $('#btnAccess');
            this.btnLogout = $('#btnLogout');
            this.inApiKey = $('#inApiKey');	
            this.linkFavorites = $('#linkFavorites');
            this.welcomeView = $('#welcomeview');
            this.accessView = $('#accessview');
		    
            
        },

        _addEvents: function () {	
            
            this.btnAccess.on('click', () => this.checkAccess());
            this.inApiKey.on('keydown', function(e) {
                if (e.which == 13) {
                    //Enter
                    e.preventDefault();
                    this.checkAccess()
                }
            }.bind(this));
            this.btnLogout.on('click', () => this.logOut());
            
        },


        // Métodos públicos
        init: function () {
            // lectura de DOM
            this._ready();

            //add Common Events
            this._addEvents();

            let api_key = localStorage.getItem("api_key");
            if(api_key!=null){
                this._checkFavoritesTab();
                this.accessView.show();
            }else{
                this.welcomeView.show();
            }

            
        },

        /**
         * @description This method verifies the favorite tab / link and if moviesfav array is empty, access is disabled
         */
        _checkFavoritesTab: function () {
            let moviesfav = JSON.parse(localStorage.getItem("moviesfav"));
            if(moviesfav == null)
                moviesfav = [];

            if(moviesfav.length>0)
                this.enableFavoritesTab();

        },

        enableFavoritesTab: function () {
                this.linkFavorites.removeClass("disabled");
        },
        disableFavoritesTab: function () {
                this.linkFavorites.addClass("disabled");
        },


        /**
         * @description This method checking access with the api key saved in the localStorage. Call to api with a example url to find a movie
         */
        checkAccess: function () {
            let api_key = this.inApiKey.val();
            if(api_key==""){
                alert("You should write some text in api key input");
                return;
            }
            let url = `${this.URL_ACCESS_TEST}${api_key}`;
            fetch(url)
            .then((response) => {
                console.log(response);
                if (response.ok) { 
                    this._saveApiKey(api_key);
                } else {
                    this.welcomeView.show();
    
                alert("Api key incorrect. Try another");
                    if(response.status)
                    throw Error (`${response.statusText}. Status code: ${response.status}`);
    
                    
                }			
            })
            .catch((err) => {
                console.log(err);
                return false;
            });
    
            
        },
        
        /**
         * @param {string} api_key from omdbapi
         * @description This method save the api key in the localstorage
         */
        _saveApiKey: function (api_key) {
            this.setApiKey(api_key);
            localStorage.setItem("api_key", api_key);
        },

        /**
         * @param {string} api_key from omdbapi
         * @description This method set the api key in the input access and hide/show button to control the session
         */
        setApiKey: function(api_key) {
            this.inApiKey.val(api_key);
            this.btnAccess.hide();
            this.btnLogout.show();
            this.inApiKey.prop("disabled", true);
            this.welcomeView.hide();
            this.accessView.show();

        },


        logOut: function () {
            localStorage.clear();
            window.location.replace('index.html');	
        },


        /**
         * @param {Array} moviesarray array of movies
         * @param {string} id id of movie to search
         * @description This method return a movie if it exists in the array with the id filter
         */
        findMovie: function(moviesarray, id){
            return moviesarray.find( movie => movie.imdbID === id );
                
            
        },
        
        /**
         * @param {Array} moviesarray array of movies
         * @param {string} id id of movie to search
         * @description This method return the index of movie if it exists in the array with the id filter
         */
        findIndexMovie: function(moviesarray, id){
            return moviesarray.findIndex( movie => movie.imdbID === id );                
        },


        /**
         * @param {Event} e Event to control the DOM element that interacts
         * @description This method control favorites movies arrays 
         */
        actionFav: function(e) {
            let moviesfav = JSON.parse(localStorage.getItem("moviesfav"));
            if(moviesfav == null)
                moviesfav = [];
            
            //Get id_movie to checking if exists in fav movies arrays
            let id_movie = $(e.currentTarget).closest(".card").data("id");
    
            let moviefav = this.findMovie(moviesfav, id_movie);
            
            //Obtain heart dom of element that clicked to control the state
            let iHeart = $(e.currentTarget).find("i");
            if(moviefav!= undefined){
                //It's a favorite movie. Clear Favorite action

                let indexRemove = this.findIndexMovie(moviesfav, id_movie);

                //Remove from fav movies array
                moviesfav.splice(indexRemove, 1);
    
                iHeart.removeClass("fa-heart").addClass("fa-heart-o");
    
            }else{
                //Favorite action. It isn't a favorite movie
                
                let movie = this.findMovie(this.movies, id_movie);

                //Add movie to fav movies array
                moviesfav.push(movie);
    
    
                iHeart.removeClass("fa-heart-o").addClass("fa-heart");
            }


            //Check array fav movies to control tab/link
            if(moviesfav.length>0){
                this.enableFavoritesTab();
            }else{
                this.disableFavoritesTab();
            }
    
            localStorage.setItem("moviesfav", JSON.stringify(moviesfav));		
            
        },


        /**
         * @param {Event} e Event to control the DOM element that interacts
         * @description This method open page of movie with the id_movie param in the url.
         */
        openMovie: function(e) {

            let id_movie = $(e.currentTarget).closest(".card").data("id");
            location.href =`movie.html?id=${id_movie}`;
            
        },


        /**
         * @param {Array} data Array of movies to render in the list
         * @param {string} idDOM id element DOM to append the html result
         * @description This method render movies from an array to a list.
         */
        renderMovies: function (data, idDOM) {
            let html = "";
            let moviesfav = JSON.parse(localStorage.getItem("moviesfav"));
            if(moviesfav == null)
                moviesfav = [];

            //Loop of movies
            data.forEach(function (movie, index) {
                //Declarate vars of movie to append in card movie html .
                let poster = movie.Poster;
                let title = movie.Title;
                let year = movie.Year;
                let id= movie.imdbID;

                //Checking if this movie is favorite or not (bool)
                let fav= this.findMovie(moviesfav, id)!=undefined ? true:false;
                movie.fav = fav;
                this.movies.push(movie);

                let iconfav = fav ? "fa-heart" : "fa-heart-o";		
                
                //Default photo if poster movie is N/A
                if(poster == "N/A")
                    poster = "img/no-photo.jpg";
    
                html +=`
                <div class="col-sm-4">
                    <div class="card" data-id="${id}">
                        <div class="card-header">
                            <img class="card-img" src="${poster}" alt="Card image">
                        </div>
                        <div class="card-body">
                        <h1 class="card-title"><a class="title-movie-link">${title}</a></h1>
                            <div class="container">
                                <div class="row">
                                    <div class="col-12 metadata">Year: ${year}</div>
                                </div>
                            </div>
                            <a class="fav-movie"  target="new">
                                <i class="fa ${iconfav}" aria-hidden="true"></i>
                            </a>
                        </div>
                    </div>
                </div>`;
    
                
    
                //We need bind this object to call methods outside of loop.
            }.bind(this));
    
    
            $(html).appendTo(`#${idDOM}`);
        },

    };
    jsUtils.init();

    return jsUtils;
})(jQuery);
