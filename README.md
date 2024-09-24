# UniConnect – Connecting Students

UniConnect is a user-friendly web application designed to enhance university communities by helping students and staff find events, connect with friends, and access information about various university activities. This platform integrates with Facebook to provide real-time answers to frequently asked questions (FAQs) and allows users to interact with university groups and events.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [System Architecture](#system-architecture)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [Usage](#usage)
- [External Interfaces](#external-interfaces)
- [Non-Functional Requirements](#non-functional-requirements)
- [Contributing](#contributing)
- [License](#license)

## Introduction

UniConnect helps university students and staff find events, connect with their peers, and stay informed about campus activities. It offers a comprehensive FAQ feature that allows users to ask questions and receive answers through Facebook group integration, providing real-time information about university events and groups.

## Features

1. **Login/Signup**:
   - Create an account or sign in with email and password.
   - Social media authentication (Google, Facebook).
   - CAPTCHA integration for bot protection.
   
2. **Event Details Page**:
   - Search and filter upcoming university events by date, type, location, and categories.
   - View detailed event information in a modal window and RSVP directly.
   - Interactive map with event locations.

3. **Community Details Page**:
   - Live feed of posts from university groups.
   - Users can like, comment, and engage with posts.
   - Create new posts with text and images.
   - Search and filter posts.

4. **FAQ Page**:
   - Chat system where users can ask questions about events and groups.
   - Integration with Facebook groups to post and retrieve answers from similar questions.

## System Architecture

UniConnect follows a modular architecture with distinct components:

- **Frontend**: Built with a responsive and dynamic UI for seamless user interaction on desktops, tablets, and mobile devices.
- **Backend**: Manages user sessions, event data, and Facebook API integrations for FAQs.
- **Database**: Stores user information, events, and posts.
- **Third-party Integrations**: Facebook API is used to post questions and retrieve answers from university-related groups.

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **APIs**: Facebook Graph API
- **Authentication**: OAuth2.0 (Google and Facebook)
- **Other Tools**: Trello for project management (Trello Board Link: [UniConnect Trello Board](https://trello.com/b/ByrnEXDm/uniconnect-sit725))

## Getting Started

### Prerequisites

Make sure you have the following installed on your local machine:

- Node.js (v14.x or higher)
- MongoDB (local or remote instance)
- Facebook Developer account for API integration
- Git

### Installation

1. Clone the repository to your local machine:
   ```bash
   git clone https://github.com/Nishiki-Asumi97/UniConnect.git
   cd UniConnect
