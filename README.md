# 📁 Smart Folder Auto-Organizer

A simple Node.js automation tool that organizes files inside a folder
based on their file type (Images, Videos, Documents, Music, etc).

This project was built as a learning exercise to understand:
- Node.js file system (`fs`)
- Paths and directories
- Automation scripts
- Real-world scripting logic

---

## ✨ Features

- Automatically detects file types by extension
- Creates category folders if they don’t exist
- Moves files into the correct folder
- Ignores folders (only organizes files)
- Simple, fast, and lightweight

---

## 📂 Folder Structure

project-root/
│
├── organize/ # Put files here
│ ├── Images/
│ ├── Videos/
│ ├── Documents/
│ ├── Music/
│ └── other/
└── index.js # Main script
