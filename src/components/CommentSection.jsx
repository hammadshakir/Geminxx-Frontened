// components/CommentSection.jsx - Updated fetch and handle functions
import { useState, useEffect, useRef } from "react";
import { 
  FaPaperPlane, 
  FaTrashAlt, 
  FaEdit, 
  FaHeart, 
  FaRegHeart,
  FaTimes,
  FaCheck,
  FaClock,
  FaComments,
  FaSpinner,
  FaLock,
  FaStar,
  FaRegStar,
  FaUserCircle
} from "react-icons/fa";
import { formatDistanceToNow } from 'date-fns';

export default function CommentSection({ projectId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [error, setError] = useState(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const textareaRef = useRef(null);
  const editTextareaRef = useRef(null);

  // Fetch comments
  useEffect(() => {
    if (projectId) {
      fetchComments();
    }
  }, [projectId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`http://localhost:1000/api/projects/${projectId}/comments`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch comments");
      }
      
      const data = await response.json();
      console.log("📥 Fetched comments:", data);
      setComments(data || []);
    } catch (error) {
      console.error("Error fetching comments:", error);
      setError("Failed to load comments");
    } finally {
      setLoading(false);
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [newComment]);

  useEffect(() => {
    if (editTextareaRef.current) {
      editTextareaRef.current.style.height = 'auto';
      editTextareaRef.current.style.height = editTextareaRef.current.scrollHeight + 'px';
    }
  }, [editText]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmitting(true);
    setError(null);

    try {
      const commentData = {
        text: newComment.trim(),
        rating: rating || 0,
        user: "Current User",
        avatar: "👤"
      };

      console.log("📤 Sending comment:", commentData);

      const response = await fetch(`http://localhost:1000/api/projects/${projectId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(commentData),
      });

      const data = await response.json();
      console.log("📥 Response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to add comment");
      }

      // Add new comment to state
      setComments(prev => [data.comment, ...prev]);
      setNewComment("");
      setRating(0);
      
    } catch (error) {
      console.error("Error adding comment:", error);
      setError(error.message || "Failed to add comment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (id, text) => {
    setEditingId(id);
    setEditText(text);
  };

  const handleSaveEdit = async (id) => {
    if (!editText.trim()) return;

    try {
      const response = await fetch(`http://localhost:1000/api/comments/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: editText.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update comment");
      }

      setComments(prev => prev.map(comment => {
        if (comment._id === id) {
          return { ...comment, review: editText.trim() };
        }
        return comment;
      }));
      
      setEditingId(null);
      setEditText("");
    } catch (error) {
      console.error("Error updating comment:", error);
      setError(error.message || "Failed to update comment");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;

    try {
      const response = await fetch(`http://localhost:1000/api/comments/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete comment");
      }

      setComments(prev => prev.filter(comment => comment._id !== id));
    } catch (error) {
      console.error("Error deleting comment:", error);
      setError(error.message || "Failed to delete comment");
    }
  };

  const handleLike = async (id) => {
    try {
      const response = await fetch(`http://localhost:1000/api/comments/${id}/like`, {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to like comment");
      }

      setComments(prev => prev.map(comment => {
        if (comment._id === id) {
          return { 
            ...comment, 
            likes: data.likes, 
            liked: data.liked 
          };
        }
        return comment;
      }));
    } catch (error) {
      console.error("Error liking comment:", error);
      setError(error.message || "Failed to like comment");
    }
  };

  const formatTime = (date) => {
    try {
      if (!date) return 'Just now';
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    } catch (error) {
      return 'Just now';
    }
  };

  // Render stars for rating
  const renderStars = (rating, interactive = false, onRatingChange = null) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => interactive && onRatingChange && onRatingChange(star)}
            onMouseEnter={() => interactive && setHoverRating(star)}
            onMouseLeave={() => interactive && setHoverRating(0)}
            className={`${interactive ? 'cursor-pointer hover:scale-110 transition' : 'cursor-default'}`}
          >
            {star <= (interactive ? hoverRating || rating : rating) ? (
              <FaStar className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            ) : (
              <FaRegStar className="w-4 h-4 text-gray-300" />
            )}
          </button>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="animate-pulse space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-32"></div>
              <div className="h-3 bg-gray-200 rounded w-24 mt-1"></div>
            </div>
          </div>
          <div className="h-20 bg-gray-200 rounded-xl"></div>
          <div className="h-20 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <FaComments className="w-5 h-5 text-indigo-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">
              Discussion
            </h3>
            <span className="text-xs bg-white px-2.5 py-1 rounded-full text-gray-500 font-medium">
              {comments.length} comments
            </span>
          </div>
        </div>
      </div>

      {/* Comment Input */}
      <div className="px-6 py-4 border-b border-gray-100">
        {error && (
          <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmitComment} className="flex gap-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
              CU
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-500 font-medium">Rating:</span>
                {renderStars(rating, true, setRating)}
              </div>
              {rating > 0 && (
                <span className="text-xs text-gray-400">
                  {rating === 5 ? 'Excellent! ⭐' : 
                   rating === 4 ? 'Great! 😊' :
                   rating === 3 ? 'Good 👍' :
                   rating === 2 ? 'Okay 👌' :
                   'Needs improvement 💡'}
                </span>
              )}
            </div>
            <textarea
              ref={textareaRef}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition"
              rows="2"
            />
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">
                  {newComment.length} characters
                </span>
              </div>
              <button
                type="submit"
                disabled={!newComment.trim() || submitting}
                className={`px-5 py-2 rounded-xl font-medium transition flex items-center gap-2 ${
                  !newComment.trim() || submitting
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg"
                }`}
              >
                {submitting ? (
                  <FaSpinner className="w-4 h-4 animate-spin" />
                ) : (
                  <FaPaperPlane className="w-4 h-4" />
                )}
                Comment
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Comments List */}
      <div className="px-6 py-4 max-h-[600px] overflow-y-auto">
        {comments.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <FaComments className="w-8 h-8 text-gray-300" />
            </div>
            <p className="text-gray-400 font-medium">No comments yet</p>
            <p className="text-sm text-gray-300 mt-1">Start the discussion!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment._id} className="group">
                <div className={`p-4 rounded-xl transition-all duration-200 ${
                  comment.liked ? 'bg-indigo-50/50 border border-indigo-100' : 'hover:bg-gray-50'
                }`}>
                  <div className="flex items-start gap-3">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center font-semibold text-sm flex-shrink-0 ${
                      comment.liked ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {comment.avatar || '👤'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-gray-800">{comment.user || 'Anonymous'}</span>
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            <FaClock className="w-2.5 h-2.5" />
                            {formatTime(comment.created_At)}
                          </span>
                          {comment.rating > 0 && (
                            <span className="flex items-center gap-0.5 text-xs">
                              {renderStars(comment.rating)}
                              <span className="ml-1 text-gray-400">({comment.rating})</span>
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                          <button
                            onClick={() => handleLike(comment._id)}
                            className="p-1 text-gray-400 hover:text-red-500 transition"
                          >
                            {comment.liked ? (
                              <FaHeart className="w-4 h-4 text-red-500" />
                            ) : (
                              <FaRegHeart className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            onClick={() => handleEdit(comment._id, comment.review)}
                            className="p-1 text-gray-400 hover:text-blue-500 transition"
                          >
                            <FaEdit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(comment._id)}
                            className="p-1 text-gray-400 hover:text-red-500 transition"
                          >
                            <FaTrashAlt className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      
                      {editingId === comment._id ? (
                        <div className="mt-2">
                          <textarea
                            ref={editTextareaRef}
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                            rows="2"
                          />
                          <div className="flex gap-2 mt-2">
                            <button
                              onClick={() => handleSaveEdit(comment._id)}
                              className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition"
                            >
                              <FaCheck className="w-3 h-3 inline mr-1" />
                              Save
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200 transition"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-gray-700 mt-1 leading-relaxed">{comment.review}</p>
                      )}
                      
                      <div className="flex items-center gap-3 mt-2">
                        <button
                          onClick={() => handleLike(comment._id)}
                          className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition"
                        >
                          {comment.liked ? (
                            <FaHeart className="w-3 h-3 text-red-500" />
                          ) : (
                            <FaRegHeart className="w-3 h-3" />
                          )}
                          <span>{comment.likes || 0}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <FaLock className="w-3 h-3" />
            Comments are public
          </span>
        </div>
      </div>
    </div>
  );
}