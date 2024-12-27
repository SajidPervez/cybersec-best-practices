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

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.
