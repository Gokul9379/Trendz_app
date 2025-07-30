// src/components/ProductItemDetails/index.js

import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'

import SimilarProductItem from '../SimilarProductItem'
import './index.css'

class ProductItemDetails extends Component {
  state = {
    productDetails: {},
    similarProducts: [],
    quantity: 1,
    isLoading: true,
    isFailure: false,
  }

  componentDidMount() {
    this.getProductData()
  }

  getProductData = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')

    const url = `https://apis.ccbp.in/products/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(url, options)
    if (response.ok) {
      const data = await response.json()
      const updatedData = {
        id: data.id,
        imageUrl: data.image_url,
        title: data.title,
        price: data.price,
        description: data.description,
        brand: data.brand,
        totalReviews: data.total_reviews,
        rating: data.rating,
        availability: data.availability,
      }

      const updatedSimilarProducts = data.similar_products.map(product => ({
        id: product.id,
        imageUrl: product.image_url,
        title: product.title,
        style: product.style,
        price: product.price,
        description: product.description,
        brand: product.brand,
        totalReviews: product.total_reviews,
        rating: product.rating,
        availability: product.availability,
      }))

      this.setState({
        productDetails: updatedData,
        similarProducts: updatedSimilarProducts,
        isLoading: false,
        isFailure: false,
      })
    } else {
      this.setState({isLoading: false, isFailure: true})
    }
  }

  onIncrement = () => {
    this.setState(prevState => ({quantity: prevState.quantity + 1}))
  }

  onDecrement = () => {
    this.setState(prevState => ({
      quantity: prevState.quantity > 1 ? prevState.quantity - 1 : 1,
    }))
  }

  onClickContinueShopping = () => {
    const {history} = this.props
    history.push('/products')
  }

  renderLoadingView = () => (
    <div data-testid="loader" className="loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  renderFailureView = () => (
    <div className="failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
        className="error-view-image"
      />

      <h1 className="product-not-found-heading">Product Not Found</h1>
      <button
        type="button"
        className="continue-shopping-button"
        onClick={this.onClickContinueShopping}
      >
        Continue Shopping
      </button>
    </div>
  )

  renderProductDetails = () => {
    const {productDetails, similarProducts, quantity} = this.state
    const {
      imageUrl,
      title,
      price,
      description,
      brand,
      totalReviews,
      rating,
      availability,
    } = productDetails

    return (
      <div className="product-details-container">
        <img src={imageUrl} alt="product" className="product-image" />
        <div className="details-section">
          <h1 className="product-title">{title}</h1>
          <p className="product-price">Rs {price}/-</p>
          <div className="rating-reviews">
            <div className="rating-box">
              <p>{rating}</p>
              <img
                src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                alt="star"
                className="star"
              />
            </div>
            <p className="reviews-text">{totalReviews} Reviews</p>
          </div>
          <p className="product-description">{description}</p>
          <p className="product-availability">
            <span className="label">Available:</span> {availability}
          </p>
          <p className="product-brand">
            <span className="label">Brand:</span> {brand}
          </p>

          <hr />
          <div className="quantity-container">
            <button
              type="button"
              data-testid="minus"
              onClick={this.onDecrement}
              className="quantity-button"
            >
              <BsDashSquare size={18} />
            </button>
            <p className="quantity">{quantity}</p>
            <button
              type="button"
              data-testid="plus"
              onClick={this.onIncrement}
              className="quantity-button"
            >
              <BsPlusSquare size={18} />
            </button>
          </div>
          <button className="add-to-cart-btn" type="button">
            ADD TO CART
          </button>
        </div>
        <h1 className="similar-products-heading">Similar Products</h1>
        <ul className="similar-products-list">
          {similarProducts.map(product => (
            <SimilarProductItem key={product.id} productData={product} />
          ))}
        </ul>
      </div>
    )
  }

  render() {
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken === undefined) {
      return <Redirect to="/login" />
    }

    const {isLoading, isFailure} = this.state

    if (isLoading) {
      return this.renderLoadingView()
    }

    if (isFailure) {
      return this.renderFailureView()
    }

    return this.renderProductDetails()
  }
}

export default ProductItemDetails
