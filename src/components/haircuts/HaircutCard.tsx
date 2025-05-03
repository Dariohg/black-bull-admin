import React from 'react';
import {
    Box,
    Image,
    Text,
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
import { FiMoreVertical, FiEdit, FiTrash2 } from 'react-icons/fi';
import { Haircut } from '../../pages/HaircutsPage';

interface HaircutCardProps {
    haircut: Haircut;
    onEdit: () => void;
    onDelete: () => void;
}

const HaircutCard: React.FC<HaircutCardProps> = ({
                                                     haircut,
                                                     onEdit,
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
                        icon={<FiTrash2 />}
                        onClick={onOpen}
                        bg="brand.700"
                        _hover={{ bg: 'brand.600' }}
                    >
                        Eliminar
                    </MenuItem>
                </MenuList>
            </Menu>

            {/* Imagen del corte */}
            <Box position="relative" height="200px">
                <Image
                    src={haircut.imageUrl || "https://via.placeholder.com/300x200/111111/FFFFFF?text=BLACK+BULL"}
                    alt={haircut.name}
                    width="100%"
                    height="100%"
                    objectFit="cover"
                />
            </Box>

            {/* Detalles del corte */}
            <VStack p={4} align="stretch" spacing={1}>
                <Heading size="sm" noOfLines={2} height="40px">
                    {haircut.name}
                </Heading>

                <HStack justifyContent="space-between" mt={2}>
                    <Text color="accent.500" fontWeight="bold" fontSize="lg">
                        $ {haircut.price.toFixed(2)}
                    </Text>
                </HStack>
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
                            Eliminar Corte
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            ¿Estás seguro de eliminar "{haircut.name}"? Esta acción no se puede deshacer.
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

export default HaircutCard;