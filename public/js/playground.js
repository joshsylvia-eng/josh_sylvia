// Monaco Editor instance
let editor;
let currentLanguage = 'javascript';
let currentTheme = 'vs-dark';

// Language configurations
const languageConfigs = {
    javascript: { id: 'javascript', name: 'JavaScript', mode: 'javascript' },
    python: { id: 'python', name: 'Python', mode: 'python' },
    typescript: { id: 'typescript', name: 'TypeScript', mode: 'typescript' },
    html: { id: 'html', name: 'HTML', mode: 'html' },
    css: { id: 'css', name: 'CSS', mode: 'css' },
    json: { id: 'json', name: 'JSON', mode: 'json' },
    sql: { id: 'sql', name: 'SQL', mode: 'sql' },
    bash: { id: 'shell', name: 'Bash', mode: 'shell' },
    java: { id: 'java', name: 'Java', mode: 'java' },
    cpp: { id: 'cpp', name: 'C++', mode: 'cpp' },
    go: { id: 'go', name: 'Go', mode: 'go' }
};

// Load shared navigation component
async function loadNavigation() {
    try {
        const response = await fetch('components/navigation.html');
        const navigationHTML = await response.text();
        document.getElementById('navigation-container').innerHTML = navigationHTML;
        
        // Set active page based on current URL
        setActiveNavigation();
    } catch (error) {
        console.error('Error loading navigation:', error);
    }
}

// Set active navigation link based on current page
function setActiveNavigation() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    
    // Remove active classes
    navLinks.forEach(link => link.classList.remove('active'));
    sidebarLinks.forEach(link => link.classList.remove('active'));
    
    // Add active class to current page links
    if (currentPage === 'playground.html') {
        document.querySelector('.nav-link[href="playground.html"]')?.classList.add('active');
        document.querySelector('.sidebar-link[href="playground.html"]')?.classList.add('active');
    } else if (currentPage === 'index.html' || currentPage === '') {
        document.querySelector('.nav-link[href="index.html"]')?.classList.add('active');
        document.querySelector('.sidebar-link[href="index.html"]')?.classList.add('active');
    } else if (currentPage === 'tutorials.html') {
        document.querySelector('.nav-link[href="tutorials.html"]')?.classList.add('active');
        document.querySelector('.sidebar-link[href="tutorials.html"]')?.classList.add('active');
    } else if (currentPage === 'about.html') {
        document.querySelector('.nav-link[href="about.html"]')?.classList.add('active');
        document.querySelector('.sidebar-link[href="about.html"]')?.classList.add('active');
    } else if (currentPage === 'contact.html') {
        document.querySelector('.nav-link[href="contact.html"]')?.classList.add('active');
        document.querySelector('.sidebar-link[href="contact.html"]')?.classList.add('active');
    }
}

// Initialize Monaco Editor
function initializeMonacoEditor() {
    require.config({ paths: { vs: 'https://unpkg.com/monaco-editor@0.44.0/min/vs' }});
    require(['vs/editor/editor.main'], function () {
        const container = document.getElementById('code-editor');
        
        editor = monaco.editor.create(container, {
            value: getInitialCode(),
            language: languageConfigs[currentLanguage].mode,
            theme: currentTheme,
            automaticLayout: true,
            fontSize: 14,
            lineNumbers: 'on',
            minimap: { enabled: true },
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            bracketPairColorization: { enabled: true },
            suggest: { showKeywords: true, showSnippets: true }
        });

        // Update cursor position
        editor.onDidChangeCursorPosition(updateCursorPosition);
        
        // Save code to localStorage
        editor.onDidChangeModelContent(debounce(saveToLocalStorage, 1000));
    });
}

// Get initial code based on language
function getInitialCode() {
    const savedCode = localStorage.getItem(`playground-code-${currentLanguage}`);
    if (savedCode) {
        return savedCode;
    }
    
    const initialCodes = {
        javascript: `// Welcome to the JavaScript Playground!
function greet(name) {
    return \`Hello, \${name}!\`;
}

console.log(greet('World'));

// Try running this code with the "Run Code" button`,
        
        python: `# Welcome to the Python Playground!
def greet(name):
    return f"Hello, {name}!"

print(greet("World"))

# Try running this code with the "Run Code" button`,
        
        typescript: `// Welcome to the TypeScript Playground!
function greet(name: string): string {
    return \`Hello, \${name}!\`;
}

console.log(greet('World'));

// Try running this code with the "Run Code" button`,
        
        html: `<!DOCTYPE html>
<html>
<head>
    <title>Welcome to HTML Playground</title>
</head>
<body>
    <h1>Hello, World!</h1>
    <p>Welcome to the HTML Playground!</p>
</body>
</html>`,
        
        css: `/* Welcome to the CSS Playground! */
body {
    font-family: Arial, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    margin: 0;
    padding: 2rem;
}

.container {
    max-width: 800px;
    margin: 0 auto;
    background: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}`,
        
        json: `{
  "welcome": "JSON Playground",
  "message": "Welcome to the JSON Playground!",
  "data": {
    "type": "playground",
    "languages": ["JavaScript", "Python", "TypeScript", "HTML", "CSS"],
    "features": ["Syntax Highlighting", "Code Execution", "Auto-save"]
  }
}`,
        
        sql: `-- Welcome to the SQL Playground!
CREATE TABLE users (
    id INT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (name, email) VALUES 
('John Doe', 'john@example.com'),
('Jane Smith', 'jane@example.com');

SELECT * FROM users;`,
        
        bash: `#!/bin/bash
# Welcome to the Bash Playground!

echo "Hello, World!"
echo "Welcome to the Bash Playground!"

# Basic file operations
ls -la
pwd
whoami`,
        
        java: `// Welcome to the Java Playground!
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
        greet("Java Developer");
    }
    
    public static void greet(String name) {
        System.out.println("Hello, " + name + "!");
    }
}`,
        
        cpp: `// Welcome to the C++ Playground!
#include <iostream>
#include <string>

using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    greet("C++ Developer");
    return 0;
}

void greet(string name) {
    cout << "Hello, " << name << "!" << endl;
}`,
        
        go: `// Welcome to the Go Playground!
package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
    greet("Go Developer")
}

func greet(name string) {
    fmt.Printf("Hello, %s!\\n", name)
}`
    };
    
    return initialCodes[currentLanguage] || '';
}

// Update cursor position display
function updateCursorPosition(e) {
    const position = e.getPosition();
    const lineInfo = document.getElementById('line-info');
    if (lineInfo) {
        lineInfo.textContent = `Line ${position.lineNumber + 1}, Col ${position.column + 1}`;
    }
}

// Language change handler
function handleLanguageChange() {
    const select = document.getElementById('language-select');
    const newLanguage = select.value;
    
    if (newLanguage !== currentLanguage) {
        // Save current code before switching
        saveToLocalStorage();
        
        currentLanguage = newLanguage;
        
        // Update editor language
        if (editor) {
            monaco.editor.setModelLanguage(editor.getModel(), languageConfigs[newLanguage].mode);
        }
        
        // Update language info
        const languageInfo = document.getElementById('language-info');
        if (languageInfo) {
            languageInfo.textContent = languageConfigs[newLanguage].name;
        }
        
        // Load saved code for new language
        const savedCode = localStorage.getItem(`playground-code-${newLanguage}`);
        if (savedCode && editor) {
            editor.setValue(savedCode);
        } else if (editor) {
            editor.setValue(getInitialCode());
        }
    }
}

// Theme change handler
function handleThemeChange() {
    const select = document.getElementById('theme-select');
    const newTheme = select.value;
    
    if (newTheme !== currentTheme) {
        currentTheme = newTheme;
        
        // Update editor theme
        if (editor) {
            monaco.editor.setTheme(newTheme);
        }
        
        // Save theme preference
        localStorage.setItem('playground-theme', newTheme);
    }
}

// Save code to localStorage
function saveToLocalStorage() {
    if (editor) {
        const code = editor.getValue();
        localStorage.setItem(`playground-code-${currentLanguage}`, code);
    }
}

// Run code handler
function runCode() {
    if (!editor) return;
    
    const code = editor.getValue();
    const outputContainer = document.getElementById('output-container');
    const consoleContainer = document.getElementById('console-container');
    
    // Clear previous output
    outputContainer.innerHTML = '';
    consoleContainer.innerHTML = '';
    
    try {
        let result;
        
        switch (currentLanguage) {
            case 'javascript':
                result = runJavaScript(code);
                break;
            case 'python':
                outputContainer.innerHTML = '<div class="output-error">Python execution is not available in this browser-based playground. Please use a Python environment to run this code.</div>';
                return;
            case 'typescript':
                outputContainer.innerHTML = '<div class="output-error">TypeScript execution is not available in this browser-based playground. Please compile to JavaScript first.</div>';
                return;
            case 'html':
                result = runHTML(code);
                break;
            case 'css':
                outputContainer.innerHTML = '<div class="output-error">CSS execution is not available in this playground. Please use HTML with embedded CSS.</div>';
                return;
            case 'json':
                result = runJSON(code);
                break;
            case 'sql':
                outputContainer.innerHTML = '<div class="output-error">SQL execution is not available in this browser-based playground. Please use a SQL database to run this code.</div>';
                return;
            case 'bash':
                outputContainer.innerHTML = '<div class="output-error">Bash execution is not available in this browser-based playground for security reasons.</div>';
                return;
            case 'java':
                outputContainer.innerHTML = '<div class="output-error">Java execution is not available in this browser-based playground. Please use a Java environment to run this code.</div>';
                return;
            case 'cpp':
                outputContainer.innerHTML = '<div class="output-error">C++ execution is not available in this browser-based playground. Please use a C++ compiler to run this code.</div>';
                return;
            case 'go':
                outputContainer.innerHTML = '<div class="output-error">Go execution is not available in this browser-based playground. Please use a Go environment to run this code.</div>';
                return;
            default:
                outputContainer.innerHTML = '<div class="output-error">Code execution is not available for this language in this browser-based playground.</div>';
                return;
        }
        
        if (result !== undefined) {
            displayOutput(result, 'success');
        }
        
    } catch (error) {
        displayOutput(`Error: ${error.message}`, 'error');
        console.error('Code execution error:', error);
    }
}

// JavaScript execution
function runJavaScript(code) {
    const originalLog = console.log;
    const logs = [];
    
    // Override console.log to capture output
    console.log = function(...args) {
        logs.push(args.join(' '));
        originalLog.apply(console, args);
    };
    
    try {
        const result = eval(code);
        
        // Restore original console.log
        console.log = originalLog;
        
        // Display logs in console
        const consoleContainer = document.getElementById('console-container');
        logs.forEach(log => {
            const logElement = document.createElement('div');
            logElement.className = 'output-log';
            logElement.textContent = log;
            consoleContainer.appendChild(logElement);
        });
        
        return result;
        
    } catch (error) {
        // Restore original console.log
        console.log = originalLog;
        throw error;
    }
}

// HTML execution
function runHTML(code) {
    const outputContainer = document.getElementById('output-container');
    const iframe = document.createElement('iframe');
    iframe.style.width = '100%';
    iframe.style.height = '400px';
    iframe.style.border = '1px solid #ddd';
    iframe.style.borderRadius = '4px';
    
    outputContainer.appendChild(iframe);
    
    const doc = iframe.contentDocument || iframe.contentWindow.document;
    doc.open();
    doc.write(code);
    doc.close();
    
    return 'HTML rendered in iframe above';
}

// JSON validation
function runJSON(code) {
    try {
        const parsed = JSON.parse(code);
        return JSON.stringify(parsed, null, 2);
    } catch (error) {
        throw new Error(`Invalid JSON: ${error.message}`);
    }
}

// Display output
function displayOutput(content, type = 'log') {
    const outputContainer = document.getElementById('output-container');
    const outputElement = document.createElement('div');
    outputElement.className = `output-${type}`;
    
    if (typeof content === 'object') {
        outputElement.textContent = JSON.stringify(content, null, 2);
    } else {
        outputElement.textContent = content;
    }
    
    outputContainer.appendChild(outputElement);
}

// Clear code
function clearCode() {
    if (editor) {
        editor.setValue('');
        saveToLocalStorage();
    }
}

// Clear output
function clearOutput() {
    document.getElementById('output-container').innerHTML = '<div class="output-placeholder">Run your code to see output here...</div>';
}

// Clear console
function clearConsole() {
    document.getElementById('console-container').innerHTML = '<div class="console-placeholder">Console output will appear here...</div>';
}

// Save code
function saveCode() {
    if (!editor) return;
    
    const code = editor.getValue();
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `playground-${currentLanguage}-${Date.now()}.${getFileExtension()}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Get file extension
function getFileExtension() {
    const extensions = {
        javascript: 'js',
        typescript: 'ts',
        html: 'html',
        css: 'css',
        json: 'json',
        sql: 'sql',
        bash: 'sh',
        java: 'java',
        cpp: 'cpp',
        go: 'go'
    };
    return extensions[currentLanguage] || 'txt';
}

// Share code
function shareCode() {
    if (!editor) return;
    
    const code = editor.getValue();
    const encodedCode = btoa(encodeURIComponent(code));
    const shareUrl = `${window.location.origin}${window.location.pathname}?code=${encodedCode}&lang=${currentLanguage}`;
    
    document.getElementById('share-url').value = shareUrl;
    
    const embedCode = `<iframe src="${shareUrl}" width="800" height="600" frameborder="0"></iframe>`;
    document.getElementById('embed-code').value = embedCode;
    
    document.getElementById('shareModal').style.display = 'block';
}

// Copy share URL
function copyShareUrl() {
    const shareUrl = document.getElementById('share-url');
    shareUrl.select();
    document.execCommand('copy');
    
    // Show feedback
    const button = event.target;
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-check"></i> Copied!';
    setTimeout(() => {
        button.innerHTML = originalText;
    }, 2000);
}

// Close share modal
function closeShareModal() {
    document.getElementById('shareModal').style.display = 'none';
}

// Debounce utility
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize playground
document.addEventListener('DOMContentLoaded', function() {
    loadNavigation();
    initializeMonacoEditor();
    
    // Load saved preferences
    const savedTheme = localStorage.getItem('playground-theme');
    if (savedTheme) {
        currentTheme = savedTheme;
        document.getElementById('theme-select').value = savedTheme;
    }
    
    // Event listeners
    document.getElementById('language-select').addEventListener('change', handleLanguageChange);
    document.getElementById('theme-select').addEventListener('change', handleThemeChange);
    document.getElementById('run-code').addEventListener('click', runCode);
    document.getElementById('clear-code').addEventListener('click', clearCode);
    document.getElementById('clear-output').addEventListener('click', clearOutput);
    document.getElementById('clear-console').addEventListener('click', clearConsole);
    document.getElementById('save-code').addEventListener('click', saveCode);
    document.getElementById('share-code').addEventListener('click', shareCode);
    
    // Check for shared code in URL
    const urlParams = new URLSearchParams(window.location.search);
    const sharedCode = urlParams.get('code');
    const sharedLang = urlParams.get('lang');
    
    if (sharedCode && sharedLang && languageConfigs[sharedLang]) {
        document.getElementById('language-select').value = sharedLang;
        currentLanguage = sharedLang;
        
        setTimeout(() => {
            if (editor) {
                const decodedCode = decodeURIComponent(atob(sharedCode));
                editor.setValue(decodedCode);
            }
        }, 1000);
    }
});

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('shareModal');
    if (event.target === modal) {
        closeShareModal();
    }
}

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeShareModal();
    }
});
