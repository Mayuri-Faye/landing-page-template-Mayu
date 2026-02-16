const API_URL = 'http://localhost:5002/api';

export const submitContact = async (contactData) => {
  try {
    const { email, phone } = contactData;

    if (!email || !phone) {
      throw new Error('Email and phone are required');
    }

    // Use backend API instead of Supabase
    const response = await fetch(`${API_URL}/contacts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, phone }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to submit contact');
    }

    return {
      success: true,
      data: result.data,
      message: result.message,
    };
  } catch (error) {
    console.error('Error submitting contact:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};
