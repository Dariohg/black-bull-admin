import React, { useState, useEffect } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    FormControl,
    FormLabel,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    VStack,
    Text,
    Box,
    HStack,
    Badge,
    useToast
} from '@chakra-ui/react';
import { Product } from '../../pages/ProductsPage';

interface RestockModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirmRestock: (id: string, newStock: number) => void;
    product: Product | null;
}

const RestockModal: React.FC<RestockModalProps> = ({
                                                       isOpen,
                                                       onClose,
                                                       onConfirmRestock,
                                                       product
                                                   }) => {
    const toast = useToast();
    const [stockToAdd, setStockToAdd] = useState<number>(1);
    const [currentStock, setCurrentStock] = useState<number>(0);
    const [newTotalStock, setNewTotalStock] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(false);

    // Actualizar los estados cuando el producto cambia
    useEffect(() => {
        if (product) {
            setCurrentStock(product.stock);
            setStockToAdd(1);
            setNewTotalStock(product.stock + 1);
        }
    }, [product]);

    // Actualizar el nuevo total cada vez que cambia la cantidad a agregar
    useEffect(() => {
        setNewTotalStock(currentStock + stockToAdd);
    }, [currentStock, stockToAdd]);

    const handleConfirm = () => {
        if (!product) return;

        setIsLoading(true);

        try {
            // En una aplicación real, aquí se enviaría una solicitud al backend
            // para actualizar el inventario
            onConfirmRestock(product.id, newTotalStock);

            // Mostrar notificación de éxito
            toast({
                title: 'Inventario actualizado',
                description: `Se actualizó el stock de ${product.name} a ${newTotalStock} unidades.`,
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Ocurrió un error al actualizar el inventario',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Manejar la actualización de la cantidad
    const handleStockChange = (valueString: string) => {
        const value = parseInt(valueString);
        setStockToAdd(value);
    };

    // Si no hay producto, no renderizar nada
    if (!product) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="md">
            <ModalOverlay />
            <ModalContent bg="brand.800">
                <ModalHeader color="white">Actualizar Inventario</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <VStack spacing={5} align="stretch">
                        <Box>
                            <Text fontWeight="bold" fontSize="lg">{product.name}</Text>
                            <Text fontSize="sm" color="gray.400">ID: {product.id}</Text>
                        </Box>

                        <Box p={4} bg="brand.700" borderRadius="md">
                            <HStack justifyContent="space-between" mb={3}>
                                <Text>Stock Actual:</Text>
                                <Text fontWeight="bold">
                                    {currentStock}
                                    {currentStock <= 0 && (
                                        <Badge ml={2} colorScheme="red">Agotado</Badge>
                                    )}
                                    {currentStock > 0 && currentStock <= 5 && (
                                        <Badge ml={2} colorScheme="yellow">Bajo</Badge>
                                    )}
                                </Text>
                            </HStack>

                            <FormControl>
                                <FormLabel>Agregar al Stock:</FormLabel>
                                <NumberInput
                                    value={stockToAdd}
                                    onChange={handleStockChange}
                                    min={1}
                                    precision={0}
                                    step={1}
                                >
                                    <NumberInputField
                                        bg="brand.600"
                                        border="none"
                                        _focus={{
                                            boxShadow: "0 0 0 1px #ff0000",
                                            borderColor: "accent.500"
                                        }}
                                    />
                                    <NumberInputStepper>
                                        <NumberIncrementStepper />
                                        <NumberDecrementStepper />
                                    </NumberInputStepper>
                                </NumberInput>
                            </FormControl>

                            <HStack justifyContent="space-between" mt={3}>
                                <Text>Nuevo Total:</Text>
                                <Text fontWeight="bold" color="accent.500">{newTotalStock}</Text>
                            </HStack>
                        </Box>

                        <Text fontSize="sm" color="gray.400">
                            Agrega la cantidad de unidades que ingresaron al inventario.
                            El sistema calculará automáticamente el nuevo total.
                        </Text>
                    </VStack>
                </ModalBody>

                <ModalFooter>
                    <Button
                        variant="ghost"
                        mr={3}
                        onClick={onClose}
                    >
                        Cancelar
                    </Button>
                    <Button
                        bg="accent.500"
                        color="white"
                        _hover={{ bg: 'accent.600' }}
                        onClick={handleConfirm}
                        isLoading={isLoading}
                    >
                        Confirmar Actualización
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default RestockModal;