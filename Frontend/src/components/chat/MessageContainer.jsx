import React, { useState } from "react";
import {
  MessageSquare, Pencil, SmilePlus,
  MoreVertical, Copy, Trash2
} from "lucide-react";
import Popup from "reactjs-popup";

function MessageContainer({
  message, isMe, currentUserId,
  addReaction, openThread, emojis,
  onCopyMessage, onEditMessage, onDeleteMessage,
  activeMenuId, setActiveMenuId,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(message.content || "");
  

  const getFileBadge = (f) => {

  const type =
    f.type?.toLowerCase() || "";

  const name =
    f.name?.toLowerCase() || "";

  if (type.includes("image"))
    return "IMG";

  if (
    name.endsWith(".doc") ||
    name.endsWith(".docx")
  )
    return "DOC";

  if (
    name.endsWith(".xls") ||
    name.endsWith(".xlsx")
  )
    return "XLS";

  if (
    name.endsWith(".ppt") ||
    name.endsWith(".pptx")
  )
    return "PPT";

  if (
    name.endsWith(".pdf")
  )
    return "PDF";

  if (
    name.endsWith(".zip")
  )
    return "ZIP";

  return "FILE";
};

  const groupedReactions = Object.values(
    (message.reactions || []).reduce((a, r) => {
      if (!a[r.emoji]) a[r.emoji] = { emoji: r.emoji, count: 0 };
      a[r.emoji].count++;
      return a;
    }, {})
  );

  const saveEdit = () => {
    if (!editedContent.trim()) return;
    onEditMessage({ ...message, content: editedContent });
    setIsEditing(false);
  };

  return (
    <div className={`group relative flex w-full gap-3 px-5 py-4 hover:bg-[#171A22] ${isMe ? "justify-end" : ""}`}>

      {/* TOOLBAR */}
      <div className={`absolute top-2 opacity-0 group-hover:opacity-100 ${isMe ? "left-16" : "right-16"}`}>
        <div className="flex bg-[#171A22] border border-[#2A2F3A] rounded-xl overflow-hidden">

          {/* REACT */}
          <Popup trigger={<button className="p-2 rounded-lg hover:bg-[#232734] transition"><SmilePlus size={16} /></button>} position="bottom center">
            <div className="flex flex-wrap gap-2 p-3 bg-[#171A22] border border-[#2A2F3A] rounded-xl">
              {emojis.map((e, i) => (
                <button key={i} onClick={() => addReaction(message._id, e)} className="text-2xl hover:scale-125">
                  {e}
                </button>
              ))}
            </div>
          </Popup>

          {/* THREAD */}
          <button onClick={(e) => { e.stopPropagation(); openThread(message); }} className="p-2 rounded-lg hover:bg-[#232734] transition">
            <MessageSquare size={16} />
          </button>

          {/* MENU */}
<div className="relative">
  <Popup
    trigger={
      <button
        className="p-2 rounded-lg hover:bg-[#232734] transition"
        onClick={(e) => e.stopPropagation()}
      >
        <MoreVertical size={16} />
      </button>
    }
    position={isMe ? "bottom right" : "bottom left"}
    arrow={false}
    closeOnDocumentClick
  >
    <div className="w-52 bg-[#171A22] border border-[#2A2F3A] rounded-xl overflow-hidden shadow-xl">

      <button
        onClick={() => onCopyMessage(message.content)}
        className="w-full px-4 py-3 flex items-center gap-2 hover:bg-[#232734]"
      >
        <Copy size={16} /> Copy
      </button>

      {isMe && (
        <button
          onClick={() => {
            setEditedContent(message.content);
            setIsEditing(true);
          }}
          className="w-full px-4 py-3 flex items-center gap-2 hover:bg-[#232734]"
        >
          <Pencil size={16} /> Edit
        </button>
      )}

      {isMe && (
        <button
          onClick={() => onDeleteMessage(message)}
          className="w-full px-4 py-3 flex items-center gap-2 text-red-400 hover:bg-[#232734]"
        >
          <Trash2 size={16} /> Delete
        </button>
      )}

    </div>
  </Popup>
</div>

        </div>
      </div>

      {/* AVATAR */}
      <div className={isMe ? "order-2" : ""}>
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4F8CFF] to-[#3B6FD8] flex items-center justify-center text-white font-bold">
          {message.sender?.username?.charAt(0)?.toUpperCase() || "U"}
        </div>
      </div>

      {/* BODY */}
      <div className={`flex flex-col max-w-[75%] ${isMe ? "items-end" : ""}`}>

        {/* HEADER */}
        <div className="flex gap-2 items-center">
          <h4 className="text-white font-semibold text-[15px]">
            {isMe ? "You" : message.sender?.username || "Unknown"}
          </h4>

          <span className="text-xs text-[#8B94A7]">
            {new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>

          {message.isEdited && <span className="text-xs text-[#6EA4FF] flex gap-1"><Pencil size={10}/>edited</span>}
        </div>

        {/* MESSAGE */}
        <div className={`mt-1 px-4 py-3 rounded-2xl ${isMe ? "bg-[#4F8CFF] text-white" : "bg-[#171A22] text-[#D6DCE5]"}`}>

          {isEditing ? (
            <div>
              <textarea value={editedContent} onChange={(e) => setEditedContent(e.target.value)} className="w-full min-h-[80px] bg-[#111318] p-3 rounded-xl" />
              <div className="flex justify-end gap-2 mt-2">
                <button onClick={() => setIsEditing(false)}>Cancel</button>
                <button onClick={saveEdit}>Save</button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2">

              {message.content && (
                <p className="whitespace-pre-wrap text-[15px]">
                  {message.content}
                </p>
              )}

              {/* ATTACHMENTS */}
              {message.attachments?.length > 0 && (
                <div className="flex flex-col gap-2 mt-2">
                  {message.attachments.map((f, i) => {
                    const isImg = f.type?.startsWith("image");

                    return (
                      <div key={i} className="flex gap-3 p-3 rounded-xl bg-[#111318] border border-[#2A2F3A]">

                        {isImg ? (
                          <img src={f.url} className="w-12 h-12 rounded-lg object-cover" />
                        ) : (
                          <div className="w-12 h-12 flex items-center justify-center bg-[#1F2330] text-xs font-bold">
                            {getFileBadge(f)}
                          </div>
                        )}

                        <div className="flex-1">
                          <a href={f.url} target="_blank" className="text-sm hover:underline">
                            {f.name || "file"}
                          </a>
                          
                        </div>

                        <a
                        href={f.url}
                        target="_blank"
                        rel="noreferrer"
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#232734] hover:bg-[#2A2F3A] text-[#C8D1DC] transition">
                          ↗
                        </a>

                      </div>
                    );
                  })}
                </div>
              )}

            </div>
          )}
        </div>

        {/* REACTIONS */}
        {groupedReactions.length > 0 && (
          <div className="flex gap-2 mt-2">
            {groupedReactions.map((r, i) => {
              const me = message.reactions?.some(x => x.user?._id === currentUserId && x.emoji === r.emoji);
              return (
                <button key={i} onClick={() => addReaction(message._id, r.emoji)}
                  className={`px-3 py-1 rounded-full text-xs ${me ? "bg-[#244D9B]" : "bg-[#171A22]"}`}>
                  {r.emoji} {r.count}
                </button>
              );
            })}
          </div>
        )}

        {/* THREAD */}
        {message.threadReplies?.length > 0 && (
          <button onClick={(e) => { e.stopPropagation(); openThread(message); }}
            className="mt-2 text-sm text-[#6EA4FF]">
            {message.threadReplies.length} replies
          </button>
        )}

      </div>
    </div>
  );
}

export default MessageContainer;