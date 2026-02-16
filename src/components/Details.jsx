import React, { useState } from 'react'
import {  
    Box,
    Button,
    Stack,
    TextField,
    Alert
} from '@mui/material'
import Title from './Title'
import Paragraph from './Paragraph'
import { submitContact } from '../utils/api.js'

const Details = () => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [messageType, setMessageType] = useState('success');

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const data = new FormData(event.currentTarget);
            const contactData = {
                email: data.get('email'),
                phone: data.get('phone'),
            };

            const result = await submitContact(contactData);

            if (result.success) {
                setMessageType('success');
                setMessage('Submitted!');
                event.currentTarget.reset();
            } else {
                setMessageType('error');
                setMessage(`Error: ${result.error}`);
            }
        } catch (error) {
            setMessageType('error');
            setMessage('Submitted!');
            console.error('Submit error:', error);
        } finally {
            setLoading(false);
        }
    }


    return (
        <Stack 
        component='section'
        direction="column"
        justifyContent= 'center'
        alignItems='center'
        sx={{
            py: 10,
            px: 2,
        }}
        >
            <Title 
            text={
                'Interesting to buy property'
                } 
            textAlign={'center'}
            />
            <Paragraph 
            text={
                'If you are interested to buy the property contact us we will call you. \
                Shortly to fulfill you requirements and property.'
            }
            maxWidth = {'sm'}
            mx={0}
            textAlign={'center'}
            />

            <Box 
            component="form" 
            noValidate 
            onSubmit={handleSubmit} 
            sx={{ 
                mt: 1,
                py: 2
            }}>
                {message && (
                    <Alert 
                    severity={messageType}
                    sx={{ mb: 2 }}
                    onClose={() => setMessage(null)}
                    >
                        {message}
                    </Alert>
                )}
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    autoFocus
                    disabled={loading}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="phone"
                    label="Phone Number"
                    type="phone"
                    id="phone"
                    autoComplete="current-phone"
                    disabled={loading}
                />
                <Button 
                variant="contained" 
                fullWidth
                type="submit"
                size="medium"
                disabled={loading}
                sx= {{ 
                    fontSize: '0.9rem',
                    textTransform: 'capitalize', 
                    py: 2,
                    mt: 3, 
                    mb: 2,
                    borderRadius: 0,
                    backgroundColor: '#14192d',
                    "&:hover": {
                        backgroundColor: '#1e2a5a',
                    },
                    "&:disabled": {
                        backgroundColor: '#999',
                    }
                }}
                >
                    {loading ? 'Sending...' : 'send'}
                </Button>
            </Box>
        </Stack>
    )
}

export default Details;