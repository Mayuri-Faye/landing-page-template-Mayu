import { supabase } from '../config/supabase.js';

export const submitContact = async (contactData) => {
  try {
    const { email, phone } = contactData;

    if (!email || !phone) {
      throw new Error('Email and phone are required');
    }

    // Insert contact into Supabase
    const { data, error } = await supabase
      .from('contacts')
      .insert([
        {
          email,
          phone,
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) {
      throw error;
    }

    return {
      success: true,
      data: data[0],
      message: 'Contact submitted successfully',
    };
  } catch (error) {
    console.error('Error submitting contact:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};
