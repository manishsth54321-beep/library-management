import { useState, useEffect } from "react";
import { Plus, BookCheck, X, Trash2 } from "lucide-react";
import { issuesAPI, booksAPI, membersAPI } from "../services/api";

const Issues = () => {
  const [issues, setIssues] = useState([]);
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [formData, setFormData] = useState({
    bookId: "",
    memberId: "",
    notes: "",
  });

  useEffect(() => {
    fetchIssues();
    fetchBooks();
    fetchMembers();
  }, [filterStatus]);

  const fetchIssues = async () => {
    try {
      const params = filterStatus !== "all" ? { status: filterStatus } : {};
      const response = await issuesAPI.getAll(params);
      setIssues(response.data);
    } catch (error) {
      console.error("Error fetching issues:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBooks = async () => {
    try {
      const response = await booksAPI.getAll();
      setBooks(response.data.filter((book) => book.availableQuantity > 0));
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  const fetchMembers = async () => {
    try {
      const response = await membersAPI.getAll({ status: "active" });
      setMembers(response.data);
    } catch (error) {
      console.error("Error fetching members:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await issuesAPI.issueBook(formData);
      fetchIssues();
      fetchBooks();
      closeModal();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleReturn = async (id) => {
    if (!window.confirm("Mark this book as returned?")) return;
    try {
      await issuesAPI.returnBook(id);
      fetchIssues();
      fetchBooks();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    try {
      await issuesAPI.delete(id);
      fetchIssues();
      fetchBooks();
    } catch (error) {
      alert(error.message);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({
      bookId: "",
      memberId: "",
      notes: "",
    });
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "issued":
        return "bg-orange-100 text-orange-800";
      case "returned":
        return "bg-green-100 text-green-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Issue / Return</h1>
          <p className="text-gray-600 mt-2">Manage book transactions</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Issue Book
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => setFilterStatus("all")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterStatus === "all"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterStatus("issued")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterStatus === "issued"
                ? "bg-orange-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Issued
          </button>
          <button
            onClick={() => setFilterStatus("returned")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterStatus === "returned"
                ? "bg-green-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Returned
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : issues.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-500 text-lg">No records found</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Book
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Member
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Issue Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Return Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fine
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {issues.map((issue) => (
                <tr key={issue._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {issue.book?.title || "N/A"}
                    </div>
                    <div className="text-xs text-gray-500">
                      {issue.book?.author || ""}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {issue.member?.name || "N/A"}
                    </div>
                    <div className="text-xs text-gray-500">
                      {issue.member?.membershipId || ""}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {formatDate(issue.issueDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {formatDate(issue.dueDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {issue.returnDate ? formatDate(issue.returnDate) : "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {issue.fine > 0 ? `Rs ${issue.fine}` : "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        issue.status
                      )}`}
                    >
                      {issue.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {issue.status === "issued" && (
                      <button
                        onClick={() => handleReturn(issue._id)}
                        className="text-green-600 hover:text-green-800 mr-3"
                        title="Return Book"
                      >
                        <BookCheck size={18} />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(issue._id)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete Record"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Issue Book</h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Book *
                </label>
                <select
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.bookId}
                  onChange={(e) =>
                    setFormData({ ...formData, bookId: e.target.value })
                  }
                >
                  <option value="">Choose a book</option>
                  {books.map((book) => (
                    <option key={book._id} value={book._id}>
                      {book.title} - {book.author} (Available: {book.availableQuantity})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Member *
                </label>
                <select
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.memberId}
                  onChange={(e) =>
                    setFormData({ ...formData, memberId: e.target.value })
                  }
                >
                  <option value="">Choose a member</option>
                  {members.map((member) => (
                    <option key={member._id} value={member._id}>
                      {member.name} ({member.membershipId})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes (Optional)
                </label>
                <textarea
                  rows="3"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  placeholder="Add any additional notes..."
                />
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> The book will be due in 14 days. Late returns will
                  incur a fine of Rs 5 per day.
                </p>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  Issue Book
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Issues;