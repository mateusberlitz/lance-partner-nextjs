import { extendTheme } from '@chakra-ui/react';

export const theme = extendTheme({
    initialColorMode: "light", // Set initial color mode to light
    useSystemColorMode: false,
    colors: {
        gray: {
            "900": "#14142B",
            "800": "#4E4B66",
            "700": "#6E7191",
            "600": "#A0A3BD", 
            "500": "#D9DBE9",
            "400": "#EFF0F6",
            "100": "#F7F7FC",
            "50" : "#FCFCFC",  
        },
        purple: {
            "400": "#2A00A2",
            "300": "#5F2EEA",
            "200": "#BCA4FF",
            "100": "#E4DAFF",
        },
        black: "#111112",
        blue: {
            "500": "#0096B7",
            "400": "#2097ED",
            "300": "#1CC8EE",
            "200": "#82E9FF",
            "100": "#DEF9FF",
        },
        red: {
            "500": "#DB2C2C",
            "400": "#EA5455",
            "300": "#F06B77",
            "200": "#FF84B7",
            "100": "#FFDFED",
        },
        orange: {
            "600": "#EC7B1C",
            "500": "#FF8E2E",
            "400": "#F99846",
            "300": "#FF9F43"
        },

        green: {
            "500": "#28C76F"
        },

    },
    shadows: {
        outline: `0 0 0 3px rgb(229, 62, 62 , 0.6)`,
    },
    fonts: {
        heading: 'Raleway',
        body: 'Poppins'
    },
    styles: {
        global: {
            body: {
                bg: 'gray.100',
                color: 'gray.900'
            }
        }
    },
    // components:{
    //     Modal:{
            
    //     }
    // }
})