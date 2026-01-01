import { useState, useEffect } from "react";
import { BookOpen, Users, BookCheck, BookX } from "lucide-react";
import { issuesAPI } from "../services/api";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalMembers: 0,
    issuedBooks: 0,
    returnedBooks: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await issuesAPI.getDashboardStats();
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Books",
      value: stats.totalBooks,
      icon: BookOpen,
      color: "bg-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      title: "Total Members",
      value: stats.totalMembers,
      icon: Users,
      color: "bg-green-500",
      bgColor: "bg-green-50",
    },
    {
      title: "Issued Books",
      value: stats.issuedBooks,
      icon: BookCheck,
      color: "bg-orange-500",
      bgColor: "bg-orange-50",
    },
    {
      title: "Returned Books",
      value: stats.returnedBooks,
      icon: BookX,
      color: "bg-purple-500",
      bgColor: "bg-purple-50",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to your library management system</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className={`${stat.bgColor} rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="text-white" size={24} />
                </div>
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">
                {stat.title}
              </h3>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-8 grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-900">
            Quick Stats
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Available Books</span>
              <span className="font-semibold text-gray-900">
                {stats.availableBooks || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Books in Circulation</span>
              <span className="font-semibold text-gray-900">
                {stats.issuedBooks}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Active Members</span>
              <span className="font-semibold text-gray-900">
                {stats.totalMembers}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-900">
            System Info
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Last Updated</span>
              <span className="font-semibold text-gray-900">
                {new Date().toLocaleTimeString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Status</span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                Active
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;