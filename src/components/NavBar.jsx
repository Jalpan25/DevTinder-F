import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../../utils/constants";
import { removeUser } from "../../utils/userSlice";
import { removeFeed } from "../../utils/feedSlice";
import { removeConnections } from "../../utils/connectionSlice";
import { removeRequests } from "../../utils/requestSlice";
import axios from "axios";

const NavBar = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(BASE_URL + "/logout", {}, {
        withCredentials: true
      });
      
      // Clear all user-related data
      dispatch(removeUser());
      dispatch(removeFeed());
      dispatch(removeConnections());
      dispatch(removeRequests());
      
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const defaultAvatar = "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp";
  
  return (
    <div className="navbar bg-gradient-to-r from-base-100 via-base-200 to-base-100 backdrop-blur-xl shadow-lg sticky top-0 z-50 px-6 border-b border-base-300">
      
      {/* LOGO - Always Visible */}
      <div className="flex-none">
        <Link to={user ? "/feed" : "/"} className="text-2xl font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 bg-clip-text text-transparent hover:scale-105 transition-transform cursor-pointer flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          DevTinder
        </Link>
      </div>

      {/* SEARCH BAR - ONLY SHOW IF USER IS LOGGED IN */}
      <div className="flex-1 flex justify-center px-8">
        {user && (
          <div className="relative w-full max-w-md hidden md:block">
            <input
              type="text"
              placeholder="Search developers..."
              className="input input-bordered w-full rounded-full pl-12 pr-4 focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-4 top-1/2 -translate-y-1/2 text-base-content/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        )}
      </div>

      {/* RIGHT SIDE MENU */}
      <div className="flex-none flex items-center gap-2">
        
        {/* If user is NOT logged in, show Login button */}
        {!user ? (
          <Link to="/login" className="btn btn-primary bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 border-none text-white">
            Login
          </Link>
        ) : (
          // If user IS logged in, show the full menu
          <>
            <button className="btn btn-ghost btn-circle md:hidden">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* 1. Feed / Home Button (ADDED THIS) */}
            <Link to="/feed" className="btn btn-ghost btn-circle hover:bg-purple-100 dark:hover:bg-purple-900/20 transition-colors tooltip tooltip-bottom" data-tip="Feed">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
               </svg>
            </Link>

            {/* 2. Connections Button */}
            <Link to="/connections" className="btn btn-ghost btn-circle hover:bg-purple-100 dark:hover:bg-purple-900/20 transition-colors tooltip tooltip-bottom" data-tip="My Connections">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </Link>

            {/* 3. Requests Button */}
            <Link to="/requests" className="btn btn-ghost btn-circle hover:bg-purple-100 dark:hover:bg-purple-900/20 transition-colors tooltip tooltip-bottom" data-tip="Connection Requests">
              <div className="indicator">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
            </Link>

            {/* Notification Bell */}
            <button className="btn btn-ghost btn-circle hover:bg-purple-100 dark:hover:bg-purple-900/20 transition-colors">
              <div className="indicator">
                <span className="badge badge-xs badge-error indicator-item animate-pulse"></span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
            </button>

            {/* Welcome Text */}
            <div className="hidden md:flex items-center gap-2 mr-2">
              <span className="text-sm font-medium">
                Welcome, {user.firstName}!
              </span>
            </div>

            {/* Profile Dropdown */}
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar hover:scale-105 transition-transform">
                <div className="w-10 rounded-full ring-2 ring-purple-400 ring-offset-2 ring-offset-base-100">
                  <img 
                    alt={`${user.firstName} ${user.lastName}`}
                    src={user.photoUrl || defaultAvatar}
                    onError={(e) => {
                      e.target.src = defaultAvatar;
                    }}
                  />
                </div>
              </div>

              <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 shadow-xl border border-base-300 rounded-2xl mt-3 w-56 p-3 gap-1">
                <li className="menu-title px-4 py-2">
                  <span className="text-sm font-semibold">
                    {`${user.firstName} ${user.lastName}`}
                  </span>
                </li>
                <li className="px-4 py-1">
                  <span className="text-xs text-gray-500">{user.emailId}</span>
                </li>
                <div className="divider my-1"></div>
                
                {/* Feed Link in Dropdown (ADDED THIS) */}
                <li>
                  <Link to="/feed" className="rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Feed
                  </Link>
                </li>

                <li>
                  <Link to="/profile" className="rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Profile
                    <span className="badge badge-sm badge-primary">New</span>
                  </Link>
                </li>
                
                <li>
                  <Link to="/connections" className="rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Connections
                  </Link>
                </li>
                
                <li>
                  <Link to="/requests" className="rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    Requests
                  </Link>
                </li>
                
                <li>
                  <a className="rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Settings
                  </a>
                </li>
                <div className="divider my-1"></div>
                <li>
                  <button 
                    onClick={handleLogout}
                    className="rounded-lg text-error hover:bg-error/10 transition-colors text-left w-full"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default NavBar;