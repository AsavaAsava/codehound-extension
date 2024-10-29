# CodeHound - Security Vulnerability Detection Extension

CodeHound is a Visual Studio Code extension that helps developers identify and resolve security vulnerabilities in their JavaScript code. It currently focuses on detecting common risks such as SQL Injection and Cross-Site Scripting (XSS), offering real-time feedback and suggestions for secure coding practices.

## Features
🛡️ Detect SQL Injection & XSS Vulnerabilities: Scans your JavaScript code for patterns that could lead to security risks, such as SQL Injection and XSS attacks.

⚡ Real-Time Feedback: Detects vulnerabilities as you type or modify files, highlighting issues directly in the code editor.

📋 Problems Panel Integration: Lists all detected vulnerabilities in VS Code’s Problems panel for easy access and navigation.

🔄 Auto Analysis: Automatically analyzes open JavaScript files for security risks when you open or edit them.

## Installation
Open Visual Studio Code.
Go to the Extensions view by clicking on the Extensions icon in the Activity Bar on the side of the window.
Search for CodeHound and click Install.
Alternatively, you can install CodeHound via the command line:



## How to Use
Once installed, CodeHound will automatically start scanning your JavaScript files for security vulnerabilities. Here’s how you can interact with the extension:

Real-Time Detection: As you type or edit JavaScript code, CodeHound will automatically highlight vulnerabilities (such as SQL Injection and XSS risks) using red squiggly underlines.

Problems Panel: Detected issues are also listed in the Problems panel with detailed error messages and line numbers for easy navigation.

## Examples
### Unsafe Code (Flagged for SQL Injection)

```
const userId = req.query.id;
const query = `SELECT * FROM users WHERE id = ${userId}`;  // Potential SQL Injection Risk
connection.query(query);
```

CodeHound will flag this code because the userId is being concatenated directly into the SQL query, making it vulnerable to SQL Injection.

### Safe Code (Not Flagged)

```
const userId = req.query.id;
const query = 'SELECT * FROM users WHERE id = ?';  // Use parameterized queries
connection.query(query, [userId]);
```

Using parameterized queries ensures that the user input is handled securely, and CodeHound will not flag this as a vulnerability.


### Contributing
We welcome contributions! If you’d like to report an issue, suggest a new feature, or contribute code:

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Submit a pull request with a detailed description.

### License
This project is licensed under the MIT License. See the LICENSE file for details.

### Feedback & Support
If you encounter any issues or have questions, please feel free to open an issue on GitHub or reach out via the support section in the Visual Studio Code Marketplace.

Start securing your JavaScript code today with CodeHound! 
