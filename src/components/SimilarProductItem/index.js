// src/components/SimilarProductItem/index.js

import './index.css'

const SimilarProductItem = props => {
  const {productData} = props
  const {imageUrl, title, brand, price, rating} = productData

  return (
    <li className="similar-product-item">
      <img
        src={imageUrl}
        alt={`similar product ${title}`}
        className="similar-product-image"
      />
      <p className="title">{title}</p>
      <p className="brand">by {brand}</p>
      <div className="price-rating">
        <p className="price">Rs {price}/-</p>
        <div className="rating-box">
          <p>{rating}</p>
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="star"
            className="star"
          />
        </div>
      </div>
    </li>
  )
}

export default SimilarProductItem
