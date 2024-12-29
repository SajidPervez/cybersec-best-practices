# Cybersecurity Best Practices App

A modern, responsive React application that displays cybersecurity best practices with a sleek typewriter effect. The app showcases various cybersecurity practices across different domains, helping users learn and understand important security concepts.

## Features

- **Dynamic Practice Display**: Automatically cycles through cybersecurity best practices with a typewriter animation effect
- **Domain Selection**: Choose specific security domains or view practices from all domains
- **Customizable Timing**: Adjust the display duration (minimum 20 seconds) between practices
- **Detailed Explanations**: Get in-depth explanations and practical examples for each best practice (requires API key)
- **Responsive Design**: Works seamlessly across desktop, tablet, and mobile devices
- **Clean Interface**: Minimalist design focusing on content readability

## Security Domains

The application covers various cybersecurity domains including:
- Network Security
- Application Security
- Data Security
- Identity Management
- Access Control
- Security Awareness
- Incident Response
- And more...

## Technical Stack

- **Frontend Framework**: React.js with Vite
- **Styling**: CSS with modern styling practices
- **Animations**: Framer Motion for smooth transitions
- **Data Storage**: JSON-based practice repository
- **State Management**: React Hooks (useState, useEffect, useCallback)
- **API Integration**: Google Gemini API for detailed explanations

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/SajidPervez/cybersec-best-practices.git
   ```

2. Install dependencies:
   ```bash
   cd cybersec-best-practices
   npm install
   ```

3. Set up environment variables:
   - Create a `.env.local` file in the root directory
   - Add your Google Gemini API key:
     ```
     VITE_GEMINI_API_KEY=your_api_key_here
     PORT=3001
     ```
   Note: The "With Examples" feature requires a valid Google Gemini API key. Without it, only the basic practice display will be available.

4. Start the backend server:
   ```bash
   cd server
   npm install
   npm start
   ```

5. In a new terminal, start the frontend development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:5173](http://localhost:5173) in your browser

## Usage

- **General View**: The home page displays cybersecurity best practices with a typewriter effect
- **With Examples**: Click "With Examples" to get detailed explanations and practical examples (requires API key)
- **Domain Filter**: Use the domain selector to focus on specific security areas
- **Timer Control**: Adjust the display duration using the timer control (minimum 20 seconds)

## Customizing Security Practices

The application uses a JSON file (`src/data/security-practices.json`) to store all security practices and their domains. You can customize this file to match your organization's specific security policies and requirements:

1. The file structure follows this format:
```json
{
  "domains": {
    "domain_name": [
      "security practice 1",
      "security practice 2",
      ...
    ],
    ...
  }
}
```

2. You can use any AI tool (like ChatGPT) to help convert your organization's security policies into this JSON format.
3. Simply replace the contents of `security-practices.json` with your customized practices.
4. Each domain should contain an array of security practices relevant to that domain.
5. Keep the practices concise and actionable for best results.

This allows you to tailor the application to your specific needs while maintaining the interactive learning experience.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.
