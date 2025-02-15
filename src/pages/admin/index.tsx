import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, ChakraProvider, Checkbox, Divider, extendTheme, Flex, Heading, HStack, Icon, IconButton, Img, Input, Spinner, Stack, Table, Tbody, Td, Text, Th, Thead, Tr, useBreakpointValue, useToast } from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import Router, { useRouter } from "next/router";
import { Check, Edit, LogOut, Search, Settings, X } from "react-feather";
import { OutlineButton } from "../../components/Buttons/OutlineButton";
import { ControlledInput } from "../../components/Forms/Inputs/ControlledInput";
import { TextTag } from "../../components/TextTag";
import { ProfileProvider, useProfile } from "../../contexts/useProfile";

import { useForm } from "react-hook-form";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { SolidButton } from "../../components/Buttons/SolidButton";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { api, serverApi, storageApi } from "../../services/api";
import { showErrors } from "../../contexts/useErrors";
import { ColorPicker } from "../../components/Forms/ColorPicker";
import Link from "next/link";
import { Menu } from "../../components/Menu";
import Head from "next/head";
import Sum from "../../components/Sum";
import axios from "axios";
import { CSVLink } from "react-csv";
import ReactToPrint from "react-to-print";
import Whatsapp from '../../../public/icons/whatsapp.svg';
import { ControlledSelect } from "../../components/Forms/Selects/ControlledSelect";
import { GetSumResult } from "../../components/Sum/sumAction";
import { SumLog } from "../../components/SumLog";

interface ProfileFormData{
    name: string;
    name_display?: string;
    email: string;
    email_display?: string;
    address: string;
    phone: string;
    logo?: File;
    color?: string;
    second_color?: string;
}

export interface Broker{
    slug: string;
    name: string;
    name_display: string;
    email: string;
    email_display: string;
    address: string;
    phone: string;
    logo: string;
    color: string;
    second_color: string;
  }
  
  export interface Quota{
    id: string;
    administradora: string;
    categoria: string;
    entrada: string;
    parcelas: string;
    valor_credito: string;
    valor_parcela: string;
    reserva: string;
    taxa: string;
    fundo: string;
  }
  
  interface ContempladasProps{
    quotas: Quota[];
    broker?: Broker;
  }
  
  interface SelectQuota{
    id: number;
    selected: boolean;
  }

interface ContemplatedsFilter{
    credit: number;
    value: number;
    deadline?: number;
    segment?: string;
    reserved?: string;
    adm?:string;
}

const FilterFormSchema = yup.object().shape({
    credit: yup.number().nullable(true).transform((v) => (v === '' || Number.isNaN(v) ? null : v)),
    value: yup.number().nullable(true).transform((v) => (v === '' || Number.isNaN(v) ? null : v)),
    deadline: yup.number().nullable(true).transform((v) => (v === '' || Number.isNaN(v) ? null : v)),
    segment: yup.string().nullable(),
    reserved: yup.string().nullable(),
    adm: yup.string().nullable(),
});

function AdminPageContent({quotas, broker}: ContempladasProps){
    const toast = useToast();
    const router = useRouter();
    const { loading, profile, signOut } = useProfile();

    const [pageAccess, setPageAccess] = useState(false);

    const fontSize = useBreakpointValue({base: '9px', md: 'sm', lg: 'sm',});
    const buttonFontSize = useBreakpointValue({base: 'sm', md: 'sm', lg: '',});
    const isWideVersion = useBreakpointValue({base: false, lg: true});
    const [showingQuotas, setShowingQuotas] = useState<Quota[]>(quotas);
  
    const border = {borderBottom: "1px solid", borderColor:"gray.300"}
  
    const phoneWithoutFormat = broker ? broker.phone.replace(/[\(\)\s\-]/g, '') : '';
  
    const [selectedQuotasId, setSelectedQuotasId] = useState<number[]>([]);
    const [selectedQuotas, setSelectedQuotas] = useState<Quota[]>([]);
  
    const handleSelect = (event: ChangeEvent<HTMLInputElement>) => {
        if(event.target?.checked){
            setSelectedQuotasId([...selectedQuotasId, parseInt(event.target?.value)]);
            setSelectedQuotas([...selectedQuotas, quotas.filter(quota => quota.id === event.target?.value)[0]]);
        }else{
            setSelectedQuotasId(selectedQuotasId.filter((quotaId) => quotaId !== parseInt(event.target?.value)));
            setSelectedQuotas(selectedQuotas.filter((quota) => quota.id !== event.target?.value));
        }
    }
  
    const handleSelectRealty = (event: ChangeEvent<HTMLInputElement>) => {
        const realtyQuotas = quotas.filter((quota:Quota) => quota.categoria === "Imóvel");
        const realtyQuotasId = realtyQuotas.map((quota: Quota) => parseInt(quota.id));
  
        if(event.target?.checked){
            setSelectedQuotasId([...selectedQuotasId, ...realtyQuotasId]);
            setSelectedQuotas([...selectedQuotas, ...realtyQuotas]);
        }else{
            const selectedQuotasWithoutRealty = selectedQuotasId.map((quotaId) => {
                if(!realtyQuotasId.includes(quotaId)){ return quotaId;}
  
                return 0;
            })
  
            setSelectedQuotasId(selectedQuotasWithoutRealty);
            setSelectedQuotas(selectedQuotas.filter((quota:Quota) => quota.categoria !== "Imóvel"));
        }
    }
  
    const handleSelectVehicle = (event: ChangeEvent<HTMLInputElement>) => {
        const vehicleQuotas = quotas.filter((quota:Quota) => quota.categoria === "Veículo");
        const vehicleQuotasId = vehicleQuotas.map((quota: Quota) => parseInt(quota.id));
  
        if(event.target?.checked){
            setSelectedQuotasId([...selectedQuotasId, ...vehicleQuotasId]);
            setSelectedQuotas([...selectedQuotas, ...vehicleQuotas]);
        }else{
            const selectedQuotasWithoutVehicle = selectedQuotasId.map((quotaId) => {
                if(!vehicleQuotasId.includes(quotaId)){ return quotaId;}
  
                return 0;
            })
  
            setSelectedQuotasId(selectedQuotasWithoutVehicle);
            setSelectedQuotas(selectedQuotas.filter((quota:Quota) => quota.categoria !== "Veículo"));
  
        }
    }
  
    const handleSelectAll = (event: ChangeEvent<HTMLInputElement>) => {
        if(event.target?.checked){
            const newSelectedQuotasId = quotas.map((quota: Quota) => parseInt(quota.id));
            setSelectedQuotasId(newSelectedQuotasId);
            setSelectedQuotas(quotas);
        }else{
            setSelectedQuotasId([0]);
            setSelectedQuotas([]);
        }
    }
  
    const isSelectedQuotas = () => {
        return selectedQuotas.length > 0;
    }
  
    const [isSumOpen, setIsSumOpen] = useState(false);

    const saveSum = () => {
        const sumResult = GetSumResult(selectedQuotas);

        if(profile){
            serverApi.post("/sums", {
                ...sumResult,
                installment: sumResult.parcel,
                user_id: profile.id,
                insurance: sumResult.security,
                quotas: selectedQuotas.map((quota) => {
                    // const formedQuota = {

                    // }

                    return {
                        adm: quota.administradora,
                        cod: quota.id,
                        credit: parseFloat(quota.valor_credito.replaceAll(".", "").replaceAll(",", ".")),
                        deadline: parseFloat(quota.parcelas),
                        debt: parseFloat(quota.parcelas.replaceAll(".", "").replaceAll(",", ".")) * parseFloat(quota.valor_parcela.replaceAll(".", "").replaceAll(",", ".")),
                        installment: parseFloat(quota.valor_parcela.replaceAll(".", "").replaceAll(",", ".")),
                        tax: parseFloat(quota.taxa.replaceAll(".", "").replaceAll(",", ".")),
                        insurance: parseFloat(quota.valor_parcela.replaceAll(".", "").replaceAll(",", "."))*parseInt(quota.parcelas) * (quota.categoria == "Veículo" ? 0.00088 : 0.00055),
                        fund: parseFloat(quota.fundo.replaceAll(".", "").replaceAll(",", ".")),
                        entry: parseFloat(quota.entrada.replaceAll(".", "").replaceAll(",", ".")),
                        segment: quota.categoria
                    }
                })
            });
        }
    }
  
    const handleOpenSumModal = () => {
        if(isSelectedQuotas()){
            setIsSumOpen(true);

            saveSum();
  
            return;
        }
  
        toast({
            //title: 'Nenhuma carta foi selecionada.',
            description: "Nenhuma carta foi selecionada.",
            status: 'warning',
            variant: 'left-accent',
            duration: 9000,
            isClosable: true,
        })
    }
  
    const handleCloseSumModal = () => {
        setIsSumOpen(false);
    }
  
    const handleContact = (quota: Quota) => {
        window.open(`https://api.whatsapp.com/send?phone=55${phoneWithoutFormat}&text=${window.encodeURIComponent(`Olá! Tenho interesse na carta de crédito N°${quota.id} para ${quota.categoria} de R$ ${quota.valor_credito}`)}`);
    }
  
    const handleSend = () => {
        if(isSelectedQuotas()){
            const cardsText = selectedQuotas.reduce((accumulator:string, quota:Quota) => {
                return `${accumulator}\nCarta ${quota.id} - ${quota.categoria}: R$ ${quota.valor_credito} (${quota.parcelas}x R$${quota.valor_parcela})`
            }, '');
    
            window.open(`https://api.whatsapp.com/send?phone=55${phoneWithoutFormat}&text=${window.encodeURIComponent(cardsText)}`);
  
            return;
        }
  
        toast({
            //title: 'Nenhuma carta foi selecionada.',
            description: "Nenhuma carta foi selecionada.",
            status: 'warning',
            variant: 'left-accent',
            duration: 9000,
            isClosable: true,
        })
    }
  
    const toPrintRef = useRef(null);
  
    const filterForm = useForm<ContemplatedsFilter>({
        resolver: yupResolver(FilterFormSchema),
        defaultValues:{
            credit: 0,
            value: 0,
            deadline: 0,
            segment: '',
            reserved: '',
            adm: '',
        }
    });

    const handleFilter = (filterData: ContemplatedsFilter) => {
        //console.log(filterData);
        let filteredQuotas = quotas;

        if(filterData.credit && filterData.credit !== undefined){
            filteredQuotas = filteredQuotas.filter(quota => {
                const parsedCredit = parseFloat(quota.valor_credito.replaceAll(".", "").replaceAll(",", "."));
                console.log(parsedCredit, filterData.credit * 1.05);
                //console.log(quota.valor_credito, filterData.credit);
                return  parsedCredit < filterData.credit * 1.10 && parsedCredit > filterData.credit * 0.90
            })
        }

        if(filterData.value && filterData.value !== undefined){
            filteredQuotas = filteredQuotas.filter(quota => {
                const parsedValue = parseFloat(quota.entrada.replaceAll(".", "").replaceAll(",", "."));

                return  parsedValue < filterData.value * 1.10 && parsedValue > filterData.value * 0.90
            })
        }

        if(filterData.deadline){
            filteredQuotas = filteredQuotas.filter(quota => {
                return parseFloat(quota.parcelas) === filterData.deadline
            })
        }

        if(filterData.segment){
            filteredQuotas = filteredQuotas.filter(quota => {
                return quota.categoria === filterData.segment
            })
        }

        if(filterData.adm){
            filteredQuotas = filteredQuotas.filter(quota => {
                return quota.administradora === filterData.adm
            })
        }

        if(filterData.reserved){
            filteredQuotas = filteredQuotas.filter(quota => {
                return quota.reserva === filterData.reserved
            })
        }

        setShowingQuotas(filteredQuotas);
    }

    const [showingFilter, setShowingFilter] = useState(false);

    useEffect(() => {
        if(profile){
            serverApi.post('/accesses', {user_id: profile.id})
        }
    }, [profile])

    return profile ? (
        // <ChakraProvider theme={theme}>
                    <Box bg="gray.100">
                        <Menu/>
                                <Box position="relative">

                                    <Sum isOpen={isSumOpen} handleCloseSumModal={handleCloseSumModal} selectedQuotas={selectedQuotas}/>

                                    <Flex flexDir="column" w="100%">
                                        <Stack flexDir="column" w="100%" maxW="1200px" m="0 auto" py="12" spacing="20" justifyContent="space-between">
                                            <Stack spacing="2" px={["6", "2"]}>
                                                <Stack flexDirection={['column', 'row']} spacing="4" justifyContent="space-between" alignItems="center">
                                                    <Heading fontSize={["4xl","6xl"]}>Cartas Contempladas</Heading>
                                                    {/* <Flex bg="" w="200px" h="200px" alignItems="center" justifyContent="center" overflow="hidden">
                                                        {
                                                            profile.logo && <Img maxW="100%" src={`${storageApi}${profile.logo}`} alt={`${profile.name_display ? profile.name_display : profile.name} - Créditos para conquistar seus sonhos`} flexWrap="wrap"/>
                                                        }
                                                    </Flex> */}
                                                    {/* <Text fontSize="2xl">{broker.name_display ? broker.name_display : broker.name}</Text> */}
                                                </Stack>

                                                <Box w="100px" h="2px" bg="first" />

                                                <Text>Encontre e some as melhores ofertas para você!</Text>
                                            </Stack>

                                            <Stack spacing="4" px={["6", "2"]}>
                                                <HStack justifyContent="space-between">
                                                    <TextTag>Filtre sua busca</TextTag>

                                                    {
                                                        !isWideVersion && (
                                                            <IconButton aria-label="" icon={<Icon as={Search} w="19px" h="19px" stroke={showingFilter ? "#000" : "#888"} fill="none"/>} _hover={{borderColor: "#000"}} border="1px solid" borderColor={showingFilter ? "#000" : "#ededed"} onClick={() => setShowingFilter(!showingFilter)}/>
                                                        )
                                                    }
                                                </HStack>

                                                {
                                                    (isWideVersion || (showingFilter && !isWideVersion)) && (
                                                        <Stack direction={["column", "column", "row"]} as="form" onSubmit={filterForm.handleSubmit(handleFilter)}>
                                                            <ControlledInput control={filterForm.control} error={filterForm.formState.errors.credit} name="credit" label="Crédito" type="text"/>
                                                            <ControlledInput control={filterForm.control} error={filterForm.formState.errors.value} name="value" label="Entrada" type="text"/>
                                                            <ControlledInput  control={filterForm.control} error={filterForm.formState.errors.deadline} name="deadline" label="Prazo" type="text"/>
                                                            <ControlledInput control={filterForm.control} error={filterForm.formState.errors.adm} name="adm" label="Administradora" type="text"/>

                                                            <ControlledSelect control={filterForm.control} error={filterForm.formState.errors.segment} h="50px" name="segment" w="100%" fontSize="sm" placeholder="Segmento" focusBorderColor="black" bg="gray.400" variant="filled" _hover={ {bgColor: 'gray.500'} } size="lg">
                                                                <option value="Imóvel">Imóvel</option>
                                                                <option value="Veículo">Veículo</option>
                                                            </ControlledSelect>

                                                            <ControlledSelect control={filterForm.control} error={filterForm.formState.errors.reserved} h="50px" name="reserved" w="100%" fontSize="sm" placeholder="Todas as cartas" focusBorderColor="black" bg="gray.400" variant="filled" _hover={ {bgColor: 'gray.500'} } size="lg">
                                                                <option value="Disponível">Disponíveis</option>
                                                                <option value="Reservado">Reservadas</option>
                                                            </ControlledSelect>

                                                            <OutlineButton w={isWideVersion ? "auto" : "100%"} isLoading={filterForm.formState.isSubmitting} type="submit" h="50px" _hover={{borderColor: '#000'}}>
                                                                Filtrar
                                                            </OutlineButton>

                                                            {/* <ControlledInput control={filterForm.control} error={filterForm.formState.errors.segment} name="segment" label="Segmento" type="text"/> */}
                                                        </Stack>
                                                    )
                                                }

                                            </Stack>

            { fontSize && (
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
                                                            <Th p="2px" fontSize={fontSize}>{isWideVersion && "Status"}</Th>
                                                        </Tr>
                                                    </Thead>
                                                    <Tbody fontSize={fontSize}>
                                                        {
                                                            showingQuotas && showingQuotas.map((quota:Quota) =>{
                                                                return (
                                                                    <Tr key={quota.id} minH="40px" h={["52px"]} py="5">
                                                                        <Td p="2px" {...border}>
                                                                            <HStack>
                                                                                <Checkbox variant={"outline"} colorScheme="red" isChecked={selectedQuotasId.includes(parseInt(quota.id))} value={quota.id} onChange={handleSelect}/>
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
                                                                        <Td p="2px" {...border} color={quota.reserva === "Disponível" ? "green.400" : "red.400"}>
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

                                                        {/* <CSVLink data={quotas}>
                                                            <OutlineButton px="4" size="sm" borderColor="gray.300" _hover={{borderColor: 'first'}}>
                                                                Salvar
                                                            </OutlineButton>
                                                        </CSVLink> */}
                                                    </HStack>
                                                </Box>
                                            </Stack>
            )}
                                        </Stack>
                                    </Flex>

                                    <SumLog/>

                                    <Box position="fixed" right="20px" bottom="20px" zIndex="2" boxShadow="lg">
                                        <SolidButton onClick={() => handleOpenSumModal()} bg='red.600' color="white" fontSize="md" size="lg">
                                            Somar
                                        </SolidButton>
                                    </Box>
                                </Box>
                    </Box>
                // </ChakraProvider>
                ) : (
                    <Flex flexDirection="column" w="100vw" h="100vh" bg="gray.200" alignItems="center" justifyContent="center">
                        <Spinner/>
                    </Flex>
                )
}

export default function AdminPage({quotas, broker}: ContempladasProps){
    return(
        <ProfileProvider>
            <AdminPageContent quotas={quotas} broker={broker}/>
        </ProfileProvider>
    )
}


export const getServerSideProps: GetServerSideProps = async ({req, params }) => {
        const response = await axios.get('https://contempladas.lanceconsorcio.com.br')

        const quotas = response.data;

        const vehicleQuotas = quotas.filter((quota:Quota) => quota.categoria == "Veículo")
        vehicleQuotas.sort(function (a:Quota, b:Quota) {
            if(parseFloat(a.valor_credito.replaceAll(".", "").replaceAll(",", ".")) > parseFloat(b.valor_credito.replaceAll(".", "").replaceAll(",", "."))){
                return 1;
            }

            if(parseFloat(a.valor_credito.replaceAll(".", "").replaceAll(",", ".")) < parseFloat(b.valor_credito.replaceAll(".", "").replaceAll(",", "."))){
                return -1;
            }

            return 0;
        });

        const realtyQuotas = quotas.filter((quota:Quota) => quota.categoria == "Imóvel")
        realtyQuotas.sort(function (a:Quota, b:Quota) {
            if(parseFloat(a.valor_credito.replaceAll(".", "").replaceAll(",", ".")) > parseFloat(b.valor_credito.replaceAll(".", "").replaceAll(",", "."))){
                return 1;
            }

            if(parseFloat(a.valor_credito.replaceAll(".", "").replaceAll(",", ".")) < parseFloat(b.valor_credito.replaceAll(".", "").replaceAll(",", "."))){
                return -1;
            }

            return 0;
        });
        
        return {
            props: {
                quotas: [...vehicleQuotas, ...realtyQuotas],
                //broker: broker
            }
        }
}