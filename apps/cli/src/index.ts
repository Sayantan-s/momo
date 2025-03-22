import { io } from "socket.io-client";
import inquirer from "inquirer";
import "colorts/lib/string";

let state = {}; // Holds the latest Redux state
let currentPath = []; // Tracks navigation path
let expandedKeys = new Set(); // Stores expanded keys

const socket = io("ws://localhost:5001");

socket.on("connect", () => {
  console.log("📡 Connected to Redux state stream");
});

socket.on("redux-update", (newState) => {
  console.clear();
  console.log("🔄 Redux State Updated:");
  state = newState;
  renderMenu();
});

socket.on("disconnect", () => {
  console.log("❌ Connection lost");
});

// 🔥 Render Menu for Navigation
async function renderMenu() {
  let data = state;
  currentPath.forEach((key) => {
    data = data[key];
  });

  if (typeof data !== "object" || data === null) {
    console.log("📄 Value:".green, JSON.stringify(data, null, 2));
    currentPath.pop(); // Auto back
    return renderMenu();
  }

  const choices = Object.keys(data).map((key) => {
    const isExpanded = expandedKeys.has(key);
    const value = data[key];

    return {
      name: isExpanded ? `📂 ${key.green} (expanded)` : `📁 ${key.yellow}`,
      value: key,
    };
  });

  if (currentPath.length > 0) {
    choices.unshift({ name: "🔙 Back", value: "__back" });
  }

  choices.push({ name: "🔄 Refresh", value: "__refresh" });

  const { selectedKeys } = await inquirer.prompt([
    {
      type: "checkbox",
      name: "selectedKeys",
      message: "🔍 Toggle to expand/collapse:",
      choices,
    },
  ]);

  if (selectedKeys.includes("__back")) {
    currentPath.pop();
  } else if (selectedKeys.includes("__refresh")) {
    // Refresh UI
  } else {
    selectedKeys.forEach((key) => {
      if (expandedKeys.has(key)) {
        expandedKeys.delete(key);
      } else {
        expandedKeys.add(key);
      }
    });
  }

  console.clear();
  console.log("📜 Redux State Explorer".green);
  expandedKeys.forEach((key: any) => {
    console.log(`${key}`.green, JSON.stringify(data[key], null, 2));
  });

  renderMenu();
}
