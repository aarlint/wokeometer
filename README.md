# WokeoMeter React Application

A React-based Single Page Application for measuring the "wokeness" of TV shows, movies, and other media content.

## Features

- Multi-page form interface for answering questions about media content
- Score calculation based on answers
- Classification into categories: Limited Wokeness, Woke, Very Woke, and Egregiously Woke
- Ability to save assessments in browser localStorage
- View and browse saved assessments

## Technical Details

- Built with React 18 and React Router v6
- Uses Tailwind CSS for styling
- All data is stored locally in the browser
- Implements the scoring algorithm from the original Excel file

## Getting Started

1. Install dependencies:
```
npm install
```

2. Start the development server:
```
npm start
```

3. Build for production:
```
npm run build
```

## Project Structure

- `src/components/` - Reusable UI components
- `src/pages/` - Main page components for the application
- `src/data.js` - Data model and utility functions

## How It Works

This application is a React port of the original Excel-based WokeoMeter, maintaining all the functionality:

1. Users enter the name of the show/movie they want to assess
2. They proceed through a wizard interface to answer questions about the content
3. Based on the answers, a score is calculated
4. The score is used to categorize the content on a scale from "Limited Wokeness" to "Egregiously Woke"
5. Results can be saved for future reference
