import React, { Component } from "react";
import axios from "axios";
import Loader from "../assets/images/loader.gif";


class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: "",
      results: {},
      loading: false,
      message: "",
      totalResults: 0,
      totalPages: 0,
      currentPageNo: 0,
    };
    this.cancel = "";
  }

  getPageCount = (total, denominator) => {
    const divisible = 0 === total % denominator;
    const valueToBeAdded = divisible ? 0 : 1;
    return Math.floor(total / denominator) + valueToBeAdded;
  };

  fetchSearchResults = (updatedPageNo = "", query) => {
    const pageNumber = updatedPageNo ? `&page=${updatedPageNo}` : "";
    const searchUrl = `https://localhost:44335/api/products/search/?search=${query}${pageNumber}`;
    //const searchUrl = `https://www.yapikrediyayinlari.com.tr/ajax?cek=xml&q=${query}${pageNumber}`;

    if (this.cancel) {
      this.cancel.cancel();
    }
    this.cancel = axios.CancelToken.source();

    axios
      .get(searchUrl, {
        cancelToken: this.cancel.token,
      })
      .then((response) => {
        const total = response.data.total;
        const totalPagesCount = this.getPageCount(total, 20);
        const resultNotFoundMsg = !response.data.hits.length
          ? "There are no more search results.Please try a new search"
          : "";
        this.setState({
          results: response.data.hits,
          message: resultNotFoundMsg,
          totalResults: total,
          totalPages: totalPagesCount,
          CurrentPageNo: updatedPageNo,
          loading: false,
        });
      })
      .catch((error) => {
        if (axios.isCancel(error) || error) {
          this.setState({
            loading: false,
            message: "Failed to fetch the data.Please check network",
          });
        }
      });
  };

  handleOnInputChange = (event) => {
    const query = event.target.value;
    if (!query) {
      this.setState({ query, result: {}, message: "" });
    } else {
      this.setState({ query: query, loading: true, message: "" }, () => {
        this.fetchSearchResults(1, query);
      });
    }
  };
 



  renderSearchResults = () => {
    const { results } = this.state;
    if (Object.keys(results).length && results.length) {
      return (
        <div className="results-container">
          {results.map((result) => {
            return (
              <a
                key={result.id}
                href={result.previewURL}
                className="result-item"
              >
                <h6 className="image-username">{result.user}</h6>
                <div className="image-wrapper">
                  <img
                    className="image"
                    src={result.previewURL}
                    alt={`${result.username} images`}
                  />
                </div>
              </a>
            );
          })}
        </div>
      );
    }
  };
  render() {
    const { query, loading, message } = this.state;
    
    return (
      <div className="container">
        {/*Heading*/}
        <h2 className="heading">Live Search: React Aplication</h2>
        {/*Search Input*/}
        <label className="search-label" htmlFor="search-input">
          <input
            type="text"
            name="query"
            value={query}
            id="search-input"
            placeholder="Search..."
            onChange={this.handleOnInputChange}
          />
          <i className="ionicons icon ion-ios-search" />
        </label>
        {/* Error MEssage */}
        {message && <p className>{message}</p>}
        {/*Loader */}
        <img
          src={Loader}
          className={`search-loading ${loading ? "show" : "hide"}`}
          alt="loader"
        />
      
       
        {/*Result*/}
        {this.renderSearchResults()}

       
      </div>
    );
  }
}
export default Search;
