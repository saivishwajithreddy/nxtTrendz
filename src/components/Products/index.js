import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {Link} from 'react-router-dom'
import {BsSearch} from 'react-icons/bs'

import Header from '../Header'

const categoryOptions = [
  {name: 'Clothing', categoryId: '1'},
  {name: 'Electronics', categoryId: '2'},
  {name: 'Appliances', categoryId: '3'},
  {name: 'Grocery', categoryId: '4'},
  {name: 'Toys', categoryId: '5'},
]

const sortbyOptions = [
  {optionId: 'PRICE_HIGH', displayText: 'Price (High-Low)'},
  {optionId: 'PRICE_LOW', displayText: 'Price (Low-High)'},
]

const ratingsList = [
  {
    ratingId: '4',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-four-stars-img.png',
  },
  {
    ratingId: '3',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-three-stars-img.png',
  },
  {
    ratingId: '2',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-two-stars-img.png',
  },
  {
    ratingId: '1',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-one-star-img.png',
  },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const ProductCard = ({productData}) => {
  const {title, brand, imageUrl, rating, price, id} = productData
  return (
    <Link to={`/product-details/${id}`} className="link-item">
      <li className="product-item">
        <img src={imageUrl} alt="product" className="thumbnail" />
        <h1 className="title">{title}</h1>
        <p className="brand">by {brand}</p>
        <div className="product-details">
          <p className="price">Rs {price}/-</p>
          <div className="rating-container">
            <p className="rating">{rating}</p>
            <img
              src="https://assets.ccbp.in/frontend/react-js/star-img.png"
              alt="star"
              className="star"
            />
          </div>
        </div>
      </li>
    </Link>
  )
}

class Products extends Component {
  state = {
    productsList: [],
    apiStatus: apiStatusConstants.initial,
    activeOptionId: sortbyOptions[0].optionId,
    activeCategoryId: '',
    searchInput: '',
    activeRatingId: '',
  }

  componentDidMount() {
    this.getProducts()
  }

  getProducts = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const {
      activeOptionId,
      activeCategoryId,
      searchInput,
      activeRatingId,
    } = this.state
    const apiUrl = `https://apis.ccbp.in/products?sort_by=${activeOptionId}&category=${activeCategoryId}&title_search=${searchInput}&rating=${activeRatingId}`
    const options = {
      headers: {Authorization: `Bearer ${jwtToken}`},
      method: 'GET',
    }
    try {
      const response = await fetch(apiUrl, options)
      if (response.ok) {
        const fetchedData = await response.json()
        const updatedData = fetchedData.products.map(product => ({
          title: product.title,
          brand: product.brand,
          price: product.price,
          id: product.id,
          imageUrl: product.image_url,
          rating: product.rating,
        }))
        this.setState({
          productsList: updatedData,
          apiStatus: apiStatusConstants.success,
        })
      } else {
        this.setState({apiStatus: apiStatusConstants.failure})
      }
    } catch (error) {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  changeSortby = event => {
    this.setState({activeOptionId: event.target.value}, this.getProducts)
  }

  changeCategory = activeCategoryId => {
    this.setState({activeCategoryId}, this.getProducts)
  }

  changeRating = activeRatingId => {
    this.setState({activeRatingId}, this.getProducts)
  }

  changeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  enterSearchInput = event => {
    if (event.key === 'Enter') {
      this.getProducts()
    }
  }

  clearFilters = () => {
    this.setState(
      {searchInput: '', activeCategoryId: '', activeRatingId: ''},
      this.getProducts,
    )
  }

  renderFiltersGroup = () => {
    const {searchInput, activeCategoryId, activeRatingId} = this.state
    return (
      <div className="filters-group-container">
        <div className="search-input-container">
          <input
            type="search"
            className="search-input"
            placeholder="Search"
            value={searchInput}
            onChange={this.changeSearchInput}
            onKeyDown={this.enterSearchInput}
          />
          <BsSearch className="search-icon" />
        </div>
        <h1 className="category-heading">Category</h1>
        <ul className="categories-list">
          {categoryOptions.map(category => (
            <li
              className="category-item"
              key={category.categoryId}
              onClick={() => this.changeCategory(category.categoryId)}
            >
              <p
                className={
                  activeCategoryId === category.categoryId
                    ? 'category-name active-category-name'
                    : 'category-name'
                }
              >
                {category.name}
              </p>
            </li>
          ))}
        </ul>
        <h1 className="rating-heading">Rating</h1>
        <ul className="ratings-list">
          {ratingsList.map(rating => (
            <li
              className="rating-item"
              key={rating.ratingId}
              onClick={() => this.changeRating(rating.ratingId)}
            >
              <img
                src={rating.imageUrl}
                alt={`rating ${rating.ratingId}`}
                className="rating-img"
              />
              <p
                className={
                  activeRatingId === rating.ratingId
                    ? 'and-up active-category-name'
                    : 'and-up'
                }
              >
                & up
              </p>
            </li>
          ))}
        </ul>
        <button
          type="button"
          className="clear-filters-btn"
          onClick={this.clearFilters}
        >
          Clear Filters
        </button>
      </div>
    )
  }

  renderLoadingView = () => (
    <div className="products-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height={50} width={50} />
    </div>
  )

  renderFailureView = () => (
    <div className="products-error-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-products-error-view.png"
        alt="products failure"
        className="products-failure-img"
      />
      <h1 className="product-failure-heading-text">
        Oops! Something Went Wrong
      </h1>
      <p className="products-failure-description">
        We are having some trouble processing your request. Please try again.
      </p>
    </div>
  )

  renderProductsList = () => {
    const {productsList, activeOptionId} = this.state

    if (productsList.length === 0) {
      return (
        <div className="no-products-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-no-products-view.png"
            className="no-products-img"
            alt="no products"
          />
          <h1 className="no-products-heading">No Products Found</h1>
          <p className="no-products-description">
            We could not find any products. Try other filters.
          </p>
        </div>
      )
    }

    return (
      <div className="all-products-container">
        <div className="products-header">
          <h1 className="products-list-heading">All Products</h1>
          <select
            className="sort-by-select"
            value={activeOptionId}
            onChange={this.changeSortby}
          >
            {sortbyOptions.map(option => (
              <option key={option.optionId} value={option.optionId}>
                {option.displayText}
              </option>
            ))}
          </select>
        </div>
        <ul className="products-list">
          {productsList.map(product => (
            <ProductCard productData={product} key={product.id} />
          ))}
        </ul>
      </div>
    )
  }

  renderAllProducts = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProductsList()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="all-products-section">
          {this.renderFiltersGroup()}
          {this.renderAllProducts()}
        </div>
      </>
    )
  }
}

export default Products
