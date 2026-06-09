import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Bot,
  User,
  MessageSquare,
  Calendar,
  ChevronRight,
  Loader2,
  AlertCircle,
} from "lucide-react";
import api from "@/lib/api";
import { cn } from "@/lib/utils"; // adjust import path

interface ChatUser {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  lastMessage: string;
  lastMessageTime: string;
  messageCount: number;
}

interface Message {
  role: "user" | "ai";
  text: string;
  timestamp: string;
}

interface Conversation {
  userId: string;
  messages: Message[];
}

export const BusinessChatHistory: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<ChatUser[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [conversation, setConversation] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingConversation, setLoadingConversation] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch list of users who have chatted with this business
  useEffect(() => {
    const fetchChatUsers = async () => {
      try {
        setLoading(true);
        const res = await api.get("/chat/business/users"); // new endpoint
        if (res.data.success) {
          setUsers(res.data.users);
          if (res.data.users.length > 0) {
            setSelectedUserId(res.data.users[0]._id);
          }
        } else {
          setError("Failed to load chat users");
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Error loading chats");
      } finally {
        setLoading(false);
      }
    };
    fetchChatUsers();
  }, []);

  // Fetch conversation for selected user
  useEffect(() => {
    if (!selectedUserId) return;

    const fetchConversation = async () => {
      setLoadingConversation(true);
      try {
        const res = await api.get(
          `/chat/business/conversation/${selectedUserId}`
        );
        if (res.data.success) {
          setConversation(res.data.messages);
        } else {
          setConversation([]);
        }
      } catch (err) {
        console.error("Failed to load conversation", err);
        setConversation([]);
      } finally {
        setLoadingConversation(false);
      }
    };
    fetchConversation();
  }, [selectedUserId]);

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <p className="text-destructive">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 btn-primary"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold gradient-text flex items-center gap-2">
            <MessageSquare className="h-6 w-6" />
            Chat History
          </h1>
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← Back
          </button>
        </div>

        {users.length === 0 ? (
          <div className="text-center py-12">
            <Bot className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">No conversations yet</h2>
            <p className="text-muted-foreground">
              When users start chatting with your AI bot, they'll appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* User list sidebar */}
            <div className="md:col-span-1 border border-border rounded-2xl bg-card/30 overflow-hidden">
              <div className="p-4 border-b border-border">
                <h2 className="font-semibold">Users ({users.length})</h2>
              </div>
              <div className="divide-y divide-border max-h-[600px] overflow-y-auto">
                {users.map((user) => (
                  <button
                    key={user._id}
                    onClick={() => setSelectedUserId(user._id)}
                    className={cn(
                      "w-full p-4 text-left hover:bg-muted/50 transition-colors",
                      selectedUserId === user._id && "bg-muted"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <User className="h-5 w-5 text-primary" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline">
                          <p className="font-medium truncate">{user.name}</p>
                          <span className="text-xs text-muted-foreground">
                            {new Date(user.lastMessageTime).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground truncate mt-1">
                          {user.lastMessage}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {user.messageCount} messages
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Conversation panel */}
            <div className="md:col-span-2 border border-border rounded-2xl bg-card/30 flex flex-col">
              {selectedUserId ? (
                <>
                  <div className="p-4 border-b border-border">
                    <h2 className="font-semibold">
                      Conversation with{" "}
                      {users.find((u) => u._id === selectedUserId)?.name}
                    </h2>
                  </div>
                  <div className="flex-1 p-4 space-y-4 max-h-[600px] overflow-y-auto">
                    {loadingConversation ? (
                      <div className="flex justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      </div>
                    ) : conversation.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">
                        No messages in this conversation.
                      </p>
                    ) : (
                      conversation.map((msg, idx) => (
                        <div
                          key={idx}
                          className={cn(
                            "flex",
                            msg.role === "user" ? "justify-end" : "justify-start"
                          )}
                        >
                          <div
                            className={cn(
                              "max-w-[70%] rounded-2xl px-4 py-3 text-sm",
                              msg.role === "user"
                                ? "bg-primary text-white"
                                : "bg-muted text-foreground"
                            )}
                          >
                            <p className="whitespace-pre-wrap">{msg.text}</p>
                            <div
                              className={cn(
                                "text-xs mt-1 flex items-center gap-1",
                                msg.role === "user"
                                  ? "text-primary-foreground/70"
                                  : "text-muted-foreground"
                              )}
                            >
                              <Calendar className="h-3 w-3" />
                              {formatDate(msg.timestamp)}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full py-12">
                  <p className="text-muted-foreground">Select a user to view chat</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};