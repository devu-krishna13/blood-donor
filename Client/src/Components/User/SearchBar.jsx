import React from 'react';
import { TextField, InputAdornment, Box, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

function SearchBar({ onSearch }) {
    const [localSearchTerm, setLocalSearchTerm] = React.useState('');

    const handleSearch = (e) => {
        const value = e.target.value;
        setLocalSearchTerm(value);
        onSearch(value); // This should filter based on blood type
    };

    return (
        <Box sx={{ width: '350px' }}>
            <TextField
                fullWidth
                variant="outlined"
                placeholder="Search by Blood Type (e.g., A+, O-)"
                value={localSearchTerm}
                onChange={handleSearch}
                sx={{
                    backgroundColor: '#f5f5f5',
                    '& .MuiOutlinedInput-root': {
                        borderRadius: '50px',
                        height: '50px'
                    },
                }}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton>
                                <SearchIcon color="action" />
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
            />
        </Box>
    );
}

export default SearchBar;
