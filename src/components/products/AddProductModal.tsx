import React, { useState } from 'react';
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
    Input,
    Select,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    VStack,
    FormErrorMessage,
    Box,
    Text,
    Image,
    useToast
} from '@chakra-ui/react';
import { Product } from '../../pages/ProductsPage';
import { Location } from '../../pages/LocationsPage';

interface AddProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddProduct: (product: Omit<Product, 'id'>) => void;
    locations: Location[];
}

const AddProductModal: React.FC<AddProductModalProps> = ({
                                                             isOpen,
                                                             onClose,
                                                             onAddProduct,
                                                             locations
                                                         }) => {
    const toast = useToast();

    // Estados para los campos del formulario
    const [name, setName] = useState('');
    const [price, setPrice] = useState<number>(0);
    const [stock, setStock] = useState<number>(0);
    const [locationId, setLocationId] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Estados para validación
    const [errors, setErrors] = useState({
        name: '',
        price: '',
        stock: '',
        locationId: '',
        imageUrl: ''
    });

    const validateForm = () => {
        let isValid = true;
        const newErrors = {
            name: '',
            price: '',
            stock: '',
            locationId: '',
            imageUrl: ''
        };

        // Validar nombre
        if (!name.trim()) {
            newErrors.name = 'El nombre es requerido';
            isValid = false;
        }

        // Validar precio
        if (price <= 0) {
            newErrors.price = 'El precio debe ser mayor a 0';
            isValid = false;
        }

        // Validar stock
        if (stock < 0) {
            newErrors.stock = 'El stock no puede ser negativo';
            isValid = false;
        }

        // Validar sucursal
        if (!locationId) {
            newErrors.locationId = 'Debe seleccionar una sucursal';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = () => {
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            // En una aplicación real, aquí se enviaría una solicitud al backend
            // para subir la imagen y guardar el producto
            onAddProduct({
                name,
                price,
                stock,
                locationId,
                imageUrl: imageUrl || "https://via.placeholder.com/300x200/111111/FFFFFF?text=BLACK+BULL"
            });

            // Limpiar el formulario
            resetForm();
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Ocurrió un error al agregar el producto',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const resetForm = () => {
        setName('');
        setPrice(0);
        setStock(0);
        setLocationId('');
        setImageUrl('');
        setErrors({
            name: '',
            price: '',
            stock: '',
            locationId: '',
            imageUrl: ''
        });
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    // En una implementación real, aquí habría un componente para subir imágenes
    // Por ahora, simularemos con una URL
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setImageUrl(e.target.value);
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} size="lg">
            <ModalOverlay />
            <ModalContent bg="brand.800">
                <ModalHeader color="white">Agregar Nuevo Producto</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <VStack spacing={4}>
                        <FormControl isRequired isInvalid={!!errors.name}>
                            <FormLabel>Nombre del Producto</FormLabel>
                            <Input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Nombre del producto"
                                bg="brand.700"
                                border="none"
                                _focus={{
                                    boxShadow: "0 0 0 1px #ff0000",
                                    borderColor: "accent.500"
                                }}
                            />
                            <FormErrorMessage>{errors.name}</FormErrorMessage>
                        </FormControl>

                        <FormControl isRequired isInvalid={!!errors.price}>
                            <FormLabel>Precio (Q)</FormLabel>
                            <NumberInput
                                value={price}
                                onChange={(valueString) => setPrice(parseFloat(valueString))}
                                min={0}
                                precision={2}
                                step={10}
                                bg="brand.700"
                            >
                                <NumberInputField
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
                            <FormErrorMessage>{errors.price}</FormErrorMessage>
                        </FormControl>

                        <FormControl isRequired isInvalid={!!errors.stock}>
                            <FormLabel>Stock Inicial</FormLabel>
                            <NumberInput
                                value={stock}
                                onChange={(valueString) => setStock(parseInt(valueString))}
                                min={0}
                                precision={0}
                                step={1}
                                bg="brand.700"
                            >
                                <NumberInputField
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
                            <FormErrorMessage>{errors.stock}</FormErrorMessage>
                        </FormControl>

                        <FormControl isRequired isInvalid={!!errors.locationId}>
                            <FormLabel>Sucursal</FormLabel>
                            <Select
                                placeholder="Seleccionar sucursal"
                                value={locationId}
                                onChange={(e) => setLocationId(e.target.value)}
                                bg="brand.700"
                                border="none"
                                _focus={{
                                    boxShadow: "0 0 0 1px #ff0000",
                                    borderColor: "accent.500"
                                }}
                            >
                                {locations.map(location => (
                                    <option key={location.id} value={location.id}>
                                        {location.name}
                                    </option>
                                ))}
                            </Select>
                            <FormErrorMessage>{errors.locationId}</FormErrorMessage>
                        </FormControl>

                        <FormControl>
                            <FormLabel>URL de Imagen</FormLabel>
                            <Input
                                value={imageUrl}
                                onChange={handleImageChange}
                                placeholder="https://ejemplo.com/imagen.jpg"
                                bg="brand.700"
                                border="none"
                                _focus={{
                                    boxShadow: "0 0 0 1px #ff0000",
                                    borderColor: "accent.500"
                                }}
                            />
                            <Text fontSize="xs" color="gray.400" mt={1}>
                                Deja en blanco para usar una imagen predeterminada
                            </Text>
                        </FormControl>

                        {imageUrl && (
                            <Box mt={2} borderRadius="md" overflow="hidden" width="100%" height="200px">
                                <Image
                                    src={imageUrl}
                                    alt="Vista previa"
                                    width="100%"
                                    height="100%"
                                    objectFit="cover"
                                    fallbackSrc="https://via.placeholder.com/300x200/111111/FFFFFF?text=BLACK+BULL"
                                />
                            </Box>
                        )}
                    </VStack>
                </ModalBody>

                <ModalFooter>
                    <Button
                        variant="ghost"
                        mr={3}
                        onClick={handleClose}
                    >
                        Cancelar
                    </Button>
                    <Button
                        bg="accent.500"
                        color="white"
                        _hover={{ bg: 'accent.600' }}
                        onClick={handleSubmit}
                        isLoading={isLoading}
                    >
                        Guardar Producto
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default AddProductModal;