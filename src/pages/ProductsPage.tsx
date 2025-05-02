import React, { useState, useEffect } from 'react';
import {
    Box,
    Heading,
    Text,
    Button,
    Flex,
    SimpleGrid,
    Select,
    InputGroup,
    Input,
    InputLeftElement,
    useDisclosure,
    useToast,
    Tabs,
    TabList,
    Tab,
    TabPanels,
    TabPanel
} from '@chakra-ui/react';
import { FiPlus, FiSearch } from 'react-icons/fi';
import ProductCard from '../components/products/ProductCard';
import AddProductModal from '../components/products/AddProductModal';
import EditProductModal from '../components/products/EditProductModal';
import RestockModal from '../components/products/RestockModal';
import { Location } from './LocationsPage';

// Interfaz para productos
export interface Product {
    id: string;
    name: string;
    price: number;
    stock: number;
    locationId: string;
    imageUrl: string;
}

// Enumeración para filtros
enum FilterType {
    ALL = 'all',
    AVAILABLE = 'available',
    OUT_OF_STOCK = 'out_of_stock'
}

const ProductsPage: React.FC = () => {
    // Modales
    const { isOpen: isAddOpen, onOpen: onAddOpen, onClose: onAddClose } = useDisclosure();
    const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
    const { isOpen: isRestockOpen, onOpen: onRestockOpen, onClose: onRestockClose } = useDisclosure();

    const toast = useToast();

    // Estados
    const [products, setProducts] = useState<Product[]>([
        {
            id: '1',
            name: 'Pomada Fijadora BLACK BULL',
            price: 350,
            stock: 25,
            locationId: '1',
            imageUrl: '/products/pomada.jpg'
        },
        {
            id: '2',
            name: 'Aceite para Barba Premium',
            price: 280,
            stock: 15,
            locationId: '1',
            imageUrl: '/products/aceite-barba.jpg'
        },
        {
            id: '3',
            name: 'Shampoo Especial para Cabello',
            price: 220,
            stock: 0,
            locationId: '1',
            imageUrl: '/products/shampoo.jpg'
        },
        {
            id: '4',
            name: 'Kit Completo de Afeitado',
            price: 650,
            stock: 3,
            locationId: '2',
            imageUrl: '/products/kit-afeitado.jpg'
        }
    ]);

    // Datos de ejemplo para las sucursales
    const [locations, setLocations] = useState<Location[]>([
        {
            id: '1',
            name: 'BLACK BULL Central',
            address: 'Av. Reforma 234, Zona 10',
            latitude: 14.6030,
            longitude: -90.5147,
            isPrimary: true
        },
        {
            id: '2',
            name: 'BLACK BULL Norte',
            address: 'C.C. Plaza Norte, Local 45',
            latitude: 14.6377,
            longitude: -90.5133
        }
    ]);

    // Estados de filtrado y búsqueda
    const [activeFilter, setActiveFilter] = useState<FilterType>(FilterType.ALL);
    const [selectedLocation, setSelectedLocation] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    // Filtrar productos basados en los criterios actuales
    const filteredProducts = products.filter(product => {
        // Filtro por búsqueda
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());

        // Filtro por ubicación
        const matchesLocation = selectedLocation === 'all' || product.locationId === selectedLocation;

        // Filtro por estado de stock
        let matchesStockFilter = true;
        if (activeFilter === FilterType.AVAILABLE) {
            matchesStockFilter = product.stock > 0;
        } else if (activeFilter === FilterType.OUT_OF_STOCK) {
            matchesStockFilter = product.stock === 0;
        }

        return matchesSearch && matchesLocation && matchesStockFilter;
    });

    // Funciones de manipulación de productos
    const handleAddProduct = (newProduct: Omit<Product, 'id'>) => {
        const id = Date.now().toString();
        setProducts([...products, { ...newProduct, id }]);
        toast({
            title: 'Producto agregado',
            description: `Se ha agregado "${newProduct.name}" exitosamente.`,
            status: 'success',
            duration: 3000,
            isClosable: true,
        });
        onAddClose();
    };

    const handleEditProduct = (product: Product) => {
        setSelectedProduct(product);
        onEditOpen();
    };

    const handleUpdateProduct = (id: string, updatedData: Partial<Product>) => {
        setProducts(products.map(product =>
            product.id === id ? { ...product, ...updatedData } : product
        ));
        toast({
            title: 'Producto actualizado',
            description: 'El producto ha sido actualizado exitosamente.',
            status: 'success',
            duration: 3000,
            isClosable: true,
        });
        onEditClose();
    };

    const handleRestockProduct = (product: Product) => {
        setSelectedProduct(product);
        onRestockOpen();
    };

    const handleConfirmRestock = (id: string, newStock: number) => {
        setProducts(products.map(product =>
            product.id === id ? { ...product, stock: newStock } : product
        ));
        toast({
            title: 'Inventario actualizado',
            description: 'El stock del producto ha sido actualizado exitosamente.',
            status: 'success',
            duration: 3000,
            isClosable: true,
        });
        onRestockClose();
    };

    const handleDeleteProduct = (id: string) => {
        setProducts(products.filter(product => product.id !== id));
        toast({
            title: 'Producto eliminado',
            description: 'El producto ha sido eliminado exitosamente.',
            status: 'success',
            duration: 3000,
            isClosable: true,
        });
    };

    // Función para obtener el nombre de la sucursal por ID
    const getLocationName = (locationId: string) => {
        const location = locations.find(loc => loc.id === locationId);
        return location ? location.name : 'Desconocida';
    };

    return (
        <Box>
            <Flex justifyContent="space-between" alignItems="center" mb={6}>
                <Box>
                    <Heading size="lg" mb={2}>Productos</Heading>
                    <Text color="gray.400">Administra el inventario de BLACK BULL</Text>
                </Box>
                <Button
                    leftIcon={<FiPlus />}
                    colorScheme="red"
                    onClick={onAddOpen}
                    bg="accent.500"
                    _hover={{ bg: 'accent.600' }}
                >
                    Agregar Producto
                </Button>
            </Flex>

            {/* Filtros y búsqueda */}
            <Box mb={6}>
                <Flex direction={{ base: 'column', md: 'row' }} gap={4}>
                    <InputGroup>
                        <InputLeftElement pointerEvents="none">
                            <FiSearch color="gray.300" />
                        </InputLeftElement>
                        <Input
                            placeholder="Buscar productos..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            bg="brand.800"
                            border="none"
                            _focus={{
                                boxShadow: "0 0 0 1px #ff0000",
                                borderColor: "accent.500"
                            }}
                        />
                    </InputGroup>

                    <Select
                        placeholder="Todas las sucursales"
                        value={selectedLocation}
                        onChange={(e) => setSelectedLocation(e.target.value)}
                        bg="brand.800"
                        border="none"
                        maxW={{ base: '100%', md: '250px' }}
                        _focus={{
                            boxShadow: "0 0 0 1px #ff0000",
                            borderColor: "accent.500"
                        }}
                    >
                        <option value="all">Todas las sucursales</option>
                        {locations.map(location => (
                            <option key={location.id} value={location.id}>
                                {location.name}
                            </option>
                        ))}
                    </Select>
                </Flex>
            </Box>

            {/* Tabs para filtrar por estado */}
            <Tabs
                variant="soft-rounded"
                colorScheme="red"
                mb={6}
                onChange={(index) => {
                    const filters = [FilterType.ALL, FilterType.AVAILABLE, FilterType.OUT_OF_STOCK];
                    setActiveFilter(filters[index]);
                }}
            >
                <TabList>
                    <Tab _selected={{ color: 'white', bg: 'accent.500' }}>Todos</Tab>
                    <Tab _selected={{ color: 'white', bg: 'accent.500' }}>Disponibles</Tab>
                    <Tab _selected={{ color: 'white', bg: 'accent.500' }}>Agotados</Tab>
                </TabList>

                <TabPanels>
                    <TabPanel px={0}>
                        <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6}>
                            {filteredProducts.map(product => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    locationName={getLocationName(product.locationId)}
                                    onEdit={() => handleEditProduct(product)}
                                    onRestock={() => handleRestockProduct(product)}
                                    onDelete={() => handleDeleteProduct(product.id)}
                                />
                            ))}
                        </SimpleGrid>
                        {filteredProducts.length === 0 && (
                            <Box textAlign="center" py={10}>
                                <Text color="gray.400">No hay productos que coincidan con los filtros seleccionados.</Text>
                            </Box>
                        )}
                    </TabPanel>

                    {/* Las otras pestañas comparten el mismo contenido pero con diferentes filtros */}
                    <TabPanel px={0}>
                        <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6}>
                            {filteredProducts.map(product => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    locationName={getLocationName(product.locationId)}
                                    onEdit={() => handleEditProduct(product)}
                                    onRestock={() => handleRestockProduct(product)}
                                    onDelete={() => handleDeleteProduct(product.id)}
                                />
                            ))}
                        </SimpleGrid>
                        {filteredProducts.length === 0 && (
                            <Box textAlign="center" py={10}>
                                <Text color="gray.400">No hay productos que coincidan con los filtros seleccionados.</Text>
                            </Box>
                        )}
                    </TabPanel>

                    <TabPanel px={0}>
                        <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6}>
                            {filteredProducts.map(product => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    locationName={getLocationName(product.locationId)}
                                    onEdit={() => handleEditProduct(product)}
                                    onRestock={() => handleRestockProduct(product)}
                                    onDelete={() => handleDeleteProduct(product.id)}
                                />
                            ))}
                        </SimpleGrid>
                        {filteredProducts.length === 0 && (
                            <Box textAlign="center" py={10}>
                                <Text color="gray.400">No hay productos que coincidan con los filtros seleccionados.</Text>
                            </Box>
                        )}
                    </TabPanel>
                </TabPanels>
            </Tabs>

            {/* Modales */}
            <AddProductModal
                isOpen={isAddOpen}
                onClose={onAddClose}
                onAddProduct={handleAddProduct}
                locations={locations}
            />

            <EditProductModal
                isOpen={isEditOpen}
                onClose={onEditClose}
                onUpdateProduct={handleUpdateProduct}
                product={selectedProduct}
                locations={locations}
            />

            <RestockModal
                isOpen={isRestockOpen}
                onClose={onRestockClose}
                onConfirmRestock={handleConfirmRestock}
                product={selectedProduct}
            />
        </Box>
    );
};

export default ProductsPage;