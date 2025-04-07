# 🌱 GROOT — Build Your Own Version Control System

Welcome to my devops project!
Groot is a personal version control system, just like GIT.

“I am GROOT!”🚀  
> A custom-made version control system built in **Node.js**, inspired by Git’s core functionalities. GROOT helps you understand the internals of version control by building your own!

## 📦 Features

- ✅ Initialize a new repository
- ✅ Track and stage files
- ✅ Commit changes with meaningful messages
- ✅ Maintain a commit history
- ✅ Custom `.groot` directory for repository management
- ✅ Educational project to understand Git from scratch

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher recommended)
- Basic understanding of Git concepts (optional but helpful!)

### Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/Jay9093/My-own-git---GROOT.git
   cd My-own-git---GROOT
   ```

2. Install dependencies (if any):
   ```bash
   npm init
   npm i chalk
   npm i diff
   npm i commander
   ```

## ⚙️ Usage

Here’s how you can use GROOT commands:

- **Initialize a GROOT repository:**
  ```bash
  groot init
  ```

- **Add files to staging area:**
  ```bash
  groot add <filename>
  ```

- **Commit changes:**
  ```bash
  groot commit "Your commit message"
  ```

- **View commit history:**
  ```bash
  groot log
  ```
  
- **View difference in commits:**
  ```bash
  groot show <commitHash>
  ```

## 🤝 Contributing

Want to improve GROOT? Contributions are welcome!

1. Fork the project
2. Create your feature branch (`git checkout -b feature/feature-name`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature/feature-name`)
5. Open a pull request

## 🙌 Acknowledgements
- Youtube tutorials on git fundamentals and VC systems

Happy coding! 😊
