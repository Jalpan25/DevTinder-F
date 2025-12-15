import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addUser } from "../../utils/userSlice";
import axios from "axios";
import { BASE_URL } from "../../utils/constants";

const Profile = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    emailId: "",
    photoUrl: "",
    about: "",
    age: "",
    gender: ""
  });

  const defaultAvatar = "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp";

  // Update formData when user data changes
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        emailId: user.emailId || "",
        photoUrl: user.photoUrl || "",
        about: user.about || "",
        age: user.age || "",
        gender: user.gender || ""
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.patch(
        BASE_URL + "/profile/edit",
        formData,
        { withCredentials: true }
      );
      
      // Update Redux store with new user data
      dispatch(addUser(response.data?.data || response.data)); // Handle potential data wrapping
      setSuccess("Profile updated successfully!");
      setIsEditing(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
      console.error("Update error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        emailId: user.emailId || "",
        photoUrl: user.photoUrl || "",
        about: user.about || "",
        age: user.age || "",
        gender: user.gender || ""
      });
    }
    setIsEditing(false);
    setError("");
    setSuccess("");
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 dark:from-base-300 dark:via-base-200 dark:to-base-300">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <span className="loading loading-spinner loading-lg text-purple-500"></span>
            <p className="mt-4 text-base-content/70">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 dark:from-base-300 dark:via-base-200 dark:to-base-300">
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header Card */}
          <div className="card bg-base-100 shadow-xl mb-6">
            <div className="card-body">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="card-title text-3xl font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 bg-clip-text text-transparent">
                    {isEditing ? "Edit Profile" : "Profile"}
                  </h2>
                  <p className="text-base-content/70">
                    {isEditing ? "Update your developer information" : "Your developer profile page"}
                  </p>
                </div>
                
                {!isEditing && (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="btn btn-primary bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 border-none text-white hover:scale-105 transition-transform"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Alerts */}
          {error && (
            <div className="alert alert-error mb-6 shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="alert alert-success mb-6 shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{success}</span>
            </div>
          )}

          {/* Main Profile Card */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              {!isEditing ? (
                // View Mode
                <div className="space-y-6">
                  {/* Profile Header */}
                  <div className="flex flex-col md:flex-row items-center md:items-start gap-6 pb-6 border-b border-base-300">
                    <div className="avatar">
                      <div className="w-32 h-32 rounded-full ring-4 ring-purple-400 ring-offset-4 ring-offset-base-100">
                        <img 
                          src={user.photoUrl || defaultAvatar} 
                          alt={`${user.firstName} ${user.lastName}`}
                          onError={(e) => {
                            e.target.src = defaultAvatar;
                          }}
                        />
                      </div>
                    </div>
                    
                    <div className="flex-1 text-center md:text-left">
                      <h3 className="text-3xl font-bold text-base-content">
                        {user.firstName} {user.lastName}
                      </h3>
                      <p className="text-base-content/70 mt-1">{user.emailId}</p>
                      
                      <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
                        {user.age && (
                          <div className="badge badge-lg bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border-none">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {user.age} years old
                          </div>
                        )}
                        
                        {user.gender && (
                          <div className="badge badge-lg bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300 border-none">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            {user.gender.charAt(0).toUpperCase() + user.gender.slice(1)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* About Section */}
                  <div>
                    <h4 className="text-xl font-semibold text-base-content mb-3 flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      About
                    </h4>
                    <p className="text-base-content/80 leading-relaxed bg-base-200 p-4 rounded-lg">
                      {user.about || "No about information provided yet."}
                    </p>
                  </div>

                  {/* Profile Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-lg">
                      <p className="text-sm text-base-content/60 mb-1">Member Since</p>
                      <p className="text-lg font-semibold text-base-content">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        }) : 'N/A'}
                      </p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-lg">
                      <p className="text-sm text-base-content/60 mb-1">Last Updated</p>
                      <p className="text-lg font-semibold text-base-content">
                        {user.updatedAt ? new Date(user.updatedAt).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        }) : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                // Edit Mode
                <div className="space-y-6">
                  {/* Photo Preview */}
                  <div className="flex justify-center">
                    <div className="avatar">
                      <div className="w-32 h-32 rounded-full ring-4 ring-purple-400 ring-offset-4 ring-offset-base-100">
                        <img 
                          src={formData.photoUrl || defaultAvatar} 
                          alt="Preview"
                          onError={(e) => {
                            e.target.src = defaultAvatar;
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Form Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="w-full">
                      <label className="label">
                        <span className="label-text font-semibold">First Name</span>
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="input input-bordered w-full focus:input-primary"
                        required
                      />
                    </div>

                    <div className="w-full">
                      <label className="label">
                        <span className="label-text font-semibold">Last Name</span>
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="input input-bordered w-full focus:input-primary"
                        required
                      />
                    </div>

                    {/* --- CHANGED SECTION: Email is now Disabled --- */}
                    <div className="w-full md:col-span-2">
                      <label className="label">
                        <span className="label-text font-semibold flex items-center gap-2">
                           Email 
                           <span className="badge badge-sm badge-ghost font-normal">Cannot be changed</span>
                        </span>
                      </label>
                      <input
                        type="email"
                        value={formData.emailId}
                        disabled={true}
                        className="input input-bordered w-full bg-base-200 text-base-content/60 cursor-not-allowed opacity-80"
                      />
                    </div>
                    {/* --------------------------------------------- */}

                    <div className="w-full">
                      <label className="label">
                        <span className="label-text font-semibold">Age</span>
                      </label>
                      <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleInputChange}
                        className="input input-bordered w-full focus:input-primary"
                        min="18"
                        max="100"
                      />
                    </div>

                    <div className="w-full">
                      <label className="label">
                        <span className="label-text font-semibold">Gender</span>
                      </label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className="select select-bordered w-full focus:select-primary"
                      >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div className="w-full md:col-span-2">
                      <label className="label">
                        <span className="label-text font-semibold">Photo URL</span>
                      </label>
                      <input
                        type="url"
                        name="photoUrl"
                        value={formData.photoUrl}
                        onChange={handleInputChange}
                        className="input input-bordered w-full focus:input-primary"
                        placeholder="https://example.com/photo.jpg"
                      />
                    </div>

                    <div className="w-full md:col-span-2">
                      <label className="label">
                        <span className="label-text font-semibold">About</span>
                      </label>
                      <textarea
                        name="about"
                        value={formData.about}
                        onChange={handleInputChange}
                        className="textarea textarea-bordered w-full h-32 focus:textarea-primary"
                        placeholder="Tell us about yourself..."
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 justify-end pt-4 border-t border-base-300">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="btn btn-ghost"
                      disabled={loading}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="btn btn-primary bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 border-none text-white"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="loading loading-spinner"></span>
                          Saving...
                        </>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;