import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Heart } from "lucide-react";
import React from "react";
interface CreateCommentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateCommentModal = ({ isOpen, onClose }: CreateCommentModalProps) => {
      if (!isOpen) return null;
  if (!isOpen) return null;
  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-40 z-40" onClick={onClose}></div>
      {/* Modal Content */}
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative">
          <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-xl">&times;</button>
          {/* ...existing modal content... */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Supportive Comments (3)
              </h2>
            </div>
            {/* Comment Input */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
              <div className="flex gap-3">
                <div className="flex gap-4 items-center justify-between w-full ">
                  <div className="w-16 p-2 rounded-full shrink-0  ">
                    <Avatar>
                      <AvatarImage
                        src="https://github.com/shadcn.png"
                        className="rounded-3xl"
                      />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex-1 ">
                    <Input
                      type="text"
                      placeholder="Share your thoughts about the post..."
                      className="w-full bg-secondary  text-foreground placeholder-muted-foreground rounded-lg px-2 py-4 border border-primary focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                    />
                  </div>
                  <button className="px-5 py-2 bg-pink-600 text-primary rounded-full font-medium hover:bg-pink-700">
                    Post Comment
                  </button>
                </div>
              </div>
            </div>
            {/* Comment 2 */}
            <div className="bg-white rounded-lg p-4 mb-4 border border-gray-100">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex-shrink-0"></div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-gray-900">Sarah K.</span>
                    <span className="text-sm text-gray-500">45 mins ago</span>
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    "The fog that wouldn't lift" is exactly how I described it to my
                    doctor. You are so brave for reaching out. That support group
                    sounds wonderful! Keep being those small victories.
                  </p>
                  <div className="flex items-center gap-4 mb-3">
                    <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-pink-600">
                      <Heart className="w-4 h-4" />
                      <span>8 Like</span>
                    </button>
                    <button className="text-sm text-gray-600 hover:text-gray-900">
                      Reply
                    </button>
                  </div>
                  {/* Nested Reply */}
                  <div className="ml-8 mt-3 pt-3 border-t border-gray-100">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 flex-shrink-0"></div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-gray-900">
                            Anonymous Mother
                          </span>
                          <span className="px-2 py-0.5 bg-pink-100 text-pink-700 text-xs rounded-full">
                            AUTHOR
                          </span>
                        </div>
                        <p className="text-gray-700 text-sm leading-relaxed">
                          Thank you Sarah ❤️ Helps knowing I'm not the only one who
                          used those words.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Load More */}
            <div className="text-center mt-6">
              <button className="text-pink-600 hover:text-pink-700 font-medium">
                Load more comments
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateCommentModal;
