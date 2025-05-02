import React, { ReactNode } from 'react';
import {
    Box,
    Flex,
    Text,
    Drawer,
    DrawerContent,
    useDisclosure,
    IconButton,
    Avatar,
    HStack,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuDivider,
    useToast,
    Icon
} from '@chakra-ui/react';
import {
    FiMenu,
    FiLogOut,
    FiChevronDown
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';

interface LayoutProps {
    children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const navigate = useNavigate();
    const toast = useToast();

    const handleLogout = () => {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('user');

        toast({
            title: 'Sesión cerrada',
            description: 'Has cerrado sesión exitosamente.',
            status: 'success',
            duration: 3000,
            isClosable: true,
        });

        navigate('/login');
    };

    // Recuperar información del usuario del localStorage
    const userInfo = localStorage.getItem('user')
        ? JSON.parse(localStorage.getItem('user') || '{}')
        : { username: 'Usuario' };

    return (
        <Box minH="100vh" bg="brand.900">
            <Sidebar
                onClose={() => onClose}
                display={{ base: 'none', md: 'block' }}
            />
            <Drawer
                autoFocus={false}
                isOpen={isOpen}
                placement="left"
                onClose={onClose}
                returnFocusOnClose={false}
                onOverlayClick={onClose}
                size="full"
            >
                <DrawerContent>
                    <Sidebar onClose={onClose} />
                </DrawerContent>
            </Drawer>

            {/* Header */}
            <Flex
                ml={{ base: 0, md: 60 }}
                px="4"
                height="20"
                alignItems="center"
                bg="brand.800"
                borderBottomWidth="1px"
                borderBottomColor="brand.700"
                justifyContent={{ base: 'space-between', md: 'flex-end' }}
            >
                <IconButton
                    display={{ base: 'flex', md: 'none' }}
                    onClick={onOpen}
                    variant="outline"
                    aria-label="open menu"
                    icon={<FiMenu />}
                />

                <HStack spacing={{ base: '0', md: '6' }}>
                    <Flex alignItems={'center'}>
                        <Menu>
                            <MenuButton
                                py={2}
                                transition="all 0.3s"
                                _focus={{ boxShadow: 'none' }}
                            >
                                <HStack>
                                    <Avatar
                                        size={'sm'}
                                        name={userInfo.username}
                                        bg="accent.500"
                                        color="white"
                                    />
                                    <Text fontSize="sm">{userInfo.username}</Text>
                                    <Box display={{ base: 'none', md: 'flex' }}>
                                        <FiChevronDown />
                                    </Box>
                                </HStack>
                            </MenuButton>
                            <MenuList
                                bg="brand.800"
                                borderColor="brand.700"
                            >
                                <MenuItem bg="brand.800" _hover={{ bg: 'brand.700' }}>Perfil</MenuItem>
                                <MenuItem bg="brand.800" _hover={{ bg: 'brand.700' }}>Configuración</MenuItem>
                                <MenuDivider />
                                <MenuItem
                                    bg="brand.800"
                                    _hover={{ bg: 'brand.700' }}
                                    onClick={handleLogout}
                                >
                                    <Icon as={FiLogOut} mr={2} /> Cerrar Sesión
                                </MenuItem>
                            </MenuList>
                        </Menu>
                    </Flex>
                </HStack>
            </Flex>

            {/* Contenido principal */}
            <Box
                ml={{ base: 0, md: 60 }}
                p="4"
                minH="calc(100vh - 5rem)"
            >
                {children}
            </Box>
        </Box>
    );
};

export default Layout;