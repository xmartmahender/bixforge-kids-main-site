'use client';

import React, { useState, useEffect } from 'react';
import Header from '../components/header';
import Footer from '../components/footer';
import CodeIDE from '../components/CodeIDE';
import UserTracker from '../components/UserTracker';
import Link from 'next/link';
import { FaCode, FaGraduationCap, FaLightbulb, FaRocket } from 'react-icons/fa';

const CODE_EXAMPLES = {
  beginner: {
    html: `<!DOCTYPE html>
<html>
<head>
    <title>My First Page</title>
</head>
<body>
    <h1>Hello, I'm learning HTML!</h1>
    <p>This is my first web page.</p>
    <button onclick="alert('You clicked me!')">Click Me!</button>
</body>
</html>`,
    javascript: `// My first JavaScript program
console.log("Hello, World!");

// Let's do some math
let age = 8;
let nextYear = age + 1;
console.log("I am " + age + " years old");
console.log("Next year I will be " + nextYear);

// Fun with colors
let favoriteColor = "blue";
console.log("My favorite color is " + favoriteColor);`,
    css: `/* Make everything colorful! */
body {
    background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
    font-family: Arial, sans-serif;
    text-align: center;
    color: white;
}

h1 {
    font-size: 3em;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
}

button {
    background: #fff;
    color: #333;
    padding: 15px 30px;
    border: none;
    border-radius: 25px;
    font-size: 18px;
    cursor: pointer;
}`
  },
  intermediate: {
    html: `<!DOCTYPE html>
<html>
<head>
    <title>Interactive Page</title>
    <style>
        body { font-family: Arial; text-align: center; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; }
        button { padding: 10px 20px; margin: 5px; border: none; border-radius: 5px; cursor: pointer; }
        .primary { background: #007bff; color: white; }
        .success { background: #28a745; color: white; }
        #output { margin-top: 20px; padding: 20px; background: #f8f9fa; border-radius: 5px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>My Interactive Calculator</h1>
        <input type="number" id="num1" placeholder="First number">
        <input type="number" id="num2" placeholder="Second number">
        <br><br>
        <button class="primary" onclick="add()">Add</button>
        <button class="success" onclick="multiply()">Multiply</button>
        <div id="output">Result will appear here</div>
    </div>

    <script>
        function add() {
            let a = Number(document.getElementById('num1').value);
            let b = Number(document.getElementById('num2').value);
            document.getElementById('output').innerHTML = a + " + " + b + " = " + (a + b);
        }

        function multiply() {
            let a = Number(document.getElementById('num1').value);
            let b = Number(document.getElementById('num2').value);
            document.getElementById('output').innerHTML = a + " × " + b + " = " + (a * b);
        }
    </script>
</body>
</html>`,
    javascript: `// Interactive Story Game
let playerName = prompt("What's your name?") || "Hero";
let playerHealth = 100;
let playerScore = 0;

console.log("🎮 Welcome to the Adventure Game, " + playerName + "!");
console.log("Your health: " + playerHealth);

function exploreForest() {
    console.log("🌲 You enter a mysterious forest...");
    let randomEvent = Math.floor(Math.random() * 3);

    if (randomEvent === 0) {
        console.log("🍄 You found a magic mushroom! +20 health");
        playerHealth += 20;
        playerScore += 10;
    } else if (randomEvent === 1) {
        console.log("🐺 A wolf appears! -10 health");
        playerHealth -= 10;
    } else {
        console.log("💎 You found a treasure! +50 points");
        playerScore += 50;
    }

    console.log("Health: " + playerHealth + " | Score: " + playerScore);
}

// Play the game
exploreForest();
exploreForest();
exploreForest();

console.log("🎉 Game Over! Final Score: " + playerScore);`
  }
};

export default function CodePlaygroundPage() {
  const [selectedLevel, setSelectedLevel] = useState('beginner');
  const [selectedLanguage, setSelectedLanguage] = useState('html');
  const [selectedAgeGroup, setSelectedAgeGroup] = useState('6-9');

  // Handle URL parameters for direct linking from stories/videos
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const language = urlParams.get('language');
      const age = urlParams.get('age');
      const prefilledCode = urlParams.get('code');

      if (language && ['html', 'css', 'javascript', 'python'].includes(language)) {
        setSelectedLanguage(language);
      }

      if (age) {
        setSelectedAgeGroup(age);
      }

      // If there's prefilled code, we'll pass it to the IDE component
      if (prefilledCode) {
        // The CodeIDE component will handle this through initialCode prop
      }
    }
  }, []);

  const getCurrentExample = () => {
    // Check for prefilled code from URL
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const prefilledCode = urlParams.get('code');

      if (prefilledCode) {
        return decodeURIComponent(prefilledCode);
      }
    }

    const levelExamples = CODE_EXAMPLES[selectedLevel as keyof typeof CODE_EXAMPLES];
    if (levelExamples && selectedLanguage in levelExamples) {
      return levelExamples[selectedLanguage as keyof typeof levelExamples];
    }
    return '';
  };

  return (
    <div>
      <UserTracker contentType="code" />
      <Header />
      <div className="pt-20 min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <FaCode className="text-6xl text-indigo-600 mr-4" />
              <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Code Playground
              </h1>
              <FaRocket className="text-6xl text-purple-600 ml-4" />
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              🚀 Practice coding with our free online IDE! Write, run, and experiment with HTML, CSS, JavaScript, and Python.
              Perfect for students who want to practice after reading code stories!
            </p>
          </div>

          {/* Quick Navigation */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/code-stories" className="flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                <FaGraduationCap className="mr-2" />
                Learn with Code Stories
              </Link>
              <Link href="/code-videos" className="flex items-center px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">
                <FaCode className="mr-2" />
                Watch Code Videos
              </Link>
              <Link href="/" className="flex items-center px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                <FaLightbulb className="mr-2" />
                Back to Home
              </Link>
            </div>
          </div>

          {/* Settings Panel */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">🎯 Choose Your Coding Adventure</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Age Group */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">👶 Age Group</label>
                <select
                  value={selectedAgeGroup}
                  onChange={(e) => setSelectedAgeGroup(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="0-3">0-3</option>
                  <option value="3-6">3-6</option>
                  <option value="6-9">6-9</option>
                  <option value="9-12">9-12</option>
                </select>
              </div>

              {/* Difficulty Level */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">📈 Difficulty Level</label>
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="beginner">🌱 Beginner (First Steps)</option>
                  <option value="intermediate">🚀 Intermediate (More Fun)</option>
                </select>
              </div>

              {/* Programming Language */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">💻 Programming Language</label>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="html">🌐 HTML (Web Pages)</option>
                  <option value="css">🎨 CSS (Styling)</option>
                  <option value="javascript">⚡ JavaScript (Interactive)</option>
                  <option value="python">🐍 Python (Programming)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Code IDE */}
          <div className="mb-8">
            <CodeIDE
              initialLanguage={selectedLanguage}
              initialCode={getCurrentExample()}
              ageGroup={selectedAgeGroup}
            />
          </div>

          {/* Learning Tips */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl shadow-lg p-6 mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">💡 Coding Tips for Young Programmers</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg">
                <div className="text-2xl mb-2">🎯</div>
                <h4 className="font-semibold mb-2">Start Small</h4>
                <p className="text-sm text-gray-600">Begin with simple changes and gradually add more features.</p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <div className="text-2xl mb-2">🔍</div>
                <h4 className="font-semibold mb-2">Experiment</h4>
                <p className="text-sm text-gray-600">Try changing colors, text, and numbers to see what happens!</p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <div className="text-2xl mb-2">🐛</div>
                <h4 className="font-semibold mb-2">Debug Errors</h4>
                <p className="text-sm text-gray-600">Don&apos;t worry about mistakes - they help you learn!</p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <div className="text-2xl mb-2">🎉</div>
                <h4 className="font-semibold mb-2">Have Fun</h4>
                <p className="text-sm text-gray-600">Coding should be enjoyable and creative!</p>
              </div>
            </div>
          </div>

          {/* Example Projects */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">🚀 Project Ideas to Try</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="border border-gray-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                <h4 className="font-semibold text-indigo-600 mb-2">🌈 Colorful Webpage</h4>
                <p className="text-sm text-gray-600">Create a webpage about your favorite things with colors and images.</p>
              </div>
              <div className="border border-gray-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                <h4 className="font-semibold text-purple-600 mb-2">🎮 Simple Game</h4>
                <p className="text-sm text-gray-600">Build a number guessing game or a simple quiz.</p>
              </div>
              <div className="border border-gray-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                <h4 className="font-semibold text-green-600 mb-2">📱 Interactive Story</h4>
                <p className="text-sm text-gray-600">Create a choose-your-own-adventure story with buttons.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
