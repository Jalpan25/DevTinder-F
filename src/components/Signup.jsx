import { useState } from "react";
import { useDispatch } from "react-redux";
import { addUser } from "../../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../utils/constants";

const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSignup = async () => {
    setError("");
    setSuccess("");
    setLoading(true);

    // Client-side validation
    if (!firstName || !lastName || !emailId || !password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    if (firstName.length < 4 || firstName.length > 50) {
      setError("First name should be 4 to 50 characters");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(BASE_URL + "/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ firstName, lastName, emailId, password }),
        credentials: "include",
      });

      const jsonResponse = await response.json();
      
      console.log("Signup API Response:", jsonResponse);

      if (response.ok) {
        // Save user to Redux store
        const userToSave = jsonResponse.data || jsonResponse;
        dispatch(addUser(userToSave));
        
        setSuccess("Account created successfully!");
        
        // Navigate to feed after successful signup
        navigate("/feed");
      } else {
        // Handle error from backend
        setError(jsonResponse.message || jsonResponse || "Signup failed. Please try again.");
      }
    } catch (err) {
      console.error("Signup error:", err);
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
            Create Account
          </h2>
          <p className="text-center text-gray-600 mb-6">Sign up to join DevTinder</p>
          
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
              <span className="label-text font-semibold">First Name</span>
            </label>
            <input
              type="text"
              placeholder="Enter your first name"
              className="input input-bordered w-full focus:ring-2 focus:ring-purple-400 focus:border-transparent"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>

          <div className="form-control mt-4">
            <label className="label">
              <span className="label-text font-semibold">Last Name</span>
            </label>
            <input
              type="text"
              placeholder="Enter your last name"
              className="input input-bordered w-full focus:ring-2 focus:ring-purple-400 focus:border-transparent"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          <div className="form-control mt-4">
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
              placeholder="Enter a strong password"
              className="input input-bordered w-full focus:ring-2 focus:ring-purple-400 focus:border-transparent"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSignup()}
            />
            <label className="label">
              <span className="label-text-alt text-gray-500">
                Password must be strong (8+ chars, uppercase, lowercase, number, symbol)
              </span>
            </label>
          </div>

          <div className="card-actions justify-center mt-6">
            <button
              className="btn btn-primary w-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 border-none hover:scale-105 transition-transform text-white"
              onClick={handleSignup}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner"></span>
                  Creating account...
                </>
              ) : (
                "Sign Up"
              )}
            </button>
          </div>

          <div className="divider">OR</div>

          <p className="text-center text-sm">
            Already have an account?{" "}
            <a href="/login" className="link link-primary font-semibold">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;