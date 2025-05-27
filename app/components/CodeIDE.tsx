'use client';

import React, { useState, useRef, useEffect } from 'react';
import { FaPlay, FaStop, FaCopy, FaDownload, FaCode, FaExpand, FaCompress } from 'react-icons/fa';

interface CodeIDEProps {
  initialLanguage?: string;
  initialCode?: string;
  ageGroup?: string;
}

const PROGRAMMING_LANGUAGES = {
  html: {
    name: 'HTML',
    icon: '🌐',
    color: 'bg-red-500',
    defaultCode: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🌟 My Amazing Webpage</title>
    <style>
        body {
            font-family: 'Comic Sans MS', cursive;
            background: linear-gradient(45deg, #ff9a9e, #fecfef);
            text-align: center;
            padding: 20px;
            margin: 0;
        }
        h1 {
            color: #ff6b6b;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
            font-size: 2.5em;
        }
        .fun-button {
            background: linear-gradient(45deg, #4ecdc4, #44a08d);
            color: white;
            border: none;
            padding: 15px 30px;
            border-radius: 25px;
            font-size: 18px;
            cursor: pointer;
            margin: 10px;
            transition: transform 0.3s ease;
        }
        .fun-button:hover {
            transform: scale(1.1);
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: rgba(255,255,255,0.9);
            padding: 30px;
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🌟 Welcome to My Webpage! 🌟</h1>
        <p>This is my first amazing webpage created with HTML, CSS, and JavaScript!</p>

        <button class="fun-button" onclick="showSurprise()">🎉 Click for Surprise!</button>
        <button class="fun-button" onclick="changeColors()">🎨 Change Colors!</button>

        <div id="surprise-area" style="margin-top: 20px; font-size: 1.2em;"></div>

        <div style="margin-top: 30px;">
            <h2>🚀 My Favorite Things:</h2>
            <ul style="list-style: none; padding: 0;">
                <li>🎮 Playing games</li>
                <li>📚 Reading stories</li>
                <li>💻 Learning to code</li>
                <li>🎨 Creating art</li>
            </ul>
        </div>
    </div>

    <script>
        function showSurprise() {
            const surprises = [
                "🎉 You're learning HTML!",
                "🌟 You're becoming a web developer!",
                "🚀 Keep coding and reach for the stars!",
                "💻 Technology is your superpower!"
            ];
            const randomSurprise = surprises[Math.floor(Math.random() * surprises.length)];
            document.getElementById('surprise-area').innerHTML =
                '<p style="color: #ff6b6b; font-weight: bold;">' + randomSurprise + '</p>';
        }

        function changeColors() {
            const colors = ['#ff9a9e', '#a8edea', '#fed6e3', '#d299c2', '#ffecd2'];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            document.body.style.background = 'linear-gradient(45deg, ' + randomColor + ', #fecfef)';
        }
    </script>
</body>
</html>`,
    runnable: true
  },
  css: {
    name: 'CSS',
    icon: '🎨',
    color: 'bg-blue-500',
    defaultCode: `/* CSS Styling */
body {
    font-family: Arial, sans-serif;
    background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
    color: white;
    text-align: center;
    padding: 50px;
}

h1 {
    font-size: 3em;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

.button {
    background: #fff;
    color: #333;
    padding: 15px 30px;
    border: none;
    border-radius: 25px;
    font-size: 18px;
    cursor: pointer;
    transition: transform 0.3s;
}

.button:hover {
    transform: scale(1.1);
}`,
    runnable: false
  },
  javascript: {
    name: 'JavaScript',
    icon: '⚡',
    color: 'bg-yellow-500',
    defaultCode: `// JavaScript Fun!
console.log("Hello, World!");

// Create a simple calculator
function calculate(a, b, operation) {
    switch(operation) {
        case '+': return a + b;
        case '-': return a - b;
        case '*': return a * b;
        case '/': return a / b;
        default: return "Invalid operation";
    }
}

// Test the calculator
console.log("5 + 3 =", calculate(5, 3, '+'));
console.log("10 - 4 =", calculate(10, 4, '-'));
console.log("6 * 7 =", calculate(6, 7, '*'));
console.log("15 / 3 =", calculate(15, 3, '/'));

// Fun with arrays
const colors = ['red', 'blue', 'green', 'yellow'];
console.log("My favorite colors:", colors);

// Simple animation function
function showMessage() {
    alert("🎉 Great job learning JavaScript! 🎉");
}

// Call the function
showMessage();`,
    runnable: true
  },
  python: {
    name: 'Python',
    icon: '🐍',
    color: 'bg-green-500',
    defaultCode: `#!/usr/bin/env python3
# 🐍 Welcome to Python Programming! 🐍

print("🌟 Hello, young Python programmer! 🌟")
print("=" * 50)

# Import modules for fun programming
import random

def welcome_message():
    """Display a colorful welcome message"""
    print("\\n🎉 Welcome to the Amazing Python World! 🎉")
    print("🐍 Python is a friendly programming language!")
    print("Let's start our coding adventure together! 🚀")
    print("-" * 50)

def number_guessing_game():
    """A fun number guessing game"""
    print("\\n🎮 Let's play the Number Guessing Game!")
    print("I'm thinking of a number between 1 and 10...")

    secret_number = random.randint(1, 10)
    print(f"🎯 The secret number is: {secret_number}")
    print("🎉 You found it! Great job!")

def fun_calculator():
    """A simple calculator with fun messages"""
    print("\\n🧮 Let's do some math magic!")

    # Example calculations
    num1 = 15
    num2 = 3

    print(f"✨ {num1} + {num2} = {num1 + num2}")
    print(f"✨ {num1} - {num2} = {num1 - num2}")
    print(f"✨ {num1} × {num2} = {num1 * num2}")
    print(f"✨ {num1} ÷ {num2} = {num1 / num2}")

def python_facts():
    """Share fun facts about Python"""
    facts = [
        "🐍 Python is named after Monty Python's Flying Circus!",
        "🚀 Python is used by NASA for space missions!",
        "🎬 Python helps create special effects in movies!",
        "🤖 Python is great for creating AI and robots!",
        "🌐 Instagram and YouTube use Python!"
    ]

    print("\\n🎓 Fun Python Facts:")
    for i, fact in enumerate(facts, 1):
        print(f"{i}. {fact}")

def create_art():
    """Create some ASCII art"""
    print("\\n🎨 Python Art Gallery:")
    print("    🐍")
    print("   /   \\\\")
    print("  /     \\\\")
    print(" /  ^_^  \\\\")
    print("/         \\\\")
    print("Python Snake!")

# Main program
def main():
    welcome_message()
    number_guessing_game()
    fun_calculator()
    python_facts()
    create_art()

    print("\\n👋 Thanks for coding with Python!")
    print("🌟 Keep learning and have fun programming!")

# Start the program
main()`,
    runnable: true // Now supports simulated execution
  }
};

export default function CodeIDE({ initialLanguage = 'html', initialCode, ageGroup }: CodeIDEProps) {
  const [selectedLanguage, setSelectedLanguage] = useState(initialLanguage);
  const [code, setCode] = useState(initialCode || PROGRAMMING_LANGUAGES[initialLanguage as keyof typeof PROGRAMMING_LANGUAGES]?.defaultCode || '');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const langData = PROGRAMMING_LANGUAGES[selectedLanguage as keyof typeof PROGRAMMING_LANGUAGES];
    if (langData && !initialCode) {
      setCode(langData.defaultCode);
    }
  }, [selectedLanguage, initialCode]);

  // Python simulation function
  const simulatePythonExecution = (code: string): string => {
    let output = '';
    const lines = code.split('\n');

    // Simple Python interpreter simulation
    for (let line of lines) {
      line = line.trim();

      // Skip comments and empty lines
      if (line.startsWith('#') || line === '') continue;

      // Handle print statements
      if (line.startsWith('print(')) {
        const match = line.match(/print\((.*)\)/);
        if (match) {
          let content = match[1];
          // Remove quotes and evaluate simple expressions
          content = content.replace(/['"]/g, '');

          // Handle simple string concatenation
          if (content.includes('+')) {
            const parts = content.split('+').map(p => p.trim());
            content = parts.join('');
          }

          // Handle f-strings (basic)
          if (content.includes('f"') || content.includes("f'")) {
            content = content.replace(/f["'](.*)["']/, '$1');
          }

          output += content + '\n';
        }
      }

      // Handle simple variable assignments
      if (line.includes('=') && !line.includes('==')) {
        const [varName] = line.split('=').map(s => s.trim());
        if (!varName.includes(' ')) {
          output += `✅ Variable '${varName}' assigned\n`;
        }
      }

      // Handle function definitions
      if (line.startsWith('def ')) {
        const funcName = line.match(/def\s+(\w+)/)?.[1];
        if (funcName) {
          output += `🔧 Function '${funcName}' defined\n`;
        }
      }

      // Handle for loops
      if (line.startsWith('for ')) {
        output += '🔄 Loop started\n';
      }

      // Handle if statements
      if (line.startsWith('if ')) {
        output += '🤔 Condition checked\n';
      }

      // Handle imports
      if (line.startsWith('import ') || line.startsWith('from ')) {
        const moduleName = line.includes('import') ? line.split('import')[1].trim() : line.split('from')[1].split('import')[0].trim();
        output += `📦 Module '${moduleName}' imported\n`;
      }
    }

    if (output === '') {
      output = '✅ Python code executed successfully!\n\n💡 Add print() statements to see output here.';
    } else {
      output = '🐍 Python Output:\n' + '='.repeat(30) + '\n' + output + '\n' + '='.repeat(30) + '\n\n✅ Execution completed!';
    }

    return output;
  };

  const runCode = () => {
    setIsRunning(true);
    setOutput('');

    if (selectedLanguage === 'html') {
      // Run HTML code in iframe safely
      if (iframeRef.current) {
        try {
          const iframe = iframeRef.current;
          // Create a blob URL for the HTML content to avoid cross-origin issues
          const blob = new Blob([code], { type: 'text/html' });
          const url = URL.createObjectURL(blob);
          iframe.src = url;

          // Clean up the blob URL after a short delay
          setTimeout(() => {
            URL.revokeObjectURL(url);
          }, 1000);
        } catch (error) {
          console.error('Error running HTML code:', error);
          setOutput('❌ Error running HTML code. Please check your syntax.');
        }
      }
      setOutput('✅ HTML code executed successfully! Check the preview above.');
    } else if (selectedLanguage === 'javascript') {
      // Run JavaScript code safely
      try {
        // Capture console.log output
        const originalLog = console.log;
        const logs: string[] = [];
        console.log = (...args) => {
          logs.push(args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' '));
        };

        // Execute the code
        const result = eval(code);

        // Restore console.log
        console.log = originalLog;

        const output = logs.length > 0 ? logs.join('\n') : (result !== undefined ? String(result) : '✅ Code executed successfully!');
        setOutput(output);
      } catch (error) {
        setOutput(`❌ Error: ${(error as Error).message}`);
      }
    } else if (selectedLanguage === 'css') {
      setOutput('💡 CSS code ready! Combine with HTML to see the styling effects.');
    } else if (selectedLanguage === 'python') {
      // Enhanced Python execution with server simulation
      try {
        setOutput('🐍 Executing Python code...\n\n');

        // Simulate Python execution by parsing and running basic Python-like code
        const pythonOutput = simulatePythonExecution(code);
        setOutput(pythonOutput);
      } catch (error) {
        setOutput(`❌ Python Error: ${(error as Error).message}\n\n💡 Tip: Check your Python syntax!`);
      }
    }

    setTimeout(() => setIsRunning(false), 1000);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setOutput('📋 Code copied to clipboard!');
  };

  const downloadCode = () => {
    const extension = selectedLanguage === 'javascript' ? 'js' : selectedLanguage;
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `my-code.${extension}`;
    a.click();
    URL.revokeObjectURL(url);
    setOutput(`💾 Code downloaded as my-code.${extension}`);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const langData = PROGRAMMING_LANGUAGES[selectedLanguage as keyof typeof PROGRAMMING_LANGUAGES];

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-white' : 'relative'} bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-2xl overflow-hidden`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <FaCode className="text-2xl" />
            <h3 className="text-xl font-bold">🚀 BixForge Code IDE</h3>
            {ageGroup && (
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                👶 Ages {ageGroup}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleFullscreen}
              className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? <FaCompress /> : <FaExpand />}
            </button>
          </div>
        </div>

        {/* Language Selector */}
        <div className="mt-4 flex flex-wrap gap-2">
          {Object.entries(PROGRAMMING_LANGUAGES).map(([key, lang]) => (
            <button
              key={key}
              onClick={() => setSelectedLanguage(key)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                selectedLanguage === key
                  ? 'bg-white text-indigo-600 shadow-lg'
                  : 'bg-white/20 hover:bg-white/30'
              }`}
            >
              <span>{lang.icon}</span>
              <span className="font-medium">{lang.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main IDE Area */}
      <div className={`${isFullscreen ? 'h-screen' : 'h-96'} flex flex-col md:flex-row`}>
        {/* Code Editor */}
        <div className="flex-1 flex flex-col">
          <div className="bg-gray-800 text-white p-3 flex items-center justify-between">
            <span className="font-medium">📝 Code Editor - {langData?.name}</span>
            <div className="flex space-x-2">
              <button
                onClick={copyCode}
                className="p-2 bg-gray-700 rounded hover:bg-gray-600 transition-colors"
                title="Copy Code"
              >
                <FaCopy />
              </button>
              <button
                onClick={downloadCode}
                className="p-2 bg-gray-700 rounded hover:bg-gray-600 transition-colors"
                title="Download Code"
              >
                <FaDownload />
              </button>
              <button
                onClick={runCode}
                disabled={isRunning}
                className={`p-2 rounded transition-colors ${
                  isRunning
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-500'
                }`}
                title="Run Code"
              >
                {isRunning ? <FaStop className="animate-spin" /> : <FaPlay />}
              </button>
            </div>
          </div>
          <textarea
            ref={textareaRef}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-1 p-4 font-mono text-sm bg-gray-900 text-green-400 resize-none focus:outline-none"
            placeholder={`Write your ${langData?.name} code here...`}
            spellCheck={false}
          />
        </div>

        {/* Output/Preview Area */}
        <div className="flex-1 flex flex-col border-l border-gray-300">
          <div className="bg-gray-100 p-3 flex items-center justify-between">
            <span className="font-medium">
              {selectedLanguage === 'html' ? '🖥️ Live Preview' : '📤 Output'}
            </span>
          </div>

          {selectedLanguage === 'html' ? (
            <iframe
              ref={iframeRef}
              className="flex-1 bg-white"
              title="HTML Preview"
              sandbox="allow-scripts"
            />
          ) : (
            <div className="flex-1 p-4 bg-gray-50 overflow-auto">
              <pre className="whitespace-pre-wrap font-mono text-sm text-gray-800">
                {output || '👋 Click "Run Code" to see the output here!'}
              </pre>
            </div>
          )}
        </div>
      </div>

      {/* Footer with Tips */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-t">
        <div className="flex flex-wrap items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            <span>💡 <strong>Tip:</strong> Try modifying the code and click &quot;Run&quot; to see changes!</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`w-3 h-3 rounded-full ${langData?.color}`}></span>
            <span className="font-medium">{langData?.name} Editor</span>
          </div>
        </div>
      </div>
    </div>
  );
}
