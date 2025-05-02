import React, { useState } from 'react';
import {
    Box,
    Button,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Stack,
    Text,
    useToast,
    InputGroup,
    InputRightElement,
    IconButton,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const toast = useToast();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validación básica
        if (!username || !password) {
            toast({
                title: 'Error',
                description: 'Por favor ingresa tu usuario y contraseña.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        setIsLoading(true);

        try {
            // Aquí iría la lógica de autenticación real con una API
            // Por ahora, simulamos un login exitoso después de 1 segundo
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Credenciales demo (en producción esto estaría en el backend)
            if (username === 'admin' && password === 'admin123') {
                // Login exitoso
                localStorage.setItem('isAuthenticated', 'true');
                localStorage.setItem('user', JSON.stringify({ username, role: 'admin' }));

                toast({
                    title: 'Inicio de sesión exitoso',
                    description: '¡Bienvenido al panel de administración de Black Bull!',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });

                navigate('/dashboard');
            } else {
                // Credenciales inválidas
                toast({
                    title: 'Error de autenticación',
                    description: 'Usuario o contraseña incorrectos.',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Ocurrió un error al iniciar sesión. Intenta de nuevo más tarde.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            console.error('Error de login:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Flex
            minH="100vh"
            align="center"
            justify="center"
            bg="brand.900"
            position="relative"
        >
            {/* Fondo con overlay */}
            <Box
                position="absolute"
                top={0}
                left={0}
                w="100%"
                h="100%"
                bg="brand.900"
                opacity={0.8}
                zIndex={1}
            />

            {/* Contenedor del formulario de login */}
            <Flex
                direction="column"
                bg="brand.800"
                p={8}
                rounded="md"
                shadow="lg"
                w={{ base: "90%", md: "450px" }}
                position="relative"
                zIndex={2}
                borderTop="4px solid"
                borderColor="accent.500"
            >
                <Box textAlign="center" mb={8}>
                    {/* Aquí va el logo. Usa una imagen o texto según disponibilidad */}
                    <Heading fontSize="2xl" mb={2}>
                        BLACK BULL <Text as="span" color="accent.500">ADMIN</Text>
                    </Heading>
                    <Text color="gray.400" fontSize="sm">
                        Panel de Administración
                    </Text>
                </Box>

                <form onSubmit={handleSubmit}>
                    <Stack spacing={4}>
                        <FormControl id="username" isRequired>
                            <FormLabel>Usuario</FormLabel>
                            <Input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                bg="brand.700"
                                border="none"
                                _focus={{
                                    boxShadow: "0 0 0 1px #ff0000",
                                    borderColor: "accent.500"
                                }}
                            />
                        </FormControl>

                        <FormControl id="password" isRequired>
                            <FormLabel>Contraseña</FormLabel>
                            <InputGroup>
                                <Input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    bg="brand.700"
                                    border="none"
                                    _focus={{
                                        boxShadow: "0 0 0 1px #ff0000",
                                        borderColor: "accent.500"
                                    }}
                                />
                                <InputRightElement>
                                    <IconButton
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                        icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                                        onClick={() => setShowPassword(!showPassword)}
                                        variant="ghost"
                                        size="sm"
                                    />
                                </InputRightElement>
                            </InputGroup>
                        </FormControl>

                        <Button
                            type="submit"
                            bg="accent.500"
                            color="white"
                            _hover={{ bg: 'accent.600' }}
                            size="lg"
                            fontSize="md"
                            isLoading={isLoading}
                            loadingText="Iniciando sesión..."
                            w="100%"
                            mt={4}
                        >
                            Iniciar Sesión
                        </Button>

                        <Text fontSize="xs" color="gray.500" textAlign="center" mt={4}>
                            © {new Date().getFullYear()} BLACK BULL - Sistema Administrativo
                        </Text>
                    </Stack>
                </form>
            </Flex>
        </Flex>
    );
};

export default LoginPage;