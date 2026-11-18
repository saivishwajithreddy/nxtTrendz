import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import {AiFillHome} from 'react-icons/ai'
import {BsFillBagFill} from 'react-icons/bs'
import {FiLogOut, FiShoppingCart} from 'react-icons/fi'

import CartContext from '../../context/CartContext'

const Header = props => {
  const onClickLogout = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  const renderCartItemsCount = cartList =>
    cartList.length > 0 ? (
      <span className="cart-count-badge">{cartList.length}</span>
    ) : null

  return (
    <CartContext.Consumer>
      {value => {
        const {cartList} = value
        return (
          <nav className="nav-header">
            <div className="nav-content">
              <Link to="/">
                <img
                  className="website-logo"
                  src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-logo-img.png"
                  alt="website logo"
                />
              </Link>
              <button
                type="button"
                className="logout-mobile-btn"
                onClick={onClickLogout}
                aria-label="logout"
              >
                <FiLogOut size={22} />
              </button>
              <ul className="nav-menu">
                <li className="nav-menu-item">
                  <Link to="/" className="nav-link">
                    Home
                  </Link>
                </li>
                <li className="nav-menu-item">
                  <Link to="/products" className="nav-link">
                    Products
                  </Link>
                </li>
                <li className="nav-menu-item">
                  <Link to="/cart" className="nav-link">
                    Cart
                  </Link>
                  {renderCartItemsCount(cartList)}
                </li>
              </ul>
              <button
                type="button"
                className="logout-desktop-btn"
                onClick={onClickLogout}
              >
                Logout
              </button>
            </div>
            <ul className="nav-menu-mobile">
              <li className="nav-menu-item-mobile">
                <Link to="/" className="nav-link" aria-label="home">
                  <AiFillHome size={24} />
                </Link>
              </li>
              <li className="nav-menu-item-mobile">
                <Link to="/products" className="nav-link" aria-label="products">
                  <BsFillBagFill size={22} />
                </Link>
              </li>
              <li className="nav-menu-item-mobile">
                <Link to="/cart" className="nav-link" aria-label="cart">
                  <FiShoppingCart size={24} />
                </Link>
              </li>
            </ul>
          </nav>
        )
      }}
    </CartContext.Consumer>
  )
}

export default withRouter(Header)
