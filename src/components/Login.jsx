import { useState } from "react";
import NavBar from "./NavBar";
import { useDispatch } from "react-redux";
import { addUser } from "../../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../utils/constants";

const Login = ({ onLogin }) => {
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async () => {
    setError("");
    setSuccess("");
    setLoading(true);

    if (!emailId || !password) {
      setError("Please enter both email and password");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(BASE_URL + "/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ emailId, password }),
        credentials: "include",
      });

      const jsonResponse = await response.json();
      
      console.log("Login API Response:", jsonResponse);

      if (response.ok) {
        // ----------------------------------------------------
        // FIX: Handle if user is inside 'data' key or direct
        // ----------------------------------------------------
        const userToSave = jsonResponse.data || jsonResponse;
        
        dispatch(addUser(userToSave));
        
        setSuccess("Login successful!");
        
        if (onLogin) {
          onLogin(jsonResponse);
        }

        // Navigate immediately - no need for timeout
        navigate("/feed");
      } else {
        setError(jsonResponse.message || "Login failed. Please try again.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Network error. Please check if the server is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 p-4">
      <div className="card bg-base-100 w-full max-w-md shadow-2xl">
        <div className="card-body">
          <h2 className="card-title text-3xl font-bold text-center justify-center mb-2 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 bg-clip-text text-transparent">
            Welcome Back
          </h2>
          <p className="text-center text-gray-600 mb-6">Sign in to continue to DevTinder</p>
          
          {error && (
            <div className="alert alert-error mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="alert alert-success mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{success}</span>
            </div>
          )}

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Email</span>
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              className="input input-bordered w-full focus:ring-2 focus:ring-purple-400 focus:border-transparent"
              value={emailId}
              onChange={(e) => setEmailId(e.target.value)}
            />
          </div>

          <div className="form-control mt-4">
            <label className="label">
              <span className="label-text font-semibold">Password</span>
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              className="input input-bordered w-full focus:ring-2 focus:ring-purple-400 focus:border-transparent"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            />
          </div>

          <div className="card-actions justify-center mt-6">
            <button
              className="btn btn-primary w-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 border-none hover:scale-105 transition-transform text-white"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner"></span>
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </button>
          </div>

          <div className="divider">OR</div>

          <p className="text-center text-sm">
            Don't have an account?{" "}
            <a href="/signup" className="link link-primary font-semibold">
  Sign up
</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;