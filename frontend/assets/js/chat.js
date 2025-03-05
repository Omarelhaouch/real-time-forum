let ws;
// Choose send messages
const ignore = document.getElementById("message");
const post = document.getElementById("posts");
const right_side_bare = document.getElementById("categories");
const area_msg = document.getElementById("area-msg");
const notif = document.querySelector(".notif");

document.addEventListener("click", (event) => {
  const messageElement = event.target.closest("#message");
  if (messageElement) {
    notif.style.display = "none";
    area_msg.style.display = "flex";
    right_side_bare.style.display = "none";
    post.style.display = "none";
  }
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
const chat = document.getElementById("chat");
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
    const messageDiv = document.createElement("div");
    messageDiv.className = "messages sent";
    messageDiv.innerHTML = `
      <div class="message-bubble">
          <div class="message-content">${message}</div>
          <div class="message-time">${time}</div>
      </div>
`;
    messagesArea.appendChild(messageDiv);
    messageInput.value = "";
    messagesArea.scrollTop = messagesArea.scrollHeight;
  }
}

sendButton.addEventListener("click", sendMessage);
messageInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    sendMessage();
  }
});

function connectWebSocket() {
  ws = new WebSocket("ws://localhost:9090/ws");

  ws.onopen = () => {
    console.log("Connected to chat");
  };

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === "users_list") {
      addFriend(data.usernames, data.user_ids, data.user_statuses);
      return;
    }
    if (data.type === "message") {
      const messageElement = document.createElement("div");
      messageElement.className = "messages received";
      const time = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      messageElement.innerHTML = `
        <div class="message-bubble">
          <div class="message-content">${data.content}</div>
          <div class="message-time">${time}</div>
        </div>
      `;
      // <div class="message-details">
      // <span class="message-author">${data.username}</span>
      messagesArea.appendChild(messageElement);
      messagesArea.scrollTop = messagesArea.scrollHeight;
    }
  };
  ws.onerror = (event) => console.log(event);
  ws.onclose = () => {
    console.log("Disconnected from chat");
    setTimeout(connectWebSocket, 5000);
  };
}

function addFriend(friends, userIds, userStatuses) {
  const friendsList = document.querySelector(".allfriends");
  friendsList.innerHTML = "";

  friends.forEach((friend) => {
    const userId = userIds[friend];
    const status = userStatuses[friend];

    const friendElement = document.createElement("div");
    friendElement.className = "friend";
    friendElement.innerHTML = `
          <div class="friend-avatar">
              <img src="../../assets/images/profile.png" class="profile-img" alt="${friend}">
              <div class="status ${status}" id="user-${userId}"></div>
          </div>
          <div class="friend-info">
              <div class="friend-name">${friend}</div>
          </div>`;

    // Set initial status
    const statusElement = friendElement.querySelector(`#user-${userId}`);
    statusElement.classList.toggle("online", status === "online");
    statusElement.classList.toggle("offline", status === "offline");

    friendElement.addEventListener("click", () => {
      messagesArea.innerHTML = "";
      const show_user = document.getElementById("user-receiver");
      friends_list.style.display = window.innerWidth <= 780 ? "none" : "block";
      chat_box.style.display = "flex";
      show_user.innerText = friend;
      fetchChatHistory(userId, 0);
    });

    friendsList.appendChild(friendElement);
  });
}
connectWebSocket();
let isLoading = false;
let messageOffset = 0;
const MESSAGES_PER_PAGE = 10;

async function fetchChatHistory(userId, offset = 0) {
  await fetch(`/api/chat/history?user_id=${userId}&offset=${offset}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Error fetching chat history: ${response.statusText}`);
      }
      return response.json();
    })
    .then((data) => {
      data.messages.reverse().forEach((mess) => {
        const messageDiv = displayMessage(mess, userId);
        messagesArea.appendChild(messageDiv);
      });
      messagesArea.scrollTop = messagesArea.scrollHeight;
    })
    .catch((error) => {
      console.error(error);
      return [];
    });
}

// Message display functions
function displayMessage(message, currentUserId) {
  const messageDiv = document.createElement("div");
  const time = new Date(message.timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  // Fix message direction logic
  const isSent = parseInt(message.sender_id) !== parseInt(currentUserId);
  messageDiv.className = `messages ${isSent ? "sent" : "received"}`;

  messageDiv.innerHTML = `
    <div class="message-bubble">
      <div class="message-content">${message.content}</div>
      <div class="message-time">${time}</div>
    </div>
  `;
  return messageDiv;
}

function displayChatHistory(messages, currentUserId) {
  messages.forEach((message) => {
    messagesArea.appendChild(displayMessage(message, currentUserId));
  });
}

// Scroll handler for infinite loading
// document.getElementById("messages").addEventListener("scroll", async (e) => {
//   const messagesArea = e.target;

//   if (chat.scrollTop === 0 && !isLoading) {
//     isLoading = true;
//     messageOffset += MESSAGES_PER_PAGE;

//     const userId = document.getElementById("user-receiver").dataset.userId;
//     await fetchChatHistory(userId, messageOffset);

//     isLoading = false;
//   }
// });

// Load initial messages when selecting a chat
// async function loadInitialChat(userId) {
//   const messages = await fetchChatHistory(userId);
//   const messagesArea = document.getElementById("messages");
//   messagesArea.innerHTML = "";
//   messageOffset = 0;
//   displayChatHistory(messages, currentUserId);
//   chat.scrollTop = chat.scrollHeight;
// }
