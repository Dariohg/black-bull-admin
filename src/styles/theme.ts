import { extendTheme, type ThemeConfig } from '@chakra-ui/react'

const config: ThemeConfig = {
    initialColorMode: 'dark',
    useSystemColorMode: false,
}

const theme = extendTheme({
    config,
    colors: {
        brand: {
            900: '#111111', // Casi negro para fondos
            800: '#1a1a1a', // Negro menos intenso
            700: '#282828', // Para elementos secundarios
            100: '#f8f8f8', // Blanco ligeramente apagado
        },
        accent: {
            500: '#ff0000', // Rojo primario
            600: '#d60000', // Rojo más oscuro para hover
            700: '#b30000', // Rojo aún más oscuro
        },
        gray: {
            700: '#333333',
            800: '#1A1A1A',
            900: '#111111',
        }
    },
    fonts: {
        heading: 'Montserrat, system-ui, sans-serif',
        body: 'Inter, system-ui, sans-serif',
    },
    styles: {
        global: {
            body: {
                bg: 'brand.900',
                color: 'white',
            }
        }
    },
    components: {
        Button: {
            variants: {
                primary: {
                    bg: 'accent.500',
                    color: 'white',
                    _hover: {
                        bg: 'accent.600',
                    }
                },
                outline: {
                    borderColor: 'accent.500',
                    color: 'white',
                    _hover: {
                        bg: 'accent.500',
                    }
                }
            }
        }
    }
})

export default theme