import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { addFeed } from "../../utils/feedSlice";
import { BASE_URL } from "../../utils/constants";
// const BASE_URL = "http://localhost:3000";

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragStart, setDragStart] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const getFeed = async () => {
    try {
      if (feed) return;
      const res = await axios.get(`${BASE_URL}/feed?page=1&limit=5`, {
        withCredentials: true,
      });
      dispatch(addFeed(res?.data?.data));
    } catch (err) {
      console.error("Error fetching feed:", err);
    }
  };

  useEffect(() => {
    getFeed();
  }, []);

  const handleInterested = async (userId) => {
    setIsLoading(true);
    try {
      await axios.post(
        `${BASE_URL}/request/send/interested/${userId}`,
        {},
        { withCredentials: true }
      );
      moveToNextProfile();
    } catch (err) {
      console.error("Error sending interested request:", err);
      alert("Failed to send request. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleIgnore = async (userId) => {
    setIsLoading(true);
    try {
      await axios.post(
        `${BASE_URL}/request/send/ignore/${userId}`,
        {},
        { withCredentials: true }
      );
      moveToNextProfile();
    } catch (err) {
      console.error("Error sending ignore request:", err);
      alert("Failed to send request. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const moveToNextProfile = () => {
    if (currentIndex < feed.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  // Touch/Mouse drag handlers
  const handleDragStart = (e) => {
    const clientX = e.type === "touchstart" ? e.touches[0].clientX : e.clientX;
    setDragStart(clientX);
  };

  const handleDragMove = (e) => {
    if (dragStart === 0) return;
    const clientX = e.type === "touchmove" ? e.touches[0].clientX : e.clientX;
    setDragOffset(clientX - dragStart);
  };

  const handleDragEnd = () => {
    if (Math.abs(dragOffset) > 100) {
      const currentUser = feed[currentIndex];
      if (dragOffset > 0) {
        // Swiped right - Interested
        handleInterested(currentUser._id);
      } else {
        // Swiped left - Ignore
        handleIgnore(currentUser._id);
      }
    }
    setDragStart(0);
    setDragOffset(0);
  };

  if (!feed) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl">Loading feed...</div>
      </div>
    );
  }

  if (feed.length === 0 || currentIndex >= feed.length) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700 mb-2">
            No more profiles
          </h2>
          <p className="text-gray-500">Check back later for new connections!</p>
        </div>
      </div>
    );
  }

  const currentUser = feed[currentIndex];
  const rotation = dragOffset / 20;
  const opacity = 1 - Math.abs(dragOffset) / 300;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-pink-100 to-purple-100 p-4">
      <div className="mb-3 text-center">
        <h1 className="text-2xl font-bold text-gray-800">Find Your Match</h1>
        <p className="text-gray-600 text-sm mt-1">
          {currentIndex + 1} / {feed.length}
        </p>
      </div>

      {/* Card Container */}
      <div className="relative w-full max-w-sm h-[500px]">
        {/* Main Card */}
        <div
          className="absolute inset-0 cursor-grab active:cursor-grabbing"
          style={{
            transform: `translateX(${dragOffset}px) rotate(${rotation}deg)`,
            opacity: opacity,
            transition: dragStart === 0 ? "all 0.3s ease-out" : "none",
          }}
          onMouseDown={handleDragStart}
          onMouseMove={handleDragMove}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
          onTouchStart={handleDragStart}
          onTouchMove={handleDragMove}
          onTouchEnd={handleDragEnd}
        >
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden h-full flex flex-col">
            {/* Profile Photo */}
            <div className="h-64 overflow-hidden bg-gray-200 relative flex-shrink-0">
              <img
                src={currentUser.photoUrl}
                alt={`${currentUser.firstName} ${currentUser.lastName}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/400x400";
                }}
              />
              
              {/* Swipe Indicators */}
              {dragOffset > 50 && (
                <div className="absolute top-6 right-6 bg-green-500 text-white px-4 py-2 rounded-lg font-bold text-lg rotate-12 border-4 border-white">
                  LIKE
                </div>
              )}
              {dragOffset < -50 && (
                <div className="absolute top-6 left-6 bg-red-500 text-white px-4 py-2 rounded-lg font-bold text-lg -rotate-12 border-4 border-white">
                  NOPE
                </div>
              )}
            </div>

            {/* User Info */}
            <div className="p-5 flex-1 flex flex-col overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-bold text-gray-800">
                  {currentUser.firstName} {currentUser.lastName}
                </h2>
                {currentUser.gender && (
                  <span className="text-xs text-gray-500 capitalize bg-gray-100 px-2 py-1 rounded-full">
                    {currentUser.gender}
                  </span>
                )}
              </div>
              <p className="text-gray-600 text-sm line-clamp-4 overflow-hidden">
                {currentUser.about}
              </p>
            </div>
          </div>
        </div>

        {/* Next Card Preview (slightly visible behind) */}
        {currentIndex < feed.length - 1 && (
          <div
            className="absolute inset-0 bg-white rounded-2xl shadow-xl -z-10"
            style={{ transform: "scale(0.95) translateY(10px)" }}
          >
            <div className="h-full opacity-50 blur-sm">
              <img
                src={feed[currentIndex + 1].photoUrl}
                alt="Next profile"
                className="w-full h-64 object-cover rounded-t-2xl"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/400x400";
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-6 mt-6">
        <button
          onClick={() => handleIgnore(currentUser._id)}
          disabled={isLoading}
          className="bg-white text-red-500 p-4 rounded-full shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110"
          aria-label="Ignore"
        >
          <svg
            className="w-7 h-7"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <button
          onClick={() => handleInterested(currentUser._id)}
          disabled={isLoading}
          className="bg-gradient-to-r from-pink-500 to-red-500 text-white p-5 rounded-full shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110"
          aria-label="Like"
        >
          <svg
            className="w-8 h-8"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </button>
      </div>

      {/* Swipe Instructions */}
      <p className="text-gray-500 text-xs mt-4">
        Swipe right to like or left to pass
      </p>
    </div>
  );
};

export default Feed;