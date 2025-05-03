import React, { useState, useEffect, useRef } from 'react';
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
    useToast,
    Flex,
    Icon
} from '@chakra-ui/react';
import { FiUpload, FiImage } from 'react-icons/fi';
import { Product } from '../../pages/ProductsPage';
import { Location } from '../../pages/LocationsPage';

interface EditProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpdateProduct: (id: string, product: Partial<Product>) => void;
    product: Product | null;
    locations: Location[];
}

const EditProductModal: React.FC<EditProductModalProps> = ({
                                                               isOpen,
                                                               onClose,
                                                               onUpdateProduct,
                                                               product,
                                                               locations
                                                           }) => {
    const toast = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Estados para los campos del formulario
    const [name, setName] = useState('');
    const [price, setPrice] = useState<number>(0);
    const [stock, setStock] = useState<number>(0);
    const [locationId, setLocationId] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);

    // Estados para validación
    const [errors, setErrors] = useState({
        name: '',
        price: '',
        stock: '',
        locationId: '',
        image: ''
    });

    // Cargar datos del producto cuando se abre el modal
    useEffect(() => {
        if (product) {
            setName(product.name);
            setPrice(product.price);
            setStock(product.stock);
            setLocationId(product.locationId);
            setImageUrl(product.imageUrl || '');
            setImagePreview(product.imageUrl || '');
        }
    }, [product]);

    const validateForm = () => {
        let isValid = true;
        const newErrors = {
            name: '',
            price: '',
            stock: '',
            locationId: '',
            image: ''
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
        if (!validateForm() || !product) {
            return;
        }

        setIsLoading(true);

        try {
            // En una aplicación real, aquí se enviaría una solicitud al backend
            // para actualizar el producto y cargar la imagen

            // Simular procesamiento de imagen
            const processedImageUrl = imageFile
                ? URL.createObjectURL(imageFile) // En un entorno real, esto sería la URL devuelta por el servidor
                : imageUrl || "https://via.placeholder.com/300x200/111111/FFFFFF?text=BLACK+BULL";

            const updatedProduct: Partial<Product> = {
                name,
                price,
                stock,
                locationId,
                imageUrl: processedImageUrl
            };

            onUpdateProduct(product.id, updatedProduct);

            // Mostrar notificación de éxito
            toast({
                title: 'Producto actualizado',
                description: `${name} ha sido actualizado exitosamente.`,
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Ocurrió un error al actualizar el producto',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        // Restablecer errores y estado al cerrar
        setErrors({
            name: '',
            price: '',
            stock: '',
            locationId: '',
            image: ''
        });
        setImageFile(null);
        onClose();
    };

    // Manejar la selección de archivos
    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            const file = files[0];

            // Validar tipo de archivo (solo imágenes)
            if (!file.type.startsWith('image/')) {
                toast({
                    title: 'Error',
                    description: 'Por favor selecciona un archivo de imagen válido',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
                return;
            }

            // Validar tamaño del archivo (máximo 5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast({
                    title: 'Error',
                    description: 'La imagen es demasiado grande. El tamaño máximo es 5MB',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
                return;
            }

            setImageFile(file);

            // Crear una URL para la vista previa
            const reader = new FileReader();
            reader.onload = (e) => {
                if (e.target && typeof e.target.result === 'string') {
                    setImagePreview(e.target.result);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleClickUpload = () => {
        // Activar el input de archivo oculto
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    // Si no hay producto, no renderizar nada
    if (!product) return null;

    return (
        <Modal isOpen={isOpen} onClose={handleClose} size="lg">
            <ModalOverlay />
            <ModalContent bg="brand.800">
                <ModalHeader color="white">Editar Producto</ModalHeader>
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
                            <FormLabel>Precio</FormLabel>
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
                            <FormLabel>Stock Actual</FormLabel>
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

                        <FormControl isInvalid={!!errors.image}>
                            <FormLabel>Imagen del Producto</FormLabel>

                            {/* Input de archivo oculto */}
                            <input
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                                style={{ display: 'none' }}
                                onChange={handleImageChange}
                            />

                            {/* Botón personalizado para seleccionar archivo */}
                            <Button
                                leftIcon={<FiUpload />}
                                onClick={handleClickUpload}
                                width="100%"
                                variant="outline"
                                colorScheme="red"
                                bg="brand.700"
                                border="1px dashed"
                                borderColor="gray.500"
                                py={6}
                                _hover={{
                                    bg: 'brand.600',
                                    borderColor: 'accent.500'
                                }}
                            >
                                {imageFile ? 'Cambiar imagen' : 'Seleccionar imagen'}
                            </Button>

                            {imageFile && (
                                <Text mt={2} fontSize="sm">
                                    Archivo seleccionado: {imageFile.name}
                                </Text>
                            )}
                            <FormErrorMessage>{errors.image}</FormErrorMessage>
                        </FormControl>

                        {/* Vista previa de la imagen */}
                        <Box
                            mt={2}
                            borderRadius="md"
                            overflow="hidden"
                            width="100%"
                            height="200px"
                            position="relative"
                        >
                            {imagePreview ? (
                                <Image
                                    src={imagePreview}
                                    alt="Vista previa"
                                    width="100%"
                                    height="100%"
                                    objectFit="cover"
                                />
                            ) : (
                                <Flex
                                    width="100%"
                                    height="100%"
                                    bg="brand.700"
                                    justifyContent="center"
                                    alignItems="center"
                                    flexDirection="column"
                                >
                                    <Icon as={FiImage} w={10} h={10} color="gray.400" />
                                    <Text color="gray.400" mt={2}>Vista previa no disponible</Text>
                                </Flex>
                            )}
                        </Box>
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
                        Actualizar Producto
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default EditProductModal;