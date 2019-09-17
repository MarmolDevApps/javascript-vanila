/******************************************
 *
 *
 * @author  Cristian Mármol Calle            
 *
 * 
 ******************************************/



const modulomovie = {
	//Initialize params

	Title: null,
	Year: null,
	Rated:null,
	Released:null,
	Runtime:null,
	Genre:null,
	Director:null,
	Writer:null,
	Actors:null,
	Plot:null,
	Language:null,
	Country:null,
	Awards:null,
	Metascore:null,
	imdbRating:null,
	imdbVotes:null,
	DVD:null,
	BoxOffice:null,
	Production:null,
	Website:null,
	Poster:null,

	api_key:null,



	URL_MOVIE: 'http://www.omdbapi.com/?apikey=',

	init: function () {
		//Reading DOM
		this.ready();

		//Checking api access LocalStorage
		let api_key = localStorage.getItem("api_key");;
		this.api_key = api_key;
		
		if(api_key!=null){
			jsUtils.setApiKey(api_key);

			//Check param id movie from url
			this._checkInfoMovie();
		}else{
			jsUtils.logOut();
		}
	},
	ready: function () {
		this.Title = $('#Title');
		this.Year = $('#Year');
		this.Rated = $('#Rated');	
		this.Released = $('#Released');	
		this.Runtime = $('#Runtime');
		this.Genre = $('#Genre');	
		this.Director = $('#Director');
		this.Writer = $('#Writer');	
		this.Actors = $('#Actors');	
		this.Plot = $('#Plot');	
		this.Language = $('#Language');		
		this.Country = $('#Country');	
		this.Awards = $('#Awards');	
		this.Metascore = $('#Metascore');	
		this.imdbRating = $('#imdbRating');
		this.imdbVotes = $('#imdbVotes');		
		this.DVD = $('#DVD');		
		this.BoxOffice = $('#BoxOffice');		
		this.Production = $('#Production');		
		this.Website = $('#Website');
		this.Poster = $('#Poster');
		
	
	},


	_checkInfoMovie: function (){
		let url_string = window.location.href;
		let url = new URL(url_string);
		let id = url.searchParams.get("id");

		//If id doesn't exist return to index
		if(id== null)
			window.location.replace("index.html");

		//Checking movieinfo in LocalStorage to optimize API calls
		let moviesinfo = JSON.parse(localStorage.getItem("moviesinfo"));
		if(moviesinfo == null)
				moviesinfo = [];

		let movieinfo = jsUtils.findMovie(moviesinfo, id);
		if(movieinfo!=undefined){
			//This movie info has been called before, so you get movieinfo from localstorage
			this._renderMovie(movieinfo, false);
		}else{
			//This movie hasn't located in LocalStorage. You need to request it by API
			this._apiGetInfoMovieById(id);
		}
		
	},

	_apiGetInfoMovieById: function (id) {	

	
		let url = `${this.URL_MOVIE}${this.api_key}&i=${id}`;
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
		.then((movieinfo) => { 
			if(movieinfo.Response == "True"){
				//Render the movie info from json Object response
				this._renderMovie(movieinfo, true);

			}else{
				alert("The id of the movie does not exist");
			}
			
		})
		.catch((err) => {
			//Error Network and Logout
			console.log(err);
			this._logOut();
		});
		
		
	},

	_renderMovie: function (movieinfo, api_call) {
		if(api_call){
			//Always save movieinfo when api_call is true to optimize api calls
			let moviesinfo = JSON.parse(localStorage.getItem("moviesinfo"));
			if(moviesinfo == null)
				moviesinfo = [];

			moviesinfo.push(movieinfo);
			localStorage.setItem("moviesinfo", JSON.stringify(moviesinfo));
		}

		//Set All info of Movie 
		this.Title.html(movieinfo.Title);
		this.Year.html(movieinfo.Year);
		this.Rated.html(movieinfo.Rated);	
		this.Released.html(movieinfo.Released);
		this.Runtime.html(movieinfo.Runtime);
		this.Genre.html(movieinfo.Genre);
		this.Director.html(movieinfo.Director);
		this.Writer.html(movieinfo.Writer);	
		this.Actors.html(movieinfo.Actors);	
		this.Plot.html(movieinfo.Plot);	
		this.Language.html(movieinfo.Language);		
		this.Country.html(movieinfo.Country);	
		this.Awards.html(movieinfo.Awards);	
		this.Metascore.html(movieinfo.Metascore);	
		this.imdbRating.html(movieinfo.imdbRating);
		this.imdbVotes.html(movieinfo.imdbVotes);		
		this.DVD.html(movieinfo.DVD);		
		this.BoxOffice.html(movieinfo.BoxOffice);		
		this.Production.html(movieinfo.Production);		
		this.Website.html(movieinfo.Website);
		let poster =movieinfo.Poster;
		if(poster == "N/A")
				poster = "img/no-photo.jpg";

		this.Poster.attr("src", poster);

	},



};

// Initialize module
modulomovie.init();
