/******************************************
 *
 *
 * @author  Cristian Mármol Calle            
 *
 * 
 ******************************************/


const modulofavorites = {

	listmoviesfav:null,

	api_key:null,




	init: function () {
		//Reading DOM
		this.ready();

		//Load Events DOM
		this.addEvents();

		//Checking api access LocalStorage
		let api_key = localStorage.getItem("api_key");;
		this.api_key = api_key;
		
		if(api_key!=null){
			jsUtils.setApiKey(api_key);

			this._loadMoviesFav();
		}else{
			jsUtils.logOut();
		}
	},
	ready: function () {
		this.listmoviesfav = $('#listmoviesfav');
		
	
	},

	addEvents: function () {
		//IconFav Click
		this.listmoviesfav.on('click', '.fav-movie', (e) => jsUtils.actionFav(e));

		//Title Movie Click
		this.listmoviesfav.on('click', '.title-movie-link', (e) => jsUtils.openMovie(e));
		
	},


	_loadMoviesFav: function (){
		
		let moviesfav = JSON.parse(localStorage.getItem("moviesfav"));
		if(moviesfav == null)
				moviesfav = [];
		
		//If moviesfav length is 0 return to index
		if(moviesfav.length==0)
			window.location.replace("index.html");


		//Render movies from LocalStorage
		jsUtils.renderMovies(moviesfav, "listmoviesfav");
		
	},

};

// Initialize module
modulofavorites.init();
