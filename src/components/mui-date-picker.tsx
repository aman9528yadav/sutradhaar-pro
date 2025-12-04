"use client";

import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import { createTheme, ThemeProvider } from '@mui/material/styles';

interface MuiDatePickerProps {
    label?: string;
    value?: Date | undefined;
    onChange?: (date: Date | undefined) => void;
    className?: string;
}

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#ffffff', // Adjust as needed
        },
        background: {
            paper: '#1e1e1e', // Adjust to match your app's dark mode
        },
        text: {
            primary: '#ffffff',
            secondary: '#a1a1aa',
        },
    },
    components: {
        MuiTextField: {
            styleOverrides: {
                root: {
                    width: '100%',
                    '& .MuiOutlinedInput-root': {
                        borderRadius: '0.75rem', // rounded-xl
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        '& fieldset': {
                            borderColor: 'rgba(255, 255, 255, 0.1)',
                        },
                        '&:hover fieldset': {
                            borderColor: 'rgba(255, 255, 255, 0.2)',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#ffffff',
                        },
                    },
                    '& .MuiInputLabel-root': {
                        color: '#a1a1aa',
                        '&.Mui-focused': {
                            color: '#ffffff',
                        },
                    },
                    '& .MuiInputBase-input': {
                        color: '#ffffff',
                    },
                    '& .MuiSvgIcon-root': {
                        color: '#a1a1aa',
                    },
                },
            },
        },
        MuiPickersPopper: {
            styleOverrides: {
                paper: {
                    borderRadius: '1rem',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    backgroundColor: '#09090b', // zinc-950
                    color: '#ffffff',
                },
            },
        },
        MuiDayCalendar: {
            styleOverrides: {
                weekDayLabel: {
                    color: '#a1a1aa',
                },
            },
        },
        MuiPickersDay: {
            styleOverrides: {
                root: {
                    color: '#ffffff',
                    '&.Mui-selected': {
                        backgroundColor: '#ffffff',
                        color: '#000000',
                        '&:hover': {
                            backgroundColor: '#e4e4e7',
                        },
                    },
                    '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    },
                    '&.Mui-disabled': {
                        color: '#52525b',
                    },
                },
            },
        },
    },
});

export function MuiDatePicker({ label, value, onChange, className }: MuiDatePickerProps) {
    return (
        <ThemeProvider theme={darkTheme}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                    label={label}
                    value={value ? dayjs(value) : null}
                    onChange={(newValue: Dayjs | null) => {
                        onChange && onChange(newValue ? newValue.toDate() : undefined);
                    }}
                    slotProps={{
                        textField: {
                            className: className,
                            size: "small",
                        }
                    }}
                />
            </LocalizationProvider>
        </ThemeProvider>
    );
}
