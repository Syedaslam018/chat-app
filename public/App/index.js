function sendMessage() {
    var message = document.getElementById("message-input").value;
    var chatBox = document.getElementById("chat-box");
    chatBox.innerHTML += "<p>" + message + "</p>";
    document.getElementById("message-input").value = "";
  }
  
  document.getElementById("send-button").addEventListener("click", sendMessage);