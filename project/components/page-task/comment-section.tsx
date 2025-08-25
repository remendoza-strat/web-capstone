"use client"

import { useState } from "react"
import { format } from "date-fns"
import { MoreHorizontal, MessageCircle, Send, X, Trash2, Check, Edit2 } from "lucide-react"
import { CommentsWithUser } from "@/lib/customtype"
import { UserAvatar } from "../user-avatar"
import { DateTimeFormatter } from "@/lib/utils"

export function CommentSection({clerkId, comments, editComment}:{clerkId: string, comments: CommentsWithUser[], editComment: boolean}) {

	const [newComment, setNewComment] = useState("");
	const [editText, setEditText] = useState("");
	const [showCommentMenu, setShowCommentMenu] = useState(false);
	const [showEdit, setShowEdit] = useState(false);

  return (
    <div className="mb-8 bg-white border border-gray-200 shadow-sm dark:bg-gray-800 rounded-2xl dark:border-gray-700">
      <div className="p-8">
        <h4 className="flex items-center mb-6 text-lg font-semibold text-gray-900 dark:text-white">
          <MessageCircle className="w-5 h-5 mr-2"/>
          ({comments.length > 1 ? "Comments" : "Comment"}) ({comments.length})
        </h4>
        <form className="mb-8">
          <div className="flex items-center space-x-4">
            <UserAvatar clerkId={clerkId}/>
            <div className="flex items-center flex-1 min-w-0 space-x-3">
              <input
                type="text"
                value={newComment} onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 min-w-0 px-4 py-3 text-gray-900 bg-white border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
              <button
                type="submit"
                className="flex-shrink-0 px-6 py-3 font-medium text-white transition-colors bg-blue-600 hover:bg-blue-700 rounded-xl"
              >
                <Send className="w-4 h-4"/>
              </button>
            </div>
          </div>
        </form>
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="flex space-x-4">
              <UserAvatar clerkId={comment.user.clerkId}/>
              <div className="flex-1">
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {comment.user.fname} {comment.user.lname}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {DateTimeFormatter(comment.createdAt ?? new Date())}
                      </span>
                    </div>
                    {editComment || comment.user.clerkId === clerkId && (
                      <div className="relative">
                        <button
                          onClick={() => setShowCommentMenu(true)}
                          className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
                        >
                          <MoreHorizontal className="w-5 h-5 text-gray-500 dark:text-gray-400"/>
                        </button>
                        {showCommentMenu && (
                          <div className="absolute right-0 z-10 w-32 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700">
                            <button
															onClick={() => setShowEdit(true)}
                              className="flex items-center w-full px-3 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                              <Edit2 className="w-4 h-4 mr-2"/> 
															Edit
                            </button>
                            <button
                              className="flex items-center w-full px-3 py-2 text-sm text-left text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                              <Trash2 className="w-4 h-4 mr-2"/> 
															Delete
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  {showEdit ? (
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={editText} onChange={(e) => setEditText(e.target.value)}
                        className="flex-1 px-3 py-2 text-sm bg-white border rounded-lg dark:bg-gray-600 dark:text-white"
                      />
                      <button
                        className="p-2 text-green-600 rounded hover:bg-green-50 dark:hover:bg-green-800"
                      >
                        <Check className="w-4 h-4"/>
                      </button>
                      <button
                        className="p-2 text-gray-500 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {comment.content}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
          {comments.length === 0 && (
            <div className="py-12 text-center">
              <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600"/>
              <p className="text-gray-500 dark:text-gray-400">
                No comments yet. Start the conversation!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}