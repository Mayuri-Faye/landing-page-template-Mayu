# PHP Backend with Local MySQL + Supabase

## Setup Local MySQL Database (phpMyAdmin)

### 1. Open phpMyAdmin
- Start XAMPP
- Go to: `http://localhost/phpmyadmin`

### 2. Create Database
**Option A: Using SQL (Recommended)**
- Click "SQL" tab
- Copy all content from `database.sql` file
- Paste and execute

**Option B: Manually**
- Click "New"
- Database name: `landing_page`
- Click "Create"

### 3. Create Contacts Table
In phpMyAdmin SQL editor, run:
```sql
CREATE TABLE IF NOT EXISTS contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_created (created_at)
);
```

## Copy to XAMPP

```powershell
Copy-Item "C:\Users\natas\OneDrive\Desktop\landing-page-template-reactjs\backend\php\*" "C:\xampp\htdocs\landing-page-api\" -Recurse -Force
```

Directory should look like:
```
C:\xampp\htdocs\landing-page-api\
├── config.php
├── submit-contact.php
├── get-contacts.php
├── .htaccess
└── database.sql
```

## How It Works

```
React Form
    ↓
PHP (submit-contact.php)
    ↓
├─→ Local MySQL Database (visible in phpMyAdmin)
└─→ Supabase (optional backup)
```

## Testing

### 1. Submit Contact via React
- Fill form in React app
- Click "Send"
- Should see success message

### 2. View in phpMyAdmin
- Open: `http://localhost/phpmyadmin`
- Database: `landing_page`
- Table: `contacts`
- Data should appear automatically!

### 3. View via API
- `http://localhost/landing-page-api/get-contacts.php`
- Shows all contacts in JSON format

### 4. Test in Postman

**Submit Contact:**
```
URL: http://localhost/landing-page-api/submit-contact.php
Method: POST
Headers: Content-Type: application/json
Body: {
    "email": "test@example.com",
    "phone": "+92300123456"
}
```

**Get All Contacts:**
```
URL: http://localhost/landing-page-api/get-contacts.php
Method: GET
```

## Update React Component

In `src/components/Details.jsx`, replace the import:

```javascript
// OLD (Direct Supabase)
import { submitContact } from '../../backend/api/contacts.js'

// NEW (Via PHP/Local MySQL)
const submitContact = async (contactData) => {
    try {
        const response = await fetch('http://localhost/landing-page-api/submit-contact.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(contactData),
        });
        
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.error || 'Failed to submit contact');
        }
        
        return {
            success: true,
            data: result,
            message: 'Contact submitted successfully'
        };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
};
```

## Troubleshooting

**"Could not connect to local database"**
- Check MySQL is running in XAMPP
- Verify database `landing_page` exists
- Check table `contacts` exists

**Data not showing in phpMyAdmin**
- Refresh the page
- Go to `landing_page` → `contacts` table
- Click "Browse" tab

**CORS errors**
- Make sure `.htaccess` is in the folder
- Apache `mod_rewrite` must be enabled

**Port already in use**
- Change XAMPP Apache port in settings if needed

## Files

- `config.php` - Database and Supabase configuration
- `submit-contact.php` - Handle form submissions (stores in local MySQL + Supabase)
- `get-contacts.php` - Retrieve all contacts
- `.htaccess` - CORS headers
- `database.sql` - SQL script to create database and table
