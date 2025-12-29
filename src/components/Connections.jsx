import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { addConnections } from "../../utils/connectionSlice";
import { BASE_URL } from "../../utils/constants";

const Connections = () => {
  const connections = useSelector((store) => store.connections);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchConnections();
  }, []);

  const fetchConnections = async () => {
    try {
      setLoading(true);
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });
      dispatch(addConnections(res.data.data));
    } catch (err) {
      console.error("Error fetching connections:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredConnections = connections?.filter((connection) =>
    `${connection.firstName} ${connection.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

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
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 bg-clip-text text-transparent">
                My Connections
              </h1>
              <p className="text-base-content/60 mt-2">
                {connections?.length || 0} {connections?.length === 1 ? "connection" : "connections"}
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative w-full md:w-96">
              <input
                type="text"
                placeholder="Search connections..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input input-bordered w-full rounded-full pl-12 pr-4 focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 absolute left-4 top-1/2 -translate-y-1/2 text-base-content/50"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Empty State */}
        {!connections || connections.length === 0 ? (
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
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold mb-2">No connections yet</h2>
            <p className="text-base-content/60 mb-6">
              Start connecting with developers to build your network
            </p>
            <button
              onClick={() => window.location.href = "/feed"}
              className="btn btn-primary bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 border-none text-white"
            >
              Explore Feed
            </button>
          </div>
        ) : filteredConnections?.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-base-content/60">
              No connections found matching "{searchTerm}"
            </p>
          </div>
        ) : (
          /* Connections Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredConnections?.map((connection) => (
              <div
                key={connection._id}
                className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 border border-base-300 hover:scale-105"
              >
                <div className="card-body p-6">
                  {/* Avatar and Name */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="avatar">
                      <div className="w-16 h-16 rounded-full ring-2 ring-purple-400 ring-offset-2 ring-offset-base-100">
                        <img
                          src={connection.photoUrl || defaultAvatar}
                          alt={`${connection.firstName} ${connection.lastName}`}
                          onError={(e) => {
                            e.target.src = defaultAvatar;
                          }}
                        />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="card-title text-lg font-bold truncate">
                        {connection.firstName} {connection.lastName}
                      </h2>
                      <p className="text-sm text-base-content/60 truncate">
                        {connection.emailId}
                      </p>
                    </div>
                  </div>

                  {/* About Section */}
                  {connection.about && (
                    <p className="text-sm text-base-content/70 mb-4 line-clamp-3">
                      {connection.about}
                    </p>
                  )}

                  {/* Skills */}
                  {connection.skills && connection.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {connection.skills.slice(0, 3).map((skill, index) => (
                        <span
                          key={index}
                          className="badge badge-sm bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border-none"
                        >
                          {skill}
                        </span>
                      ))}
                      {connection.skills.length > 3 && (
                        <span className="badge badge-sm badge-ghost">
                          +{connection.skills.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Age and Gender */}
                  <div className="flex gap-4 text-sm text-base-content/60 mb-4">
                    {connection.age && (
                      <div className="flex items-center gap-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        {connection.age} years
                      </div>
                    )}
                    {connection.gender && (
                      <div className="flex items-center gap-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        {connection.gender}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="card-actions justify-end">
                    <button
                      onClick={() => window.location.href = `/chat/${connection._id}`}
                      className="btn btn-sm btn-ghost hover:bg-purple-50 dark:hover:bg-purple-900/20"
                    >
                      💬 Message
                    </button>
                    <button className="btn btn-sm btn-primary bg-gradient-to-r from-purple-500 to-pink-500 border-none text-white">
                      View Profile
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Connections;