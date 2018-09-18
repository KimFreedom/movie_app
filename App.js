import React, { Component } from "react";
import InfiniteScroll from 'react-infinite-scroll-component';
import "./App.css";
import Movie from "./Movie";

class App extends Component {
  // Render: componentWillMount() -> render() -> componentDidMount()
  // Update componentWillReceiveProps() -> shouldComponentUpdate() -> componentWillUpdate() -> render() -> componentDidUpdate()

  state = {};

  componentDidMount() {
    this.page_no = 1;
    this._getMovies();
  }

  _renderMovies = () => {
    const movies = this.state.movies.map(movie => {
      return (
        <Movie
          title={movie.title_english}
          poster={movie.large_cover_image}
          key={movie.id}
          genres={movie.genres}
          synopsis={movie.synopsis}
          year={movie.year}
          rating={movie.rating}
        />
      );
    });
    return movies;
  };

  _getMovies = async () => {
    const movies = await this._callApi();
    this.setState({
      movies
    });
  };

  _getMoreMovies = async () => {
    const new_movies = await this._callNextScrollDataApi();
    this.setState({
      movies: this.state.movies.concat(new_movies)
    });
  };

  _callApi = () => {
    return fetch(
      "https://yts.am/api/v2/list_movies.json?sort_by=download_count"
    )
      .then(result => result.json())
      .then(json => json.data.movies)
      .catch(err => console.log(err));
  };

  _callNextScrollDataApi = () => {
    this.page_no++;
    console.log(this.page_no + ' page fetch start');
    return fetch(      
      "https://yts.am/api/v2/list_movies.json?sort_by=download_count&page=" + this.page_no
    )
      .then(potato => potato.json())
      .then(json => json.data.movies)
      .catch(err => console.log(err));
  };

  render() {
    const { movies } = this.state;
    return (
      
      <div className={movies ? "App" : "App--loading"}>
        <InfiniteScroll 
          dataLength={movies ? movies.length : 20}
          next={this._getMoreMovies}
          hasMore={true}
          loader={<h4>Loading...</h4>}
          endMessage={
            <p style={{textAlign: 'center'}}>
              <b>Yay! You have seen it all</b>
            </p>
          }>
          {movies ? this._renderMovies() : "Loading"}
        </InfiniteScroll>
      </div>

    );
  }
}

export default App;
