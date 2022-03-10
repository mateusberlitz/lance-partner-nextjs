import { Checkbox, HStack, Stack, Table, Tbody, Th, Thead, Tr, useBreakpointValue } from "@chakra-ui/react"
import { OutlineButton } from "../../components/Buttons/OutlineButton"

export default function QuotasTable(){
    const fontSize = useBreakpointValue({base: '9px', md: 'sm', lg: '',});
    const isWideVersion = useBreakpointValue({base: false, lg: true});

    return (
        <Stack spacing="0" borderRadius="4px" overflow="hidden" px="2">
            <HStack justifyContent="space-between" bg="gray.300" p="4">
                <HStack spacing="4">
                    <Checkbox colorScheme={"firstScheme"} borderColor="gray.400" onChange={handleSelectAll}><Text fontSize={fontSize}>Todas</Text></Checkbox>
                    <Checkbox colorScheme={"firstScheme"} borderColor="gray.400" onChange={handleSelectRealty}><Text fontSize={fontSize}>Imóveis</Text></Checkbox>
                    <Checkbox colorScheme={"firstScheme"} borderColor="gray.400" onChange={handleSelectVehicle}><Text fontSize={fontSize}>Veículos</Text></Checkbox>
                </HStack>

                <OutlineButton onClick={() => handleSend()} px="4" size="sm" borderColor="gray.400" _hover={{borderColor: 'first'}}>
                    Compartilhar
                </OutlineButton>
            </HStack>

            <Table variant='simple' ref={toPrintRef}>
                <Thead>
                    <Tr h="48px">
                        {/* {
                            isWideVersion && <Th p="1" fontSize={fontSize}>Cota</Th>
                        } */}
                        <Th p="2px" fontSize={fontSize}>{isWideVersion && "Cota"}</Th>
                        <Th p="2px" fontSize={fontSize}>Tipo</Th>
                        <Th p="2px" fontSize={fontSize}>Valor</Th>
                        <Th p="2px" fontSize={fontSize}>Entrada</Th>
                        <Th p="2px" fontSize={fontSize}>Prazo</Th>
                        <Th p="2px" fontSize={fontSize}>Parcela</Th>
                        <Th p="2px" fontSize={fontSize}>Adm</Th>
                        <Th p="2px" fontSize={fontSize}>{isWideVersion && "Contato"}</Th>
                        <Th p="2px" fontSize={fontSize}>{isWideVersion && "Status"}</Th>
                    </Tr>
                </Thead>
                <Tbody fontSize={fontSize}>
                    {
                        quotas && quotas.map((quota:Quota) =>{
                            return (
                                <Tr key={quota.id} minH="40px" h={["52px"]} py="5">
                                    <Td p="2px" {...border}>
                                        <HStack>
                                            <Checkbox colorScheme={"firstScheme"} isChecked={selectedQuotasId.includes(parseInt(quota.id))} value={quota.id} onChange={handleSelect}/>
                                            {isWideVersion && <Text>{quota.id}</Text>}
                                        </HStack>
                                    </Td>
                                    <Td p="2px" {...border}>{quota.categoria}</Td>
                                    <Td p="2px" {...border}>
                                        <HStack spacing="1">
                                            <small>R$</small>
                                            <Text>{quota.valor_credito}</Text>
                                        </HStack>
                                    </Td>
                                    <Td p="2px" {...border}>
                                        <HStack spacing="1">
                                            <small>R$</small>
                                            <Text>{quota.entrada}</Text>
                                        </HStack>
                                    </Td>
                                    <Td p="2px" {...border}>{quota.parcelas}x</Td>
                                    <Td p="2px" {...border}>
                                        <HStack spacing="1">
                                            <small>R$</small>
                                            <Text>{quota.valor_parcela}</Text>
                                        </HStack>
                                    </Td>
                                    <Td p="2px" {...border}>{quota.administradora}</Td>
                                    <Td p="2px" {...border}>
                                        {
                                            isWideVersion === true &&
                                            <OutlineButton p="4" color="gray.800" onClick={() => handleContact(quota)}  size="sm" borderColor="gray.400" _hover={{borderColor: 'green.400'}}>
                                                Contatar
                                            </OutlineButton>
                                        }
                                        {
                                            isWideVersion === false && 
                                            <IconButton onClick={() => handleContact(quota)} size="sm" minW="26px" h="26px" p="0" colorScheme='green' bg="transparent" border="1px solid" borderColor="gray.400" _hover={{borderColor: 'green.400'}} aria-label='Chamar no whatsapp' icon={<Whatsapp width="10px" stroke="#48bb78"/>}/>
                                        }
                                    </Td>
                                    <Td p="2px" {...border}>
                                        {
                                            isWideVersion ? quota.reserva :
                                            (
                                                quota.reserva === "Disponível" ? <Check width="12px" color="#48bb78"/> : <X width="12px" color="#DB2C2C"/>
                                            )
                                        }
                                    </Td>
                                </Tr>
                            )
                        })
                    }
                    
                </Tbody>
            </Table>

            <Box>
                <HStack mt="5">
                    <ReactToPrint
                        trigger={() => {
                            // NOTE: could just as easily return <SomeComponent />. Do NOT pass an `onClick` prop
                            // to the root node of the returned component as it will be overwritten.
                            return  <OutlineButton px="4" size="sm" borderColor="gray.300" _hover={{borderColor: 'first'}}>
                                        Imprimir
                                    </OutlineButton>
                        }}
                        content={() => toPrintRef.current}
                    />
                    <ReactToPrint
                        trigger={() => {
                            // NOTE: could just as easily return <SomeComponent />. Do NOT pass an `onClick` prop
                            // to the root node of the returned component as it will be overwritten.
                            return  <OutlineButton px="4" size="sm" borderColor="gray.300" _hover={{borderColor: 'first'}}>
                                        Gerar PDF
                                    </OutlineButton>
                        }}
                        content={() => toPrintRef.current}
                    />

                    <CSVLink data={quotas}>
                        <OutlineButton px="4" size="sm" borderColor="gray.300" _hover={{borderColor: 'first'}}>
                            Salvar
                        </OutlineButton>
                    </CSVLink>
                </HStack>
            </Box>
        </Stack>
    )
}