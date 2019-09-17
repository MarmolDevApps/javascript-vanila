/******************************************
 *
 *
 * @author   Cristian Mármol Calle     
 * @github   https://github.com/MarmolDevApps/javascript-vanila       
 * @version  1.0.0     
 *
 * 
 ******************************************/



const modulomain = {
	//Initialize params

	inSearch:null,
	btnSearch:null,
	listmovies:null,
	cont_movies_loaded: 0,

	
	URL_SEARCH: 'http://www.omdbapi.com/?apikey=',

	init: function () {
		//Reading DOM
		this.ready();
		//Load Events DOM
		this.addEvents();

		//Checking api access LocalStorage
		let api_key = localStorage.getItem("api_key");
		if(api_key!=null){
			jsUtils.setApiKey(api_key);
		}

	},


	ready: function () {
		this.inSearch = $('#inSearch');	
		this.btnSearch = $('#btnSearch');	
		this.listmovies = $('#listmovies');
	
	},

	addEvents: function () {
		
		this.btnSearch.on('click', () => this._searchAction());
		this.inSearch.on('keydown', function(e) {
			if (e.which == 13) {
				//Enter
				e.preventDefault();
				this._searchAction()
			}
		}.bind(this));

		//IconFav Click
		this.listmovies.on('click', '.fav-movie', (e) => jsUtils.actionFav(e));

		//Title Movie Click
		this.listmovies.on('click', '.title-movie-link', (e) => jsUtils.openMovie(e));
		
	},
	


	_searchAction: function (page = 1) {
		
		if(page ==1){
			//Initialize params when page is 1
			jsUtils.movies = [];
			this.cont_movies_loaded = 0;
			this.listmovies.html("");
		}

		let api_key = localStorage.getItem("api_key");
		let text_search = this.inSearch.val();
		if(text_search==""){
			alert("You should write something to search movies");
			return;
		}
			

		let url = `${this.URL_SEARCH}${api_key}&s=${text_search}&page=${page}&type=movie`;
		fetch(url)
		.then((response) => {
			if (response.ok) { 
				//Return json
				return response.json();
			} else {
				//Throw error Api
				alert("Api key incorrect. Try another");
				if(response.status)
				throw Error (`${response.statusText}. Status code: ${response.status}`);

				
			}			
		})
		.then((data) => { 
			if(data.Response == "True"){
				//Checking pagination API
				//acumulate movies loaded in a counter
				this.cont_movies_loaded+= data.Search.length;

				//If the counter is less than totalresults. Iterate api call with ++page
				if(data.totalResults> this.cont_movies_loaded)
					this._searchAction(++page);

				//While render the movies from json array response
				jsUtils.renderMovies(data.Search, "listmovies");

			}else{
				alert("No movies found");
			}
			
		})
		.catch((err) => {
			//Error Network and Logout
			console.log(err);
			jsUtils.logOut();
		});

		
	},

	
};

// Initialize module
modulomain.init();
