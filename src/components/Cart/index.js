import {useState} from 'react'
import {Link} from 'react-router-dom'
import Popup from 'reactjs-popup'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import {AiFillCloseCircle} from 'react-icons/ai'

import CartContext from '../../context/CartContext'
import Header from '../Header'

const paymentOptions = [
  {id: 'card', name: 'Card'},
  {id: 'netBanking', name: 'Net Banking'},
  {id: 'upi', name: 'UPI'},
  {id: 'wallet', name: 'Wallet'},
  {id: 'cod', name: 'Cash on Delivery'},
]

const CartItem = ({cartItemDetails}) => (
  <CartContext.Consumer>
    {value => {
      const {
        removeCartItem,
        incrementCartItemQuantity,
        decrementCartItemQuantity,
      } = value
      const {id, title, brand, quantity, price, imageUrl} = cartItemDetails

      return (
        <li className="cart-item">
          <img className="cart-product-image" src={imageUrl} alt={title} />
          <div className="cart-item-details-container">
            <div className="cart-product-title-brand-container">
              <p className="cart-product-title">{title}</p>
              <p className="cart-product-brand">by {brand}</p>
            </div>
            <div className="cart-quantity-container">
              <button
                type="button"
                className="quantity-controller-button"
                data-testid="minus"
                onClick={() => decrementCartItemQuantity(id)}
              >
                <BsDashSquare color="#52606D" size={12} />
              </button>
              <p className="cart-quantity">{quantity}</p>
              <button
                type="button"
                className="quantity-controller-button"
                data-testid="plus"
                onClick={() => incrementCartItemQuantity(id)}
              >
                <BsPlusSquare color="#52606D" size={12} />
              </button>
            </div>
            <div className="total-price-remove-container">
              <p className="cart-total-price">Rs {price * quantity}/-</p>
              <button
                className="remove-button"
                type="button"
                onClick={() => removeCartItem(id)}
              >
                Remove
              </button>
            </div>
          </div>
          <button
            className="delete-button"
            type="button"
            data-testid="remove"
            onClick={() => removeCartItem(id)}
          >
            <AiFillCloseCircle color="#616E7C" size={20} />
          </button>
        </li>
      )
    }}
  </CartContext.Consumer>
)

const PaymentPopup = ({itemsCount, total}) => {
  const [paymentMethod, setPaymentMethod] = useState('')
  const [orderPlaced, setOrderPlaced] = useState(false)

  const onClosePopup = () => {
    setPaymentMethod('')
    setOrderPlaced(false)
  }

  return (
    <Popup
      modal
      onClose={onClosePopup}
      trigger={
        <button type="button" className="checkout-button">
          Checkout
        </button>
      }
    >
      {close => (
        <div className="payment-popup">
          {orderPlaced ? (
            <p className="order-success-message">
              Your order has been placed successfully
            </p>
          ) : (
            <>
              <h1 className="payment-heading">Select Payment Method</h1>
              <ul className="payment-options-list">
                {paymentOptions.map(option => (
                  <li className="payment-option" key={option.id}>
                    <input
                      type="radio"
                      id={option.id}
                      name="paymentMethod"
                      value={option.id}
                      disabled={option.id !== 'cod'}
                      checked={paymentMethod === option.id}
                      onChange={event => setPaymentMethod(event.target.value)}
                    />
                    <label htmlFor={option.id} className="payment-label">
                      {option.name}
                    </label>
                  </li>
                ))}
              </ul>
              <div className="payment-summary">
                <p className="payment-summary-item">
                  Number of items: {itemsCount}
                </p>
                <p className="payment-summary-item">
                  Total price: Rs {total}/-
                </p>
              </div>
              <button
                type="button"
                className="confirm-order-button"
                disabled={paymentMethod !== 'cod'}
                onClick={() => setOrderPlaced(true)}
              >
                Confirm Order
              </button>
            </>
          )}
          <button type="button" className="close-popup-button" onClick={close}>
            Close
          </button>
        </div>
      )}
    </Popup>
  )
}

const EmptyCartView = () => (
  <div className="cart-empty-view-container">
    <img
      src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-empty-cart-img.png"
      className="cart-empty-img"
      alt="cart empty"
    />
    <h1 className="cart-empty-heading">Your Cart Is Empty</h1>
    <Link to="/products">
      <button type="button" className="shop-now-btn">
        Shop Now
      </button>
    </Link>
  </div>
)

const Cart = () => (
  <>
    <Header />
    <CartContext.Consumer>
      {value => {
        const {cartList, removeAllCartItems} = value
        if (cartList.length === 0) {
          return <EmptyCartView />
        }
        const total = cartList.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0,
        )

        return (
          <div className="cart-container">
            <div className="cart-content-container">
              <h1 className="cart-heading">My Cart</h1>
              <button
                type="button"
                className="remove-all-btn"
                onClick={removeAllCartItems}
              >
                Remove All
              </button>
              <ul className="cart-list">
                {cartList.map(eachCartItem => (
                  <CartItem
                    key={eachCartItem.id}
                    cartItemDetails={eachCartItem}
                  />
                ))}
              </ul>
              <div className="cart-summary-container">
                <h1 className="order-total-value">
                  <span className="order-total-label">Order Total:</span> Rs{' '}
                  {total}/-
                </h1>
                <p className="total-items">{cartList.length} Items in cart</p>
                <PaymentPopup itemsCount={cartList.length} total={total} />
              </div>
            </div>
          </div>
        )
      }}
    </CartContext.Consumer>
  </>
)

export default Cart
