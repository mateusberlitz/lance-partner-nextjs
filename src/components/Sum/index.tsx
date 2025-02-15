import { Heading, Modal, ModalBody, ModalCloseButton, ModalContent, ModalOverlay, Stack, Text, Table, Thead, Tbody, Td, Th, Tr, Tfoot, Checkbox, Accordion, AccordionItem, AccordionButton, Box, AccordionPanel, AccordionIcon, HStack, useBreakpointValue, Flex } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { ChangeEvent, useEffect, useState } from "react";
import { Quota } from "../../pages/admin";
import { Board } from "../Board";
import { MainButton } from "../Buttons/MainButton";
import { TextTag } from "../TextTag";
import { GetSumResult } from "./sumAction";

interface SumModalProps{
    isOpen: boolean;
    handleCloseSumModal: () => void;
    selectedQuotas: Quota[];
    notFixed?: boolean;
}

interface Amount{
    credit: number;
    entry: number;
    deadline: number;
    parcel: number;
    debt: number;
    tax: number;
    fund: number;
    security: number;
}

interface Mensalidade {
    valor: number;
    mesInicio: number;
    mesFim: number;
}

function calcularParcelamentoMensal(cotas: Quota[]): Mensalidade[] {
    const maxParcelas = cotas.reduce((max, cota) => Math.max(max, parseInt(cota.parcelas)), 0);
    let totalMensal: number[] = Array(maxParcelas).fill(0);

    cotas.forEach(cota => {
        const numParcelas = parseInt(cota.parcelas);
        const valorParcela = parseFloat(cota.valor_parcela.replaceAll('.', '').replaceAll(',', '.'));

        for (let mes = 0; mes < numParcelas; mes++) {
            totalMensal[mes] += valorParcela;
        }
    });

    // console.log(cotas);

    // Criar um array para armazenar as mensalidades com os meses correspondentes
    let mensalidades: Mensalidade[] = [];
    let valorAtual = totalMensal[0];
    let mesInicio = 1;

    for (let mes = 1; mes <= totalMensal.length; mes++) {
        if (mes === totalMensal.length || totalMensal[mes] !== valorAtual) {
            mensalidades.push({ valor: valorAtual, mesInicio: mesInicio, mesFim: mes });
            valorAtual = totalMensal[mes];
            mesInicio = mes + 1;
        }
    }

    return mensalidades;
}

// Exemplo de uso:
const cotas: Quota[] = [
    { id: "1", administradora: "Admin1", categoria: "Carro", entrada: "5000", parcelas: "36", valor_credito: "30000", valor_parcela: "800", reserva: "5%", taxa: "0.5%", fundo: "1.5%" },
    { id: "2", administradora: "Admin2", categoria: "Moto", entrada: "2000", parcelas: "24", valor_credito: "10000", valor_parcela: "450", reserva: "5%", taxa: "0.5%", fundo: "1.5%" }
];

const resultado = calcularParcelamentoMensal(cotas);

export default function Sum({isOpen, handleCloseSumModal, selectedQuotas, notFixed = false} : SumModalProps){
    const router = useRouter();
    const isWideVersion = useBreakpointValue({base: false, lg: true});

    const [sendCards, setSendCards] = useState(false);
    const [sendEntry, setSendEntry] = useState(false);
    const [sendDebt, setSendDebt] = useState(false);
    const [sendTax, setSendTax] = useState(false);
    const [sendFund, setSendFund] = useState(false);
    const [parcels, setParcels] = useState<Mensalidade[]>();

    const [amount, setAmount] = useState<Amount>({
        credit: 0,
        entry: 0,
        deadline: 0,
        parcel: 0,
        debt: 0,
        tax: 0,
        fund: 0,
        security: 0
    });

    const handleSend = () => {
        const entryText = sendEntry ? `\nEntrada: ${Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(amount.entry)}` : ``;
        const debtText = sendDebt ? `\nSaldo Devedor: ${Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(amount.debt)}` : ``;
        const securityText = `\nSeguro de Vida: ${Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(amount.security)}`;
        const fundText = sendFund ? `\nFundo Comum: ${Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(amount.fund)}` : ``;
        const taxText = sendTax ? `\nTaxa de transferência: ${Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(amount.tax)}` : ``;

        const cardsText = sendCards ? selectedQuotas.reduce((accumulator, quota) => {
            return `${accumulator}\nCarta ${quota.id} - ${quota.categoria}: R$ ${quota.valor_credito} (${quota.parcelas}x R$${quota.valor_parcela})`
        }, `\nCartas selecionadas:\n`) : ``;

        const parcelsText = parcels ? parcels.reduce((accumulator, parcel) => {
            return `${accumulator}\n${parcel.mesInicio} à ${parcel.mesFim}: ${Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(parcel.valor)}`
        }, `\nParcelamento:`) : ``;

        const text = `Resultado da Soma das Cartas Contempladas

Crédito: ${Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(amount.credit)} ${entryText}
${parcelsText} ${fundText} ${taxText} ${debtText} ${securityText}
        ${cardsText}`;

        window.open(`https://api.whatsapp.com/send?text=${window.encodeURIComponent(text)}`);
    }

    //${amount.deadline}x${Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(amount.parcel)} 

    useEffect(() => {
        // const newAmount = selectedQuotas.reduce((accumulator, quota) => {
        //     return {
        //         credit: accumulator.credit + parseFloat(quota.valor_credito.replaceAll(".", "").replaceAll(",", ".")),
        //         entry: accumulator.entry + parseFloat(quota.entrada.replaceAll(".", "").replaceAll(",", ".")),
        //         deadline: accumulator.deadline + parseInt(quota.parcelas),
        //         parcel: accumulator.parcel + parseFloat(quota.valor_parcela.replaceAll(".", "").replaceAll(",", ".")),
        //         debt: accumulator.debt + parseFloat(quota.valor_parcela.replaceAll(".", "").replaceAll(",", "."))*parseInt(quota.parcelas),
        //         tax: accumulator.tax + (quota.taxa ? parseFloat(quota.taxa.toString().replaceAll('.', '').replaceAll(',', '.')) : 0),
        //         fund: accumulator.fund + (quota.fundo ? parseFloat(quota.fundo.toString().replaceAll('.', '').replaceAll(',', '.')) : 0),
        //         security: accumulator.security + parseFloat(quota.valor_parcela.replaceAll(".", "").replaceAll(",", "."))*parseInt(quota.parcelas) * (quota.categoria == "Veículo" ? 0.00088 : 0.00055),
        //     }
        // }, {
        //     credit: 0,
        //     entry: 0,
        //     deadline: 0,
        //     parcel: 0,
        //     debt: 0,
        //     tax: 0,
        //     fund: 0,
        //     security: 0
        // });

        // newAmount.deadline = Math.round(newAmount.debt / newAmount.parcel);

        setAmount(GetSumResult(selectedQuotas));

        setParcels(calcularParcelamentoMensal(selectedQuotas))
    }, [selectedQuotas]);

    return(
        <>
          <Modal id="sum-modal" isOpen={isOpen} onClose={handleCloseSumModal} blockScrollOnMount={!notFixed}>
            <ModalOverlay w="100%"/>
  
            <ModalContent w="100%" maxW={"600px"}>
              {/* <ModalHeader>Modal Title</ModalHeader> */}
  
              <ModalCloseButton />
  
              <ModalBody w="100%">
                <Stack w="100%" maxW="800px" m="0 auto" py="10" spacing="14">
                    <Stack width={"100%"} spacing="8">
                        <Stack>
                            <TextTag>SOMA DE CONTEMPLADAS</TextTag>
  
                            <Heading fontSize="3xl">Veja o resultado da soma</Heading>
                        </Stack>

                        {
                            isWideVersion ? (
                                <Stack width={"100%"} spacing="6">
                                    <Stack justifyContent={"space-between"} width={"100%"} direction={["column","column","row","row"]}>
                                        <Stack width={"48%"} >
                                            <Text fontWeight={"semibold"} fontSize={"lg"}>Crédito</Text>
                                            <Flex bg="gray.200" p="3" width={"100%"} px="4" borderRadius={"4"}>
                                                <Text fontSize={"lg"}>{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(amount.credit)}</Text>
                                            </Flex>
                                        </Stack>

                                        <Stack width={"48%"} >
                                            <Text fontWeight={"semibold"} fontSize={"lg"}>Entrada</Text>
                                            <Flex bg="gray.200" p="3" width={"100%"} px="4" borderRadius={"4"}>
                                                <Text fontSize={"lg"}>{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(amount.entry)}</Text>
                                            </Flex>
                                        </Stack>
                                    </Stack>

                                    <Stack justifyContent={"space-between"} width={"100%"} direction={["column","column","row","row"]}>
                                        <Stack width={"48%"} >
                                            <Text fontWeight={"semibold"} fontSize={"lg"}>Saldo Devedor</Text>
                                            <Flex bg="gray.200" p="3" width={"100%"} px="4" borderRadius={"4"}>
                                                <Text fontSize={"lg"}>{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(amount.debt)}</Text>
                                            </Flex>
                                        </Stack>

                                        <Stack width={"48%"} >
                                            <Text fontWeight={"semibold"} fontSize={"lg"}>Taxa de Transferência</Text>
                                            <Flex bg="gray.200" p="3" width={"100%"} px="4" borderRadius={"4"}>
                                                <Text fontSize={"lg"}>{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(amount.tax)}</Text>
                                            </Flex>
                                        </Stack>
                                    </Stack>

                                    <Stack justifyContent={"space-between"} width={"100%"} direction={["column","column","row","row"]}>
                                        <Stack width={"48%"} >
                                            <Text fontWeight={"semibold"} fontSize={"lg"}>Prazo/Parcelas</Text>
                                            <Stack bg="gray.200" p="3" width={"100%"} px="4" borderRadius={"4"}>
                                                {
                                                    parcels?.map((parcel) => {
                                                        return(
                                                            <Text key={`text-${parcel.mesInicio} a ${parcel.mesFim}`} fontSize={"lg"}>Parcela {parcel.mesInicio} a {parcel.mesFim}: {Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(parcel.valor)}</Text>
                                                        )
                                                    })
                                                }
                                            </Stack>
                                        </Stack>

                                        <Stack width={"48%"} >
                                            <Text fontWeight={"semibold"} fontSize={"lg"}>Média de Prazo/Parcela</Text>
                                            <Flex bg="gray.200" p="3" width={"100%"} px="4" borderRadius={"4"}>
                                                <Text fontSize={"lg"}>{amount.deadline}x {Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(amount.parcel)}</Text>
                                            </Flex>
                                        </Stack>
                                    </Stack>

                                    <Stack justifyContent={"space-between"} width={"100%"} direction={["column","column","row","row"]}>
                                        <Stack width={"48%"} >
                                            <Text fontWeight={"semibold"} fontSize={"lg"}>Seguro de Vida</Text>
                                            <Flex bg="gray.200" p="3" width={"100%"} px="4" borderRadius={"4"}>
                                                <Text fontSize={"lg"}>{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(amount.security)}</Text>
                                            </Flex>
                                        </Stack>

                                        <Stack width={"48%"} >
                                            <Text fontWeight={"semibold"} fontSize={"lg"}>Fundo Comum</Text>
                                            <Flex bg="gray.200" p="3" width={"100%"} px="4" borderRadius={"4"}>
                                                <Text fontSize={"lg"}>{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(amount.fund)}</Text>
                                            </Flex>
                                        </Stack>
                                    </Stack>
                                </Stack>
                            ) : (
                                <Table borderRadius="4px" overflow="hidden">
                                    <Thead>
                                        {/* <Tr>
                                            <Th bg="red.100" fontFamily="Inter" fontSize="sm" py="16px" color="black"></Th>
                                            <Th bg="red.100" fontFamily="Inter" fontSize="sm" py="16px" color="black"></Th>
                                        </Tr> */}
                                    </Thead>
                                    <Tbody fontSize="sm">
                                        <Tr>
                                            <Td bg="gray.200">Crédito</Td>
                                            <Td bg="gray.200">{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(amount.credit)}</Td>
                                        </Tr>
                                        <Tr>
                                            <Td bg="gray.200">Entrada</Td>
                                            <Td bg="gray.200">{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(amount.entry)}</Td>
                                        </Tr>
                                        <Tr>
                                            <Td bg="gray.200">Prazo</Td>
                                            <Td bg="gray.200">{amount.deadline}x</Td>
                                        </Tr>
                                        {/* <Tr>
                                            <Td bg="gray.200">Parcela</Td>
                                            <Td bg="gray.200">{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(amount.parcel)}</Td>
                                        </Tr> */}
                                        {
                                            parcels?.map((parcel) => {
                                                return(
                                                    <Tr key={`${parcel.mesInicio} a ${parcel.mesFim}`}>
                                                        <Td bg="gray.200">Parcela {parcel.mesInicio} a {parcel.mesFim}</Td>
                                                        <Td bg="gray.200">{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(parcel.valor)}</Td>
                                                    </Tr>
                                                )
                                            })
                                        }
                                        
                                        <Tr>
                                            <Td bg="gray.200">Fundo comum</Td>
                                            <Td bg="gray.200">{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(amount.fund)}</Td>
                                        </Tr>
                                        <Tr>
                                            <Td bg="gray.200">Taxa de Transferência</Td>
                                            <Td bg="gray.200">{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(amount.tax)}</Td>
                                        </Tr>
                                        <Tr>
                                            <Td bg="gray.200">Seguro de vida</Td>
                                            <Td bg="gray.200">{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(amount.security)}</Td>
                                        </Tr>
                                        <Tr>
                                            <Td bg="gray.200" fontWeight="bold">Saldo Devedor</Td>
                                            <Td bg="gray.200" fontWeight="bold">{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(amount.debt)}</Td>
                                        </Tr>
                                    </Tbody>
                                    {/* <Tfoot>
                                        <Tr>
                                        <Th bg="black" color="white" fontFamily="Inter" textTransform="capitalize" fontSize="sm" py="16px">Prazo: 180 meses</Th>
                                        <Th bg="black" color="white" fontFamily="Inter" textTransform="capitalize" fontSize="sm" py="16px">Meia parcela: R$683,00</Th>
                                        </Tr>
                                    </Tfoot> */}
                                </Table>
                            )
                        }

                        <Accordion w="100%" allowToggle>
                            <AccordionItem w="100%">
                                <h2>
                                <AccordionButton>
                                    <Box flex='1' textAlign='left'>
                                        Cartas Selecionadas
                                    </Box>
                                    <AccordionIcon />
                                </AccordionButton>
                                </h2>
                                <AccordionPanel pb={4}>

                                <Table size='sm' borderRadius="4px" overflow="hidden" maxW="100%">
                                    <Tbody>
                                        {
                                            selectedQuotas.map((quota) => {
                                                return(
                                                    <Tr key={quota.id} fontSize={"14px"}>
                                                        <Td px="0">
                                                            <Stack spacing="0">
                                                                <Text fontSize="11px" color="gray.700">{quota.id}</Text>
                                                                <Text color="gray.900" fontWeight="bold">{quota.categoria}</Text>
                                                            </Stack>
                                                        </Td>
                                                        {/* <Td>{quota.categoria}</Td> */}
                                                        {/* <Td>{quota.valor_credito}</Td>
                                                        <Td>{quota.parcelas}x</Td> */}
                                                        <Td textAlign={"right"} px="0">
                                                            <Stack spacing="0">
                                                                <Text fontWeight="bold">{quota.valor_credito}</Text>
                                                                <Text fontSize="11px" fontWeight="">{quota.parcelas}x {quota.valor_parcela}</Text>
                                                            </Stack>
                                                        </Td>
                                                    </Tr>
                                                )
                                            })
                                        }
                                    </Tbody>
                                    {/* <Tfoot>
                                        <Tr>
                                        <Th bg="black" color="white" fontFamily="Inter" textTransform="capitalize" fontSize="sm" py="16px">Prazo: 180 meses</Th>
                                        <Th bg="black" color="white" fontFamily="Inter" textTransform="capitalize" fontSize="sm" py="16px">Meia parcela: R$683,00</Th>
                                        </Tr>
                                    </Tfoot> */}
                                </Table>

                                    {
                                        selectedQuotas.map((quota) => {
                                            //return(
                                                <HStack key={quota.id} fontSize={"14px"} w="100%" justifyContent="space-between">
                                                    <Stack spacing="0">
                                                        <Text fontSize="11px" color="gray.700">{quota.id}</Text>
                                                        <Text color="gray.900">{quota.categoria}</Text>
                                                    </Stack>
                                                    <Stack spacing="0">
                                                        <Text fontWeight="bold">{quota.valor_credito}</Text>
                                                        <Text fontSize="11px" fontWeight="">{quota.parcelas}x {quota.valor_parcela}</Text>
                                                    </Stack>
                                                </HStack>
                                            //)
                                        })
                                    }
                                </AccordionPanel>
                            </AccordionItem>
                        </Accordion>

                        <Board boxShadow="none" border="1px solid" borderColor="gray.200" padding="5" display="flex" flexDir="row" justifyContent="space-between" alignItems="center">
                            <Stack spacing="6">
                                <TextTag fontSize="11" fontWeight="semibold">COMPARTILHE</TextTag>

                                <Stack>
                                    <Checkbox borderColor="gray.600" onChange={(event: ChangeEvent<HTMLInputElement>) => setSendCards(event.target?.checked)}><Text>Cartas selecionadas</Text></Checkbox>
                                    <Checkbox borderColor="gray.600" onChange={(event: ChangeEvent<HTMLInputElement>) => setSendDebt(event.target?.checked)}><Text>Saldo devedor</Text></Checkbox>
                                    <Checkbox borderColor="gray.600" onChange={(event: ChangeEvent<HTMLInputElement>) => setSendEntry(event.target?.checked)}><Text>Entrada</Text></Checkbox>
                                    <Checkbox borderColor="gray.600" onChange={(event: ChangeEvent<HTMLInputElement>) => setSendTax(event.target?.checked)}><Text>Taxa de transferência</Text></Checkbox>
                                    <Checkbox borderColor="gray.600" onChange={(event: ChangeEvent<HTMLInputElement>) => setSendFund(event.target?.checked)}><Text>Fundo comum</Text></Checkbox>
                                </Stack>

                                <MainButton size="lg" onClick={() => handleSend()}>
                                    Compartilhar
                                </MainButton>
                            </Stack>
                        </Board>
                    </Stack>
                </Stack>
              </ModalBody>
  
              {/* <ModalFooter>
                <Button colorScheme='blue' mr={3} onClick={onClose}>
                  Close
                </Button>
                <Button variant='ghost'>Secondary Action</Button>
              </ModalFooter> */}
            </ModalContent>
          </Modal>
        </>
    )
}