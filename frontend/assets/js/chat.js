let ws;
<<<<<<< HEAD
let userID = 0;
let isLoading = false;
let messageOffset = 0;
const MESSAGES_PER_PAGE = 10;

// DOM Elements
=======

// Choose send messages
>>>>>>> 1c42004 (stattus)
const ignore = document.getElementById("message");
const post = document.getElementById("posts");
const right_side_bare = document.getElementById("categories");
const area_msg = document.getElementById("area-msg");
const notif = document.querySelector(".notif");
<<<<<<< HEAD
const friends_list = document.querySelector(".friends-list");
const chat_box = document.querySelector(".chat-box");
const messageInput = document.getElementById("messageInput");
const sendButton = document.getElementById("sendButton");
const messagesArea = document.getElementById("messages");
const r = document.getElementById("user-receiver");
const chat = document.getElementById("chat");

// Event Listeners
document.addEventListener("click", handleDocumentClick);
sendButton.addEventListener("click", sendMessage);
messageInput.addEventListener("keypress", handleKeyPress);

if (window.innerWidth <= 780) {
  const friend = document.querySelector(".friend");
  const back = document.querySelector(".back");
  const close_message = document.querySelector(".close-message");

  if (friend) friend.addEventListener("click", showChatBox);
  if (back) back.addEventListener("click", showFriendsList);
  if (close_message) close_message.addEventListener("click", closeMessageArea);
}

// Functions
function handleDocumentClick(event) {
=======

document.addEventListener("click", (event) => {
>>>>>>> 1c42004 (stattus)
  const messageElement = event.target.closest("#message");
  if (messageElement) {
    notif.style.display = "none";
    area_msg.style.display = "flex";
    right_side_bare.style.display = "none";
    post.style.display = "none";
  }
<<<<<<< HEAD
}

function handleKeyPress(e) {
  if (e.key === "Enter") {
    sendMessage();
  }
}

function showChatBox() {
  friends_list.style.display = "none";
  chat_box.style.display = "flex";
}

function showFriendsList() {
  friends_list.style.display = "block";
  chat_box.style.display = "none";
}

function closeMessageArea() {
  area_msg.style.display = "none";
  post.style.display = "flex";
  notif.style.display = "flex";
}
=======
});

// Change friend
const friends_list = document.querySelector(".friends-list");
const chat_box = document.querySelector(".chat-box");
if (window.innerWidth <= 780) {
  const friend = document.querySelector(".friend");
  const back = document.querySelector(".back");
  const close_message = document.querySelector(".close-message");

  if (friend) {
    friend.addEventListener("click", () => {
      friends_list.style.display = "none";
      chat_box.style.display = "flex";
    });
  }

  if (back) {
    back.addEventListener("click", () => {
      friends_list.style.display = "block";
      chat_box.style.display = "none";
    });
  }

  if (close_message) {
    close_message.addEventListener("click", () => {
      area_msg.style.display = "none";
      post.style.display = "flex";
      notif.style.display = "flex";
    });
  }
}

// SCROLL TO BOTTOM
const messageInput = document.getElementById("messageInput");
const sendButton = document.getElementById("sendButton");
const messagesArea = document.getElementById("messages");
const r = document.getElementById("user-receiver");
>>>>>>> 1c42004 (stattus)

function sendMessage() {
  const message = messageInput.value.trim();
  if (message) {
    const time = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    if (ws) {
      ws.send(
        JSON.stringify({
          type: "message",
          username: r.innerText,
          content: message,
          timestamp: new Date().toISOString(),
        })
      );
    }
<<<<<<< HEAD
    const messageDiv = createMessageElement(message, time, "sent");
=======
    const messageDiv = document.createElement("div");
    messageDiv.className = "messages sent";
    messageDiv.innerHTML = `
<div>${message}</div>
<div class="message-time">${time}</div>
`;
>>>>>>> 1c42004 (stattus)
    messagesArea.appendChild(messageDiv);
    messageInput.value = "";
    messagesArea.scrollTop = messagesArea.scrollHeight;
  }
}

<<<<<<< HEAD
function createMessageElement(content, time, type) {
  const messageDiv = document.createElement("div");
  messageDiv.className = `messages ${type}`;
  messageDiv.innerHTML = `
    <div class="message-bubble">
      <div class="message-content">${content}</div>
      <div class="message-time">${time}</div>
    </div>
  `;
  return messageDiv;
}
=======
sendButton.addEventListener("click", sendMessage);
messageInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    sendMessage();
  }
});
>>>>>>> 1c42004 (stattus)

function connectWebSocket() {
  ws = new WebSocket("ws://localhost:9090/ws");

<<<<<<< HEAD
  ws.onopen = () => console.log("Connected to chat");
  ws.onmessage = handleWebSocketMessage;
=======
  ws.onopen = () => {
    console.log("Connected to chat");
  };

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log(event.data); // {"type":"users_list","usernames":["basta","omarel"],"user_statuses":{"basta":"offline","omarel":"online"},"user_ids":{"basta":2,"omarel":1}}

    if (data.type === "users_list") {
      console.log(data.usernames, data.user_ids, data.user_statuses);

      addFriend(data.usernames, data.user_ids, data.user_statuses);
      return;
    }

    if (data.type === "message") {
      const messagesContainer = document.getElementById("messages");
      const messageElement = document.createElement("div");
      messageElement.className = "received";
      messageElement.innerHTML = `
              <div class="message-header" style="display: flex; justify-content: space-between">
                  <span class="message-author">${data.username}</span>
                  <span class="message-time">${data.timestamp}</span>
              </div>
              <div class="message-content">${data.content}</div>
          `;
      messagesContainer.appendChild(messageElement);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  };
>>>>>>> 1c42004 (stattus)
  ws.onerror = (event) => console.log(event);
  ws.onclose = () => {
    console.log("Disconnected from chat");
    setTimeout(connectWebSocket, 5000);
  };
}

<<<<<<< HEAD
function handleWebSocketMessage(event) {
  const data = JSON.parse(event.data);
  if (data.type === "users_list") {
    addFriend(data.usernames, data.user_ids, data.user_statuses);
    return;
  }
  if (data.type === "message") {
    const time = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const messageElement = createMessageElement(data.content, time, "received");
    messagesArea.appendChild(messageElement);
    messagesArea.scrollTop = messagesArea.scrollHeight;
  }
}

=======
>>>>>>> 1c42004 (stattus)
function addFriend(friends, userIds, userStatuses) {
  const friendsList = document.querySelector(".allfriends");
  friendsList.innerHTML = "";

  friends.forEach((friend) => {
    const userId = userIds[friend];
    const status = userStatuses[friend];

    const friendElement = document.createElement("div");
    friendElement.className = "friend";
    friendElement.innerHTML = `
<<<<<<< HEAD
      <div class="friend-avatar">
        <img src="../../assets/images/profile.png" class="profile-img" alt="${friend}">
        <div class="status ${status}" id="user-${userId}"></div>
      </div>
      <div class="friend-info">
        <div class="friend-name">${friend}</div>
      </div>`;

=======
          <div class="friend-avatar">
              <img src="../../assets/images/profile.png" class="profile-img" alt="${friend}">
              <div class="status ${status}" id="user-${userId}"></div>
          </div>
          <div class="friend-info">
              <div class="friend-name">${friend}</div>
          </div>`;

    // Set initial status
>>>>>>> 1c42004 (stattus)
    const statusElement = friendElement.querySelector(`#user-${userId}`);
    statusElement.classList.toggle("online", status === "online");
    statusElement.classList.toggle("offline", status === "offline");

    friendElement.addEventListener("click", () => {
<<<<<<< HEAD
      messagesArea.innerHTML = "";
=======
>>>>>>> 1c42004 (stattus)
      const show_user = document.getElementById("user-receiver");
      friends_list.style.display = window.innerWidth <= 780 ? "none" : "block";
      chat_box.style.display = "flex";
      show_user.innerText = friend;
<<<<<<< HEAD
      messageOffset = 0;
      fetchChatHistory(userId, messageOffset);
      if (messagesArea && userID == 0) {
        userID = userId;
        messagesArea.addEventListener("scroll", async () => {
          if (messagesArea.scrollTop === 0 && !isLoading && userID !== 0) {
            isLoading = true;
            await fetchChatHistory(userID, messageOffset);
            isLoading = false;
          }
        });
      }
=======
>>>>>>> 1c42004 (stattus)
    });

    friendsList.appendChild(friendElement);
  });
}
<<<<<<< HEAD

async function fetchChatHistory(userId, offset = 0) {
  await fetch(`/api/chat/history?user_id=${userId}&offset=${offset}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Error fetching chat history: ${response.statusText}`);
      }
      return response.json();
    })
    .then((data) => {
      messageOffset += 10;
      data.messages.forEach((mess) => {
        const messageDiv = displayMessage(mess, userId);
        messagesArea.prepend(messageDiv);
      });
      messagesArea.scrollTop = messageOffset <= 10 ? messagesArea.scrollHeight : 60;
    })
    .catch((error) => {
      console.error(error);
      return [];
    });
}

function displayMessage(message, currentUserId) {
  const time = new Date(message.timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const isSent = parseInt(message.sender_id) !== parseInt(currentUserId);
  return createMessageElement(message.content, time, isSent ? "sent" : "received");
}

=======
>>>>>>> 1c42004 (stattus)
connectWebSocket();
