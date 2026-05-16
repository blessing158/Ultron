const chatBox = document.getElementById("chat-box");
const input = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

const menuBtn = document.getElementById("menuBtn");
const settings = document.getElementById("settings");
const clearMemory = document.getElementById("clearMemory");
const closeSettings = document.getElementById("closeSettings");

let memory = JSON.parse(localStorage.getItem("memory")) || [];

function saveMemory(){
  localStorage.setItem("memory", JSON.stringify(memory));
}

function addMessage(text, type){
  const div = document.createElement("div");
  div.className = `message ${type}`;
  div.innerText = text;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function typeText(text){
  const div = document.createElement("div");
  div.className = "message ai";
  chatBox.appendChild(div);

  let i = 0;
  let interval = setInterval(()=>{
    div.innerText += text[i];
    i++;
    chatBox.scrollTop = chatBox.scrollHeight;
    if(i >= text.length) clearInterval(interval);
  },15);
}

async function sendToAI(message){

  memory.push({role:"user", content:message});

  const res = await fetch("/api/chat", {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body: JSON.stringify({messages: memory})
  });

  const data = await res.json();
  const reply = data.reply;

  memory.push({role:"assistant", content: reply});
  saveMemory();

  typeText(reply);
}

sendBtn.onclick = () => {
  const text = input.value;
  if(!text.trim()) return;

  addMessage(text,"user");
  sendToAI(text);

  input.value="";
};

menuBtn.onclick = () => settings.classList.remove("hidden");
closeSettings.onclick = () => settings.classList.add("hidden");

clearMemory.onclick = () => {
  memory = [];
  localStorage.removeItem("memory");
  alert("Memory cleared");
};
