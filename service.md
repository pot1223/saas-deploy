# CloudNote Service Overview

CloudNote is a premium SaaS application designed to help users capture, organize, and sync their thoughts across all devices. It emphasizes productivity, security, and seamless collaboration.

## Core Values & Slogan
- **Slogan**: "Your Thoughts, Organized Everywhere"
- **Mission**: Building tools to help the world think better, one note at a time.
- **Key Features**: Real-time Sync, Military-grade Security (E2E Encryption), and Team Collaboration.

## Implementation Details (Based on Mockups)

### 1. Landing Page (`landing.html`)
- **Hero Section**: Highlights cross-device syncing and immediate capture.
- **Features**: 
    - **Real-time Sync**: Automatic updates across Mac, Android, and other platforms.
    - **Security**: End-to-end military-grade encryption.
    - **Collaboration**: Sharing notebooks, comments, and tracking changes.
- **Pricing Tiers**: 
    - **Personal**: $0/mo (50 notes, 2 devices).
    - **Professional**: $12/mo (Unlimited notes/devices, offline mode).
    - **Team**: $29/mo (Shared workspaces, admin console).
- **Testimonials**: Features professional users from various fields (Creative Director, Journalist, Legal Partner).

### 2. Authentication (`auth.html`)
- Supports traditional Email/Password login.
- Includes social login options for **Google** and **Apple**.
- Provides links for account recovery and trial sign-ups.

### 3. Dashboard (`dashboard.html`)
- **Navigation**: Sidebar with categories like All Notes, Favorites, Folders, Archive, and Trash.
- **Organization**: Notes can be tagged with categories such as Project, Ideas, Meeting, Personal, and Design.
- **Storage Management**: Visual indicator for cloud storage usage (e.g., "6.5 GB of 10 GB used").
- **Search**: Robust search bar for finding notes, tags, or content.
- **Note List**: Grid view with note previews, tags, star status, and modification dates.

### 4. Note Editor (`note.html`)
- **Rich Text Tools**: Bold, Italic, Bullet Lists, Numbered Lists, Image insertion, and Links.
- **Sync Status**: Real-time "Synced" indicator.
- **Organization**: Sidebar for folder navigation while editing.
- **Metadata**: Tracks word count, character count, read time, and last edited timestamp.

### 5. Payment & Checkout (`payment.html`, `payment-done.html`)
- **Plan Selection**: Detailed comparison table for selecting the right tier.
- **Secure Checkout**: Credit card information entry with SSL secure and PCI compliance badges.
- **Refund Policy**: 30-day money-back guarantee.

## Target Audience
- Creative professionals, journalists, legal partners, and teams looking for a secure and organized way to manage digital notes and archives.

## Technical Foundation (Identified from Design)
- **Styling**: Tailwind CSS
- **Typography**: Inter (Google Fonts)
- **Iconography**: Material Symbols Outlined
- **Design Mode**: Support for both Light and Dark modes.
