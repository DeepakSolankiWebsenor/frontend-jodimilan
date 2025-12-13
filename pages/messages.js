'use client';
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Head from "next/head";
import { useSelector } from "react-redux";
import moment from "moment";
import SendIcon from "@mui/icons-material/Send";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import BlockIcon from "@mui/icons-material/Block";
import { Snackbar, Alert, Tooltip } from "@mui/material";
import Avatar1 from "../public/images/avtar.png";
import useApiService from "../services/ApiService";
import socketService from "../services/socketService";
import MessageStatus from "../components/chat/MessageStatus";
import TypingIndicator from "../components/chat/TypingIndicator";
import styles from "../styles/chat.module.css";
import CryptoJS from "crypto-js";
import { decrypted_key } from "../services/appConfig";

export default function Messages() {
  // State management
  const [friends, setFriends] = useState([]);
  const [allFriends, setAllFriends] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState({});
  const [typingUsers, setTypingUsers] = useState({});
  const [alert, setAlert] = useState({ open: false, message: "" });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const { user } = useSelector((state) => state.user);
  const {
    getAllfriends,
    getChatbySessionid,
    sendMessage: sendMessageAPI,
    blockchatuser,
    getUserProfile,
    chatCounting,
  } = useApiService();

  const [currentUserId, setCurrentUserId] = useState(null);
  
  // Use ref to track selected chat for socket listeners (fixes stale closure issue)
  const selectedChatRef = useRef(null);
  
  // Update ref whenever selectedChat changes
  useEffect(() => {
    selectedChatRef.current = selectedChat;
  }, [selectedChat]);

  // Initialize currentUserId from Redux user (PRIMARY SOURCE)
  useEffect(() => {
    if (user?.id) {
      const userId = Number(user.id);
      setCurrentUserId(userId);
      console.log('🆔 Setting User ID from Redux:', userId, typeof userId);
      // Also save to localStorage for consistency
      localStorage.setItem('user_id', userId.toString());
    }
  }, [user]);

  // Fallback: Initialize from localStorage if Redux not available yet
  useEffect(() => {
    if (!currentUserId) {
      const userId = Number(localStorage.getItem("user_id"));
      if (userId && userId !== 0) {
        setCurrentUserId(userId);
        console.log('🆔 Setting User ID from localStorage (fallback):', userId, typeof userId);
      }
    }
  }, [currentUserId]);

  // Decrypt and get user data
  useEffect(() => {
    getUserProfile()
      .then((res) => {
        if (res.data?.status === 200) {
          const encrypted_json = JSON.parse(window.atob(res?.data?.user));
          const dec = CryptoJS.AES.decrypt(
            encrypted_json.value,
            CryptoJS.enc.Base64.parse(decrypted_key),
            { iv: CryptoJS.enc.Base64.parse(encrypted_json.iv) }
          );
          const decryptedText = dec.toString(CryptoJS.enc.Utf8);
          const jsonStartIndex = decryptedText.indexOf("{");
          const jsonEndIndex = decryptedText.lastIndexOf("}") + 1;
          const jsonData = decryptedText.substring(jsonStartIndex, jsonEndIndex);
          const parsed = JSON.parse(jsonData.trim());
          setUserData(parsed);
        }
      })
      .catch((error) => console.log(error));
  }, []);

  // Initialize Socket.IO connection - Re-register listeners when handlers change
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    socketService.connect(token);

    // Set up event listeners
    socketService.on('message:new', handleNewMessage);
    socketService.on('typing:start', handleTypingStart);
    socketService.on('typing:stop', handleTypingStop);
    socketService.on('user:presence', handleUserPresence);
    socketService.on('messages:read', handleMessagesRead);
    socketService.on('message:status', handleMessageStatus);

    console.log('🔌 Socket event listeners registered');

    return () => {
      socketService.off('message:new', handleNewMessage);
      socketService.off('typing:start', handleTypingStart);
      socketService.off('typing:stop', handleTypingStop);
      socketService.off('user:presence', handleUserPresence);
      socketService.off('messages:read', handleMessagesRead);
      socketService.off('message:status', handleMessageStatus);
      console.log('🔌 Socket event listeners unregistered');
    };
  }, [currentUserId, selectedChat]);

  // Fetch friends list
  useEffect(() => {
    fetchFriends();
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Join session when chat is selected
  useEffect(() => {
    if (selectedChat) {
      socketService.joinSession(selectedChat.session.id);
      loadMessages(selectedChat.session.id);
      markMessagesAsRead(selectedChat.session.id);
    }

    return () => {
      if (selectedChat) {
        socketService.leaveSession(selectedChat.session.id);
      }
    };
  }, [selectedChat?.session?.id]);

  const fetchFriends = () => {
    getAllfriends()
      .then((res) => {
        if (res?.status === 200) {
          const currentChat = selectedChatRef.current;
          
          const formattedFriends = res.data.data.map((item) => {
            // Force unreadCount to 0 if this is the active chat
            const isCurrentChat = currentChat && Number(item.id) === Number(currentChat.session.id);
            
            return {
              id: item.friend.id,
              name: item.friend.name,
              ryt_id: item.friend.ryt_id,
              profile: item.friend.profile_photo
                ? `${process.env.NEXT_PUBLIC_BASE_URL}/${item.friend.profile_photo}`
                : null,
              session: {
                id: item.id,
                unreadCount: isCurrentChat ? 0 : (item.unreadCount || 0),
              },
              block: item.block ? JSON.parse(item.block) : [],
              lastMessage: item.lastMessage,
              lastMessageAt: item.last_message_at,
            };
          });
          setFriends(formattedFriends);
          setAllFriends(formattedFriends);
          setLoading(false);
        }
      })
      .catch((error) => console.log(error));
  };

  const loadMessages = (sessionId) => {
    getChatbySessionid(sessionId)
      .then((res) => {
        setMessages(res.data.data.items.reverse());
      })
      .catch((error) => console.log(error));
  };

  const markMessagesAsRead = (sessionId) => {
    chatCounting(sessionId).then(() => {
      console.log('✅ Messages marked as read via API for session:', sessionId);
      // Refresh friends list to update unread count
      fetchFriends();
    }).catch(error => {
      console.error('❌ Error marking messages as read:', error);
    });
  };

  const handleChatSelect = (friend) => {
    setSelectedChat(friend);
    // Clear typing indicator for this user
    setTypingUsers(prev => {
      const newTyping = { ...prev };
      delete newTyping[friend.id];
      return newTyping;
    });
  };

  const handleBackToList = () => {
    setSelectedChat(null);
  };

  const handleSendMessage = () => {
    if (!message.trim() || !selectedChat) return;

    const tempMessage = {
      id: Date.now(),
      message: message,
      from_user_id: currentUserId,
      to_user_id: selectedChat.id,
      session_id: selectedChat.session.id,
      created_at: new Date(),
      status: 'sending',
    };

    // Optimistic update
    setMessages(prev => [...prev, tempMessage]);
    setMessage("");

    // Stop typing indicator
    socketService.stopTyping(selectedChat.session.id, currentUserId);

    // Send via API
    sendMessageAPI(selectedChat.session.id, {
      message: message,
      message_type: "text",
    })
      .then((res) => {
        // Update temp message with real data
        setMessages(prev =>
          prev.map(msg =>
            msg.id === tempMessage.id ? { ...res.data.data, status: 'sent' } : msg
          )
        );
        fetchFriends(); // Update last message in list
      })
      .catch((error) => {
        console.log(error);
        // Mark as failed
        setMessages(prev =>
          prev.map(msg =>
            msg.id === tempMessage.id ? { ...msg, status: 'failed' } : msg
          )
        );
      });
  };

  const handleInputChange = (e) => {
    setMessage(e.target.value);

    if (!selectedChat) return;

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Emit typing start
    if (e.target.value.length > 0) {
      socketService.startTyping(
        selectedChat.session.id,
        currentUserId,
        userData?.name || "User"
      );

      // Auto-stop typing after 3 seconds
      typingTimeoutRef.current = setTimeout(() => {
        socketService.stopTyping(selectedChat.session.id, currentUserId);
      }, 3000);
    } else {
      socketService.stopTyping(selectedChat.session.id, currentUserId);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleBlockUser = () => {
    if (!selectedChat) return;

    const isBlocked = selectedChat.block?.some(
      (item) => Number(item.blocked_by) === currentUserId
    );

    blockchatuser(selectedChat.session.id, isBlocked ? "unblock" : "block")
      .then((response) => {
        if (response.status === 200) {
          setAlert({
            open: true,
            message: isBlocked ? "User unblocked successfully" : "User blocked successfully",
          });
          fetchFriends();
        }
      })
      .catch((error) => console.log(error));
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    if (query === "") {
      setFriends(allFriends);
    } else {
      setFriends(
        allFriends.filter((friend) =>
          friend.name.toLowerCase().includes(query)
        )
      );
    }
  };

  // Socket event handlers
  const handleNewMessage = (data) => {
    const currentChat = selectedChatRef.current;
    
    console.log('📨 New message received:', {
      messageId: data.id,
      from_user_id: data.from_user_id,
      to_user_id: data.to_user_id,
      currentUserId: currentUserId,
      selectedSessionId: currentChat?.session?.id,
      dataSessionId: data.session_id,
      message: data.message
    });

    // CRITICAL FIX: Only add message if it's FROM the other person (not from me)
    // The sender already has the message from optimistic update
    if (Number(data.from_user_id) === Number(currentUserId)) {
      console.log('ℹ️ My own message from socket, ignoring (already have from optimistic update)');
      // Update the existing message with real ID and status from server
      setMessages(prev =>
        prev.map(msg =>
          msg.message === data.message && msg.from_user_id === currentUserId && msg.id > 1000000000000
            ? { ...data, status: 'sent' }
            : msg
        )
      );
      fetchFriends();
      return;
    }

    // Only add message if it's for the currently open chat
    if (currentChat && Number(data.session_id) === Number(currentChat.session.id)) {
      // Check if message already exists to prevent duplicates
      setMessages(prev => {
        const exists = prev.some(msg => msg.id === data.id);
        if (exists) {
          console.log('⚠️ Message already exists, skipping');
          return prev;
        }
        console.log('✅ Adding friend\'s message to chat');
        return [...prev, data];
      });
      
      // Mark as read ONLY if chat is open and focused
      if (document.visibilityState === 'visible') {
        markMessagesAsRead(currentChat.session.id);
      } else {
        // Otherwise just mark as delivered
        socketService.messageDelivered(currentChat.session.id, data.id, data.from_user_id, currentUserId);
      }
    } else {
      // If chat not open, just mark as delivered
      socketService.messageDelivered(data.session_id, data.id, data.from_user_id, currentUserId);
    }
    
    // Always update friends list to show latest message
    fetchFriends();
  };

  const handleTypingStart = (data) => {
    if (data.userId !== currentUserId) {
      setTypingUsers(prev => ({
        ...prev,
        [data.userId]: { userName: data.userName, sessionId: data.sessionId },
      }));
    }
  };

  const handleTypingStop = (data) => {
    setTypingUsers(prev => {
      const newTyping = { ...prev };
      delete newTyping[data.userId];
      return newTyping;
    });
  };

  const handleUserPresence = (data) => {
    setOnlineUsers(prev => ({
      ...prev,
      [data.userId]: { isOnline: data.isOnline, lastSeen: data.lastSeen },
    }));
  };

  const handleMessagesRead = (data) => {
    console.log('📖 Messages read event received:', {
      sessionId: data.sessionId,
      userId: data.userId,
      currentUserId: currentUserId,
      selectedSessionId: selectedChat?.session?.id,
      dataTypes: {
        sessionId: typeof data.sessionId,
        userId: typeof data.userId,
        currentUserId: typeof currentUserId
      }
    });
    
    // CRITICAL: Check if we have currentUserId
    if (!currentUserId) {
      console.error('❌ currentUserId is not set! Cannot update messages.');
      return;
    }
    
    // Update messages to 'read' status for messages I sent
    // The userId in the event is the person who READ the messages (recipient)
    // We need to update messages where from_user_id === currentUserId (messages I sent)
    const sessionMatch = selectedChat && Number(data.sessionId) === Number(selectedChat.session.id);
    console.log('🔍 Session match:', sessionMatch);
    
    if (sessionMatch) {
      console.log('🔍 Checking messages to update...');
      setMessages(prev => {
        const updated = prev.map(msg => {
          // Only update messages that I sent (from_user_id === currentUserId)
          const shouldUpdate = Number(msg.from_user_id) === Number(currentUserId);
          
          if (shouldUpdate) {
            console.log('✅ Updating message to read:', {
              id: msg.id,
              message: msg.message.substring(0, 30),
              from_user_id: msg.from_user_id,
              currentUserId: currentUserId,
              currentStatus: msg.status,
              newStatus: 'read'
            });
            return {
              ...msg,
              status: 'read',
              is_read: true,
              read_at: data.readAt || new Date(),
            };
          }
          return msg;
        });
        
        const updatedCount = updated.filter(m => m.status === 'read' && Number(m.from_user_id) === Number(currentUserId)).length;
        console.log('📊 Messages update complete. Total messages:', prev.length, 'Updated to read:', updatedCount);
        return updated;
      });
    } else {
      console.log('⚠️ Session mismatch or no selected chat', {
        hasSelectedChat: !!selectedChat,
        selectedSessionId: selectedChat?.session?.id,
        eventSessionId: data.sessionId
      });
    }
  };

  const handleMessageStatus = (data) => {
    console.log('📊 Message status update received:', {
      messageId: data.messageId,
      status: data.status,
      deliveredAt: data.deliveredAt,
      readAt: data.readAt
    });
    
    setMessages(prev =>
      prev.map(msg => {
        if (msg.id === data.messageId) {
          console.log('✅ Updating message status:', msg.id, 'to', data.status);
          return {
            ...msg,
            status: data.status,
            delivered_at: data.deliveredAt,
            read_at: data.readAt,
            is_read: data.status === 'read',
          };
        }
        return msg;
      })
    );
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const isUserOnline = (userId) => {
    return onlineUsers[userId]?.isOnline || false;
  };

  const isUserTyping = (userId) => {
    return typingUsers[userId] && typingUsers[userId].sessionId === selectedChat?.session?.id;
  };

  const isBlocked = () => {
    if (!selectedChat) return false;
    return selectedChat.block?.some(
      (item) => Number(item.blocked_by) === currentUserId || Number(item.blocked_by) === selectedChat.id
    );
  };

  return (
    <>
      <Head>
        <title>Messages - JodiMilan</title>
        <meta name="description" content="Real-time messaging for JodiMilan" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/images/favicon.jpg" />
      </Head>

      <Snackbar
        open={alert.open}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        onClose={() => setAlert({ ...alert, open: false })}
      >
        <Alert severity="success">{alert.message}</Alert>
      </Snackbar>

      <div className={styles.chatContainer}>
        {/* Chat List Sidebar */}
        <div className={`${styles.chatListSidebar} ${selectedChat ? styles.mobileHidden : ''}`}>
          <div className={styles.chatListHeader}>
            <span>Messages</span>
          </div>

          <div className={styles.searchBox}>
            <input
              type="text"
              placeholder="Search conversations..."
              className={styles.searchInput}
              onChange={handleSearch}
            />
          </div>

          <div className={styles.chatListScroll}>
            {friends.length > 0 ? (
              friends.map((friend) => (
                <div
                  key={friend.id}
                  className={`${styles.chatItem} ${selectedChat?.id === friend.id ? styles.active : ''}`}
                  onClick={() => handleChatSelect(friend)}
                >
                  <div className={styles.avatarContainer}>
                    {friend.profile ? (
                      <img src={friend.profile} alt={friend.name} className={styles.avatar} />
                    ) : (
                      <Image src={Avatar1} alt="avatar" className={styles.avatar} width={50} height={50} />
                    )}
                    {isUserOnline(friend.id) && <div className={styles.onlineIndicator} />}
                  </div>

                  <div className={styles.chatInfo}>
                    <div className={styles.chatName}>
                      {friend.name}
                      <span style={{ fontSize: '13px', color: '#999' }}>({friend.ryt_id})</span>
                    </div>
                    <div className={`${styles.lastMessage} ${isUserTyping(friend.id) ? styles.typing : ''}`}>
                      {isUserTyping(friend.id)
                        ? "typing..."
                        : friend.lastMessage?.message || "No messages yet"}
                    </div>
                  </div>

                  <div className={styles.chatMeta}>
                    {friend.lastMessageAt && (
                      <div className={styles.timestamp}>
                        {moment(friend.lastMessageAt).format("HH:mm")}
                      </div>
                    )}
                    {friend.session.unreadCount > 0 && (
                      <div className={styles.unreadBadge}>{friend.session.unreadCount}</div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
                {loading ? "Loading..." : "No conversations yet"}
              </div>
            )}
          </div>
        </div>

        {/* Chat Panel */}
        {selectedChat ? (
          <div className={`${styles.chatPanel} ${selectedChat ? styles.mobileVisible : ''}`}>
            {/* Chat Header */}
            <div className={styles.chatHeader}>
              <button
                className={styles.mobileBackButton}
                onClick={handleBackToList}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
              </button>

              <div className={styles.chatHeaderInfo}>
                {selectedChat.profile ? (
                  <img src={selectedChat.profile} alt={selectedChat.name} className={styles.chatHeaderAvatar} />
                ) : (
                  <Image src={Avatar1} alt="avatar" className={styles.chatHeaderAvatar} width={45} height={45} />
                )}

                <div className={styles.chatHeaderDetails}>
                  <div className={styles.chatHeaderName}>
                    {selectedChat.name} ({selectedChat.ryt_id})
                  </div>
                  <div className={styles.chatHeaderStatus}>
                    {isUserTyping(selectedChat.id)
                      ? "typing..."
                      : isUserOnline(selectedChat.id)
                      ? "Online"
                      : onlineUsers[selectedChat.id]?.lastSeen
                      ? `Last seen ${moment(onlineUsers[selectedChat.id].lastSeen).fromNow()}`
                      : "Offline"}
                  </div>
                </div>
              </div>

              <div className={styles.chatHeaderActions}>
                <Tooltip title={isBlocked() ? "Unblock user" : "Block user"}>
                  <button className={styles.iconButton} onClick={handleBlockUser}>
                    <BlockIcon />
                  </button>
                </Tooltip>
              </div>
            </div>

            {/* Messages Area */}
            <div className={styles.messagesArea}>
              {messages.map((msg, index) => {
                const prevDate = index > 0 ? moment(messages[index - 1].created_at).format("DD-MM-YYYY") : null;
                const currentDate = moment(msg.created_at).format("DD-MM-YYYY");
                const isMine = msg.from_user_id === currentUserId;
                
                // Debug logging - log all messages status
                if (index === 0) {
                  console.log('💬 Message Rendering Debug:', {
                    totalMessages: messages.length,
                    currentUserId: currentUserId,
                    messagesStatus: messages.map(m => ({
                      id: m.id,
                      from: m.from_user_id,
                      isMine: m.from_user_id === currentUserId,
                      status: m.status,
                      is_read: m.is_read,
                      message: m.message.substring(0, 20)
                    }))
                  });
                }

                return (
                  <React.Fragment key={msg.id}>
                    {prevDate !== currentDate && (
                      <div className={styles.dateSepar}>
                        <span className={styles.dateBadge}>
                          {currentDate === moment().format("DD-MM-YYYY")
                            ? "Today"
                            : currentDate === moment().add(-1, "days").format("DD-MM-YYYY")
                            ? "Yesterday"
                            : currentDate}
                        </span>
                      </div>
                    )}

                    <div className={`${styles.messageRow} ${isMine ? styles.sent : styles.received}`}>
                      <div className={`${styles.messageBubble} ${isMine ? styles.sent : styles.received}`}>
                        <div className={styles.messageText}>{msg.message}</div>
                        <div className={styles.messageFooter}>
                          <span className={styles.messageTime}>
                            {moment(msg.created_at).format("HH:mm")}
                          </span>
                          {isMine && <MessageStatus status={msg.status} isRead={msg.is_read} />}
                        </div>
                      </div>
                    </div>
                  </React.Fragment>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Typing Indicator */}
            {isUserTyping(selectedChat.id) && (
              <TypingIndicator userName={typingUsers[selectedChat.id]?.userName} />
            )}

            {/* Message Input */}
            {!isBlocked() && !userData?.user?.plan_expire ? (
              <div className={styles.messageInputContainer}>
                <input
                  type="text"
                  placeholder="Type a message..."
                  className={styles.messageInputField}
                  value={message}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                />
                <button
                  className={styles.sendButton}
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                >
                  <SendIcon />
                </button>
              </div>
            ) : (
              <div style={{ padding: '20px', textAlign: 'center', background: '#fff', borderTop: '1px solid #e0e0e0' }}>
                {isBlocked() ? "You can't reply to this conversation." : "Upgrade or Buy Plan."}
              </div>
            )}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyStateIcon}>💬</div>
            <div className={styles.emptyStateTitle}>No Chat Selected</div>
            <div className={styles.emptyStateText}>
              Select a conversation from the list to start messaging
            </div>
          </div>
        )}
      </div>
    </>
  );
}
