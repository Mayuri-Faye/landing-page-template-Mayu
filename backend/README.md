# Backend - Contact Management

This backend folder handles contact submissions to Supabase.

## Setup

### 1. Install Supabase Package
```bash
npm install @supabase/supabase-js
```

### 2. Configure Environment Variables
Create a `.env.local` file in the root directory with your Supabase credentials:
```
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

You can get these from your Supabase project settings:
- Go to https://supabase.com
- Create a new project or open an existing one
- Navigate to Project Settings > API
- Copy your URL and anon key

### 3. Create Supabase Table
In your Supabase dashboard, create a new table called `contacts` with these columns:
- `id` (int, primary key, auto-increment)
- `email` (text)
- `phone` (text)
- `created_at` (timestamp, default: now())

Or run this SQL in the Supabase SQL editor:
```sql
CREATE TABLE contacts (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Usage

Import and use the `submitContact` function in your React components:

```javascript
import { submitContact } from '../backend/api/contacts.js';

const handleSubmit = async (formData) => {
  const result = await submitContact(formData);
  if (result.success) {
    console.log('Contact saved:', result.data);
  } else {
    console.error('Error:', result.error);
  }
};
```

## Folder Structure
```
backend/
├── config/
│   └── supabase.js       # Supabase client configuration
├── api/
│   ├── contacts.js       # Contact submission logic
│   └── index.js          # API exports
├── .env.example          # Example environment variables
└── README.md             # This file
```
