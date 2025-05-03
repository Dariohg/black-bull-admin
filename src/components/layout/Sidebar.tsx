import React from 'react';
import {
    Box,
    Flex,
    Text,
    CloseButton,
    BoxProps,
    Icon,
    Link,
    Heading,
    FlexProps
} from '@chakra-ui/react';
import {
    FiHome,
    FiUsers,
    FiShoppingBag,
    FiCalendar,
    FiSettings,
    FiClock,
    FiMapPin,
    FiScissors
} from 'react-icons/fi';
import { IconType } from 'react-icons';
import { Link as RouterLink, useLocation } from 'react-router-dom';

interface NavItemProps extends FlexProps {
    icon: IconType;
    children: React.ReactNode;
    to: string;
}

interface SidebarProps extends BoxProps {
    onClose: () => void;
}

const NavItem = ({ icon, children, to, ...rest }: NavItemProps) => {
    const location = useLocation();
    const isActive = location.pathname === to;

    return (
        <Link
            as={RouterLink}
            to={to}
            style={{ textDecoration: 'none' }}
            _focus={{ boxShadow: 'none' }}
        >
            <Flex
                align="center"
                p="4"
                mx="4"
                borderRadius="lg"
                role="group"
                cursor="pointer"
                bg={isActive ? 'accent.500' : 'transparent'}
                color={isActive ? 'white' : 'inherit'}
                _hover={{
                    bg: isActive ? 'accent.600' : 'accent.500',
                    color: 'white',
                }}
                {...rest}
            >
                {icon && (
                    <Icon
                        mr="4"
                        fontSize="16"
                        as={icon}
                    />
                )}
                {children}
            </Flex>
        </Link>
    );
};

const Sidebar = ({ onClose, ...rest }: SidebarProps) => {
    return (
        <Box
            bg="brand.800"
            borderRight="1px"
            borderRightColor="brand.700"
            w={{ base: 'full', md: 60 }}
            pos="fixed"
            h="full"
            {...rest}
        >
            <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
                <Box>
                    <Heading fontSize="xl">
                        BLACK BULL <Text as="span" color="accent.500">ADMIN</Text>
                    </Heading>
                </Box>
                <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
            </Flex>
            <Flex
                direction="column"
                flex="1"
                overflow="auto"
                h="calc(100vh - 80px)"
            >
                <NavItem icon={FiHome} to="/dashboard">
                    Dashboard
                </NavItem>
                <NavItem icon={FiUsers} to="/employees">
                    Empleados
                </NavItem>
                <NavItem icon={FiCalendar} to="/appointments">
                    Citas
                </NavItem>
                <NavItem icon={FiShoppingBag} to="/products">
                    Productos
                </NavItem>
                <NavItem icon={FiScissors} to="/haircuts">
                    Cortes
                </NavItem>
                <NavItem icon={FiMapPin} to="/locations">
                    Sucursales
                </NavItem>
                <NavItem icon={FiClock} to="/services">
                    Servicios
                </NavItem>
                <NavItem icon={FiSettings} to="/settings">
                    Configuración
                </NavItem>

                <Box mt="auto" mb="4">
                    <Text
                        color="gray.500"
                        fontSize="xs"
                        fontWeight="semibold"
                        px="8"
                        py="2"
                    >
                        v1.0.0
                    </Text>
                </Box>
            </Flex>
        </Box>
    );
};

export default Sidebar;