import { Outlet, useNavigate, useLocation } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { BASE_URL } from "../../utils/constants";
import { addUser } from "../../utils/userSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const userData = useSelector((store) => store.user);

  // Define public routes that don't require authentication
  const publicRoutes = ["/", "/login", "/signup"];
  const isPublicRoute = publicRoutes.includes(location.pathname);

  const fetchUser = async () => {
    // If we already have user data in Redux, don't fetch again
    if (userData) return;

    try {
      const res = await axios.get(BASE_URL + "/profile/view", {
        withCredentials: true,
      });

      console.log("Profile Fetch Response:", res.data);

      // ----------------------------------------------------
      // FIX: Axios puts body in res.data. 
      // If your API wraps user in 'data' key, we need res.data.data
      // ----------------------------------------------------
      const userToSave = res.data.data || res.data;
      
      dispatch(addUser(userToSave));
      
    } catch (err) {
      console.log("AUTH ERROR:", err);
      // Only redirect to login if user is trying to access protected route
      if (err.response?.status === 401 && !isPublicRoute) {
        navigate("/login");
      }
    }
  };

  useEffect(() => {
    // Only fetch user if not on a public route
    if (!isPublicRoute) {
      fetchUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]); 

  useEffect(() => {
    // If user is logged in and trying to access login/signup, redirect to feed
    if (userData && isPublicRoute && location.pathname !== "/") {
      navigate("/feed");
    }
  }, [userData, isPublicRoute, location.pathname, navigate]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Show NavBar only if user is logged in OR on public routes */}
      {(userData || isPublicRoute) && <NavBar />}
      <main className="flex-1">
        <Outlet />
      </main>
      {(userData || isPublicRoute) && <Footer />}
    </div>
  );
};

export default Body;