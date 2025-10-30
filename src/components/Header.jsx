import { CATEGORIES } from '../utils/constants';

const Header = ({ activeCategory, onCategoryChange, loading }) => {
  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <h1 className="logo">
            📰 News4U
            <span className="beta-tag">BETA</span>
          </h1>
          <nav className="nav">
            {CATEGORIES.map(category => (
              <button
                key={category.id}
                className={`nav-item ${activeCategory === category.id ? 'active' : ''}`}
                onClick={() => onCategoryChange(category.id)}
                disabled={loading}
              >
                {category.name}
                {activeCategory === category.id && <span className="active-indicator"></span>}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;