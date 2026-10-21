import { NavLink, useLocation } from 'react-router-dom';
import './index.css';

export const NavBar = () => {
    const { pathname } = useLocation();
    const navlinks = [
        {
            name : "Home",
            url : '/'
        },
        {
            name : "Products",
            url : '/products'
        },
        {
            name : "Support",
            url : '/support'
        },
    ];
    return (
        <nav className="nav">
            {
                navlinks.map(navlink => {
                    return <NavLink
                        key={ navlink.name }
                        to={ navlink.url }
                        className={
                            `nav__link ${pathname === navlink.url ? 'nav__link--active' : ''}`
                        }
                    >
                        { navlink.name }
                    </NavLink>
                })
            }
        </nav>
    )
}
