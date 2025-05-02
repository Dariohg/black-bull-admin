import React from 'react';
import {
    Box,
    SimpleGrid,
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText,
    Heading,
    Text,
    Flex,
    Icon,
    Card,
    CardBody,
    Stack,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Badge,
    HStack,
    Divider
} from '@chakra-ui/react';
import {
    FiUsers,
    FiCalendar,
    FiShoppingBag,
    FiDollarSign,
    FiTrendingUp,
    FiTrendingDown
} from 'react-icons/fi';

interface StatsCardProps {
    title: string;
    stat: string;
    icon: React.ReactElement;
    helpText?: string;
    trendType?: 'up' | 'down' | 'none';
    trendValue?: string;
}

function StatsCard(props: StatsCardProps) {
    const { title, stat, icon, helpText, trendType, trendValue } = props;

    return (
        <Stat
            px={{ base: 4, md: 6 }}
            py="5"
            shadow="sm"
            bg="brand.800"
            rounded="lg"
            borderTop="4px solid"
            borderColor="accent.500"
        >
            <Flex justifyContent="space-between">
                <Box>
                    <StatLabel color="gray.400" fontWeight="medium">{title}</StatLabel>
                    <StatNumber fontSize="3xl" fontWeight="bold">{stat}</StatNumber>
                    <StatHelpText mt={2}>
                        {trendType && (
                            <HStack>
                                {trendType === 'up' ? (
                                    <Icon as={FiTrendingUp} color="green.400" />
                                ) : trendType === 'down' ? (
                                    <Icon as={FiTrendingDown} color="red.400" />
                                ) : null}
                                <Text color={trendType === 'up' ? 'green.400' : trendType === 'down' ? 'red.400' : undefined}>
                                    {trendValue}
                                </Text>
                            </HStack>
                        )}
                        {helpText && <Text color="gray.400">{helpText}</Text>}
                    </StatHelpText>
                </Box>
                <Box
                    my="auto"
                    color="accent.500"
                    alignContent="center"
                >
                    {icon}
                </Box>
            </Flex>
        </Stat>
    );
}

const DashboardPage: React.FC = () => {
    return (
        <Box>
            <Heading as="h1" mb={5}>
                Dashboard
            </Heading>

            <Text color="gray.400" mb={8}>
                Bienvenido al Panel de Administración de Black Bull. Aquí podrás gestionar todos los aspectos de tu barbería.
            </Text>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={5} mb={8}>
                <StatsCard
                    title="Clientes Totales"
                    stat="342"
                    icon={<Icon as={FiUsers} w={8} h={8} />}
                    trendType="up"
                    trendValue="12% vs mes anterior"
                />
                <StatsCard
                    title="Citas esta semana"
                    stat="38"
                    icon={<Icon as={FiCalendar} w={8} h={8} />}
                    helpText="12 pendientes"
                />
                <StatsCard
                    title="Inventario"
                    stat="175"
                    icon={<Icon as={FiShoppingBag} w={8} h={8} />}
                    trendType="down"
                    trendValue="3 productos bajo stock"
                />
                <StatsCard
                    title="Ingresos del mes"
                    stat="$48,350"
                    icon={<Icon as={FiDollarSign} w={8} h={8} />}
                    trendType="up"
                    trendValue="8% vs mes anterior"
                />
            </SimpleGrid>

            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={5}>
                {/* Citas próximas */}
                <Card bg="brand.800" shadow="sm">
                    <CardBody>
                        <Stack spacing={5}>
                            <Heading size="md" mb={2}>Próximas Citas</Heading>
                            <Divider borderColor="brand.700" />

                            <Box overflowX="auto">
                                <Table size="sm" variant="simple">
                                    <Thead>
                                        <Tr>
                                            <Th borderColor="brand.700">Cliente</Th>
                                            <Th borderColor="brand.700">Servicio</Th>
                                            <Th borderColor="brand.700">Hora</Th>
                                            <Th borderColor="brand.700">Estado</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        <Tr>
                                            <Td borderColor="brand.700">Carlos Méndez</Td>
                                            <Td borderColor="brand.700">Corte + Barba</Td>
                                            <Td borderColor="brand.700">14:00</Td>
                                            <Td borderColor="brand.700">
                                                <Badge colorScheme="green">Confirmada</Badge>
                                            </Td>
                                        </Tr>
                                        <Tr>
                                            <Td borderColor="brand.700">Miguel Torres</Td>
                                            <Td borderColor="brand.700">Fade Clásico</Td>
                                            <Td borderColor="brand.700">15:30</Td>
                                            <Td borderColor="brand.700">
                                                <Badge colorScheme="yellow">Pendiente</Badge>
                                            </Td>
                                        </Tr>
                                        <Tr>
                                            <Td borderColor="brand.700">Roberto Guzmán</Td>
                                            <Td borderColor="brand.700">Afeitado Completo</Td>
                                            <Td borderColor="brand.700">16:45</Td>
                                            <Td borderColor="brand.700">
                                                <Badge colorScheme="green">Confirmada</Badge>
                                            </Td>
                                        </Tr>
                                        <Tr>
                                            <Td borderColor="brand.700">José Vega</Td>
                                            <Td borderColor="brand.700">Corte Ejecutivo</Td>
                                            <Td borderColor="brand.700">18:00</Td>
                                            <Td borderColor="brand.700">
                                                <Badge colorScheme="green">Confirmada</Badge>
                                            </Td>
                                        </Tr>
                                    </Tbody>
                                </Table>
                            </Box>
                        </Stack>
                    </CardBody>
                </Card>

                {/* Inventario bajo */}
                <Card bg="brand.800" shadow="sm">
                    <CardBody>
                        <Stack spacing={5}>
                            <Heading size="md" mb={2}>Productos con Stock Bajo</Heading>
                            <Divider borderColor="brand.700" />

                            <Box overflowX="auto">
                                <Table size="sm" variant="simple">
                                    <Thead>
                                        <Tr>
                                            <Th borderColor="brand.700">Producto</Th>
                                            <Th borderColor="brand.700">Stock</Th>
                                            <Th borderColor="brand.700">Estado</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        <Tr>
                                            <Td borderColor="brand.700">Kit Completo de Afeitado</Td>
                                            <Td borderColor="brand.700">3</Td>
                                            <Td borderColor="brand.700">
                                                <Badge colorScheme="red">Crítico</Badge>
                                            </Td>
                                        </Tr>
                                        <Tr>
                                            <Td borderColor="brand.700">Aceite para Barba Premium</Td>
                                            <Td borderColor="brand.700">5</Td>
                                            <Td borderColor="brand.700">
                                                <Badge colorScheme="yellow">Bajo</Badge>
                                            </Td>
                                        </Tr>
                                        <Tr>
                                            <Td borderColor="brand.700">Shampoo Especial para Cabello</Td>
                                            <Td borderColor="brand.700">8</Td>
                                            <Td borderColor="brand.700">
                                                <Badge colorScheme="yellow">Bajo</Badge>
                                            </Td>
                                        </Tr>
                                    </Tbody>
                                </Table>
                            </Box>
                        </Stack>
                    </CardBody>
                </Card>
            </SimpleGrid>
        </Box>
    );
};

export default DashboardPage;