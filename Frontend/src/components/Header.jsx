import { NavLink } from "react-router";
import { useAuth } from "../store/authStore";
import Notifications from "./Notifications";
import {
  navbarClass,
  navContainerClass,
  navBrandClass,
  navLinksClass,
  navLinkClass,
  navLinkActiveClass,
} from "../styles/common";

function Header() {
  const isAuthenticated = useAuth((state) => state.isAuthenticated);
  const user = useAuth((state) => state.currentUser);

  // decide profile route
  const getProfile = () => {
    if (!user) return "/";
    return "/user-profile"
    
  };

  return (
    <nav className={navbarClass}>
      <div className={navContainerClass}>

        {/* LOGO */}
        <NavLink to="/chat-window" className={navBrandClass}>
          Chat-App
        </NavLink>

        <ul className={navLinksClass}>

          

          {/* NOT LOGGED IN */}
          {!isAuthenticated && (
            <>
            {/* HOME */}
            <li>
              <NavLink to="/"
               end className={({ isActive }) => 
               isActive ? navLinkActiveClass : navLinkClass
               }
              >
                Home
              </NavLink>
          </li>
              <li>
                <NavLink
                  to="/register"
                  className={({ isActive }) =>
                    isActive ? navLinkActiveClass : navLinkClass
                  }
                >
                  Register
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    isActive ? navLinkActiveClass : navLinkClass
                  }
                >
                  Login
                </NavLink>
              </li>
            </>
          )}

         {/* LOGGED IN */}
{isAuthenticated && (
  <>
    <li>
      <NavLink
        to={getProfile()}
        className={({ isActive }) =>
          isActive
            ? navLinkActiveClass
            : navLinkClass
        }
      >
        Dashboard
      </NavLink>
    </li>

    <li>
      <Notifications />
    </li>
  </>
)}

        </ul>
      </div>
    </nav>
  );
}

export default Header;