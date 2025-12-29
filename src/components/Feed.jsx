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
  const [page, setPage] = useState(1);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hasMoreProfiles, setHasMoreProfiles] = useState(true);

  const getFeed = async (pageNum = 1, isInitial = false) => {
    try {
      if (isInitial && feed) return;
      
      setIsFetchingMore(true);
      const res = await axios.get(`${BASE_URL}/feed?page=${pageNum}&limit=5`, {
        withCredentials: true,
      });
      
      const newProfiles = res?.data?.data || [];
      
      // If we get fewer profiles than requested, there are no more
      if (newProfiles.length < 5) {
        setHasMoreProfiles(false);
      }
      
      if (newProfiles.length === 0) {
        setHasMoreProfiles(false);
        setIsFetchingMore(false);
        return;
      }
      
      // Append new profiles to existing feed
      if (feed && !isInitial) {
        dispatch(addFeed([...feed, ...newProfiles]));
      } else {
        dispatch(addFeed(newProfiles));
      }
      
      setIsFetchingMore(false);
    } catch (err) {
      console.error("Error fetching feed:", err);
      setIsFetchingMore(false);
      // If error occurs, assume no more profiles to avoid infinite retry
      setHasMoreProfiles(false);
    }
  };

  useEffect(() => {
    getFeed(1, true);
  }, []);

  // Auto-fetch more profiles when nearing the end
  useEffect(() => {
    if (
      feed &&
      feed.length > 0 &&
      currentIndex >= feed.length - 2 && // Fetch when 2 cards remaining
      hasMoreProfiles &&
      !isFetchingMore
    ) {
      const nextPage = page + 1;
      setPage(nextPage);
      getFeed(nextPage);
    }
  }, [currentIndex, feed, hasMoreProfiles, isFetchingMore, page]);

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
    // Always increment the index, even if we're at the last card
    // The component will show loading state if more profiles are being fetched
    setCurrentIndex(currentIndex + 1);
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

  // Show loading indicator when we've gone past current feed length and fetching more
  if (currentIndex >= feed.length) {
    if (isFetchingMore) {
      return (
        <div className="flex justify-center items-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
            <div className="text-xl text-gray-600">Loading more profiles...</div>
          </div>
        </div>
      );
    }
    
    // Not fetching and no more profiles = end of feed
    if (!hasMoreProfiles) {
      return (
        <div className="flex justify-center items-center h-screen">
          <div className="text-center px-4">
            <div className="mb-4">
              <svg
                className="w-20 h-20 mx-auto text-purple-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-700 mb-2">
              You've explored the whole feed! 🎉
            </h2>
            <p className="text-gray-500 mb-4">
              Check back later for new profiles
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-2 rounded-full hover:shadow-lg transition-all"
            >
              Refresh Feed
            </button>
          </div>
        </div>
      );
    }
  }

  // Initial empty feed
  if (feed.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center px-4">
          <div className="mb-4">
            <svg
              className="w-20 h-20 mx-auto text-purple-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-700 mb-2">
            No profiles available
          </h2>
          <p className="text-gray-500 mb-4">
            Check back later for new connections!
          </p>
        </div>
      </div>
    );
  }

  const currentUser = feed[currentIndex];
  
  // Safety check - shouldn't happen but just in case
  if (!currentUser) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <div className="text-xl text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }
  
  const rotation = dragOffset / 20;
  const opacity = 1 - Math.abs(dragOffset) / 300;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-pink-100 to-purple-100 p-4">
      <div className="mb-3 text-center">
        <h1 className="text-2xl font-bold text-gray-800">Find Your Match</h1>
        <p className="text-gray-600 text-sm mt-1">
          {currentIndex + 1} / {feed.length}
          {isFetchingMore && (
            <span className="ml-2 text-xs text-purple-500">
              (Loading more...)
            </span>
          )}
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