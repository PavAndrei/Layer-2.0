import { Link } from 'react-router';

export const Header = () => {
  return (
    <header>
      <div className="max-w-322.5 px-1.25 mx-auto py-5">
        <div className="flex justify-between items-center">
          <Link to="/">Logo</Link>
          <nav>
            <ul className="flex items-center gap-5 font-semibold text-lg">
              <li>
                <Link to="/men">Men</Link>
              </li>
              <li>
                <Link to="/women">Women</Link>
              </li>
              <li>
                <Link to="/unisex">Unisex</Link>
              </li>
              <li>
                <Link to="/sales">Sales</Link>
              </li>
              <li>
                <Link to="/new">New</Link>
              </li>
              <li>
                <Link to="/catalog">Catalog</Link>
              </li>
            </ul>
          </nav>
          <div>User Buttons</div>
        </div>
      </div>
    </header>
  );
};
