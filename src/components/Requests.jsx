import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { addRequests, removeRequest } from "../../utils/requestSlice";
import { BASE_URL } from "../../utils/constants";

const Requests = () => {
  const requests = useSelector((store) => store.requests);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await axios.get(BASE_URL + "/user/requests", {
        withCredentials: true,
      });
      dispatch(addRequests(res.data.data));
    } catch (err) {
      console.error("Error fetching requests:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRequest = async (requestId, status) => {
    try {
      await axios.post(
        BASE_URL + `/request/review/${status}/${requestId}`,
        {},
        { withCredentials: true }
      );
      
      // Remove the request from local state after successful response
      dispatch(removeRequest(requestId));
    } catch (err) {
      console.error("Error handling request:", err);
    }
  };

  const defaultAvatar = "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp";

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-purple-500"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-200 to-base-100 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 bg-clip-text text-transparent">
            Connection Requests
          </h1>
          <p className="text-base-content/60 mt-2">
            {requests?.length || 0} pending {requests?.length === 1 ? "request" : "requests"}
          </p>
        </div>

        {/* Empty State */}
        {!requests || requests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="bg-base-200 rounded-full p-8 mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-24 w-24 text-base-content/30"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold mb-2">No pending requests</h2>
            <p className="text-base-content/60 mb-6">
              You're all caught up! Check back later for new connection requests.
            </p>
            <button
              onClick={() => window.location.href = "/feed"}
              className="btn btn-primary bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 border-none text-white"
            >
              Explore Feed
            </button>
          </div>
        ) : (
          /* Requests List */
          <div className="space-y-4">
            {requests.map((request) => {
              const user = request.fromUserId;
              return (
                <div
                  key={request._id}
                  className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 border border-base-300"
                >
                  <div className="card-body p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Left Section - Avatar and Basic Info */}
                      <div className="flex items-start gap-4 flex-1">
                        <div className="avatar">
                          <div className="w-20 h-20 rounded-full ring-2 ring-purple-400 ring-offset-2 ring-offset-base-100">
                            <img
                              src={user.photoUrl || defaultAvatar}
                              alt={`${user.firstName} ${user.lastName}`}
                              onError={(e) => {
                                e.target.src = defaultAvatar;
                              }}
                            />
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <h2 className="text-2xl font-bold mb-1">
                            {user.firstName} {user.lastName}
                          </h2>
                          
                          {/* Status Badge */}
                          <div className="flex items-center gap-2 mb-3">
                            <span className="badge badge-primary badge-sm bg-gradient-to-r from-purple-500 to-pink-500 border-none text-white">
                              {request.status}
                            </span>
                            {user.gender && (
                              <span className="text-sm text-base-content/60 capitalize">
                                • {user.gender}
                              </span>
                            )}
                          </div>

                          {/* About Section */}
                          {user.about && (
                            <p className="text-base-content/70 mb-3">
                              {user.about}
                            </p>
                          )}

                          {/* Timestamp */}
                          <p className="text-sm text-base-content/50">
                            Received {new Date(request.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>

                      {/* Right Section - Action Buttons */}
                      <div className="flex md:flex-col gap-3 justify-end md:justify-center">
                        <button
                          onClick={() => handleRequest(request._id, "accepted")}
                          className="btn btn-success text-white flex-1 md:flex-none hover:scale-105 transition-transform"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          Accept
                        </button>
                        <button
                          onClick={() => handleRequest(request._id, "rejected")}
                          className="btn btn-error text-white flex-1 md:flex-none hover:scale-105 transition-transform"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Requests;