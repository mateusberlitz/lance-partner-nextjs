import { Heading, Modal, ModalBody, ModalCloseButton, ModalContent, ModalOverlay, Stack, Text, Table, Thead, Tbody, Td, Th, Tr, Tfoot, Checkbox } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { ChangeEvent, useEffect, useState } from "react";
import { Broker, Quota } from "../../pages/[slug]";
import { Board } from "../Board";
import { MainButton } from "../Buttons/MainButton";
import { TextTag } from "../TextTag";

interface SumModalProps{
    isOpen: boolean;
    handleCloseSumModal: () => void;
    selectedQuotas: Quota[];
    broker: Broker;
}

interface Amount{
    credit: number;
    entry: number;
    deadline: number;
    parcel: number;
    debt: number;
}

export default function Sum({isOpen, handleCloseSumModal, selectedQuotas, broker} : SumModalProps){
    const router = useRouter();

    const [sendCards, setSendCards] = useState(false);
    const [sendEntry, setSendEntry] = useState(false);
    const [sendDebt, setSendDebt] = useState(false);

  const phoneWithoutFormat = broker ? broker.phone.replace(/[\(\)\s\-]/g, '') : '';

    const [amount, setAmount] = useState<Amount>({
        credit: 0,
        entry: 0,
        deadline: 0,
        parcel: 0,
        debt: 0
    });

    const handleSend = () => {
        const entryText = sendEntry ? `\nEntrada: ${Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(amount.entry)}` : ``;
        const debtText = sendDebt ? `\nSaldo Devedor: ${Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(amount.debt)}` : ``;

        const cardsText = sendCards ? selectedQuotas.reduce((accumulator, quota) => {
            return `${accumulator}\nCarta ${quota.id} - ${quota.categoria}: R$ ${quota.valor_credito} (${quota.parcelas}x R$${quota.valor_parcela})`
        }, `\nCartas selecionadas:\n`) : ``;

        const text = `Resultado da Soma das Cartas Contempladas

Crédito: ${Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(amount.credit)} ${entryText}
Prazo: ${amount.deadline}x
Parcela: ${Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(amount.parcel)} ${debtText}
        ${cardsText}`;

        window.open(`https://api.whatsapp.com/send?text=${window.encodeURIComponent(text)}`);
    }

    useEffect(() => {
        const newAmount = selectedQuotas.reduce((accumulator, quota) => {
            return {
                credit: accumulator.credit + parseFloat(quota.valor_credito.replace(".", "").replace(",", ".")),
                entry: accumulator.entry + parseFloat(quota.entrada.replace(".", "").replace(",", ".")),
                deadline: accumulator.deadline + parseInt(quota.parcelas),
                parcel: accumulator.parcel + parseFloat(quota.valor_parcela.replace(".", "").replace(",", ".")),
                debt: accumulator.debt + parseFloat(quota.valor_parcela.replace(".", "").replace(",", "."))*parseInt(quota.parcelas),
            }
        }, {
            credit: 0,
            entry: 0,
            deadline: 0,
            parcel: 0,
            debt: 0
        });

        newAmount.deadline = Math.ceil(newAmount.deadline / selectedQuotas.length);

        setAmount(newAmount);
    }, [selectedQuotas]);

    return(
        <>
          <Modal isOpen={isOpen} onClose={handleCloseSumModal}>
            <ModalOverlay w="100%"/>
  
            <ModalContent w="100%">
              {/* <ModalHeader>Modal Title</ModalHeader> */}
  
              <ModalCloseButton />
  
              <ModalBody bg="">
                <Stack w="100%" maxW="360px" m="0 auto" py="10" spacing="14">
                    <Stack spacing="8">
                        <TextTag>SOMA DE CONTEMPLADAS</TextTag>
  
                        <Heading fontSize="3xl">Veja o resultado da soma</Heading>
  
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
                                <Tr>
                                    <Td bg="gray.200">Parcela</Td>
                                    <Td bg="gray.200">{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(amount.parcel)}</Td>
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

                        <Board boxShadow="none" border="1px solid" borderColor="gray.200" padding="5" display="flex" flexDir="row" justifyContent="space-between" alignItems="center">
                            <Stack spacing="6">
                                <TextTag fontSize="11" fontWeight="semibold">COMPARTILHE</TextTag>

                                <Stack>
                                    <Checkbox borderColor="gray.600" onChange={(event: ChangeEvent<HTMLInputElement>) => setSendCards(event.target?.checked)}><Text>Cartas selecionadas</Text></Checkbox>
                                    <Checkbox borderColor="gray.600" onChange={(event: ChangeEvent<HTMLInputElement>) => setSendEntry(event.target?.checked)}><Text>Saldo devedor</Text></Checkbox>
                                    <Checkbox borderColor="gray.600" onChange={(event: ChangeEvent<HTMLInputElement>) => setSendDebt(event.target?.checked)}><Text>Entrada</Text></Checkbox>
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