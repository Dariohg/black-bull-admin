import React from 'react';
import {
    Box,
    Image,
    Text,
    Badge,
    IconButton,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Heading,
    VStack,
    HStack,
    useDisclosure,
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    Button
} from '@chakra-ui/react';
import { FiMoreVertical, FiEdit, FiPackage, FiTrash2 } from 'react-icons/fi';
import { Product } from '../../pages/ProductsPage';

interface ProductCardProps {
    product: Product;
    locationName: string;
    onEdit: () => void;
    onRestock: () => void;
    onDelete: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
                                                     product,
                                                     locationName,
                                                     onEdit,
                                                     onRestock,
                                                     onDelete
                                                 }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = React.useRef<HTMLButtonElement>(null);

    return (
        <Box
            bg="brand.800"
            borderRadius="lg"
            overflow="hidden"
            transition="transform 0.3s"
            _hover={{ transform: 'translateY(-5px)', boxShadow: 'lg' }}
            position="relative"
        >
            {/* Menú de acciones */}
            <Menu>
                <MenuButton
                    as={IconButton}
                    icon={<FiMoreVertical />}
                    variant="ghost"
                    position="absolute"
                    top={2}
                    right={2}
                    zIndex={2}
                    bg="blackAlpha.600"
                    color="white"
                    _hover={{ bg: 'blackAlpha.700' }}
                />
                <MenuList bg="brand.700">
                    <MenuItem
                        icon={<FiEdit />}
                        onClick={onEdit}
                        bg="brand.700"
                        _hover={{ bg: 'brand.600' }}
                    >
                        Editar
                    </MenuItem>
                    <MenuItem
                        icon={<FiPackage />}
                        onClick={onRestock}
                        bg="brand.700"
                        _hover={{ bg: 'brand.600' }}
                    >
                        Actualizar stock
                    </MenuItem>
                    <MenuItem
                        icon={<FiTrash2 />}
                        onClick={onOpen}
                        bg="brand.700"
                        _hover={{ bg: 'brand.600' }}
                    >
                        Eliminar
                    </MenuItem>
                </MenuList>
            </Menu>

            {/* Imagen del producto */}
            <Box position="relative" height="200px">
                <Image
                    src={product.imageUrl || "https://via.placeholder.com/300x200/111111/FFFFFF?text=BLACK+BULL"}
                    alt={product.name}
                    width="100%"
                    height="100%"
                    objectFit="cover"
                />
                {product.stock <= 0 && (
                    <Badge
                        position="absolute"
                        top={3}
                        left={3}
                        colorScheme="red"
                        variant="solid"
                    >
                        Agotado
                    </Badge>
                )}
                {product.stock > 0 && product.stock <= 5 && (
                    <Badge
                        position="absolute"
                        top={3}
                        left={3}
                        colorScheme="yellow"
                        variant="solid"
                    >
                        Bajo stock
                    </Badge>
                )}
            </Box>

            {/* Detalles del producto */}
            <VStack p={4} align="stretch" spacing={1}>
                <Heading size="sm" noOfLines={2} height="40px">
                    {product.name}
                </Heading>

                <HStack justifyContent="space-between" mt={2}>
                    <Text color="accent.500" fontWeight="bold" fontSize="lg">
                        ${product.price.toFixed(2)}
                    </Text>
                    <Text fontSize="sm" color="gray.400">
                        Stock: {product.stock}
                    </Text>
                </HStack>

                <Text fontSize="xs" color="gray.500" mt={1}>
                    {locationName}
                </Text>
            </VStack>

            {/* Alerta de confirmación para eliminar */}
            <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={onClose}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent bg="brand.800">
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Eliminar Producto
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            ¿Estás seguro de eliminar "{product.name}"? Esta acción no se puede deshacer.
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onClose}>
                                Cancelar
                            </Button>
                            <Button
                                bg="accent.500"
                                color="white"
                                _hover={{ bg: 'accent.600' }}
                                onClick={() => {
                                    onDelete();
                                    onClose();
                                }}
                                ml={3}
                            >
                                Eliminar
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </Box>
    );
};

export default ProductCard;