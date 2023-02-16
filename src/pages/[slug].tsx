import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import axios from 'axios'
import { Box, ChakraProvider, Divider, Checkbox, extendTheme, Flex, Heading, HStack, IconButton, Stack, Table, Tbody, Td, Text, Th, Thead, Tr, useBreakpointValue, useToast, Img } from '@chakra-ui/react'
import { Header } from '../components/Header'
import { OutlineButton } from '../components/Buttons/OutlineButton'
import { Footer } from '../components/Footer'
import { SolidButton } from '../components/Buttons/SolidButton'
import ReactToPrint from 'react-to-print'
import { ChangeEvent, useEffect, useRef, useState } from 'react'
import Sum from '../components/Sum'
import { Check, X } from 'react-feather'
import { CSVLink, } from "react-csv";

import Whatsapp from '../../public/icons/whatsapp.svg';
import NotFound from '../components/NotFound'
import { serverApi, storageApi } from '../services/api'

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
}

interface ContempladasProps{
  quotas: Quota[];
  broker?: Broker;
}

interface SelectQuota{
  id: number;
  selected: boolean;
}

export default function Home({quotas, broker}: ContempladasProps){

  const toast = useToast();
  const fontSize = useBreakpointValue({base: '9px', md: 'sm', lg: 'sm',});
  const buttonFontSize = useBreakpointValue({base: 'sm', md: 'sm', lg: '',});
  const isWideVersion = useBreakpointValue({base: false, lg: true});

  const border = {borderBottom: "1px solid", borderColor:"gray.300"}

  const phoneWithoutFormat = broker ? broker.phone.replace(/[\(\)\s\-]/g, '') : '';

  const [selectedQuotasId, setSelectedQuotasId] = useState<number[]>([]);
  const [selectedQuotas, setSelectedQuotas] = useState<Quota[]>([]);

  const handleSelect = (event: ChangeEvent<HTMLInputElement>) => {
      console.log(event.target?.value, event.target?.checked);
      if(event.target?.checked){
          setSelectedQuotasId([...selectedQuotasId, parseInt(event.target?.value)]);
          console.log(quotas.filter(quota => quota.id === event.target?.value)[0]);
          setSelectedQuotas([...selectedQuotas, quotas.filter(quota => quota.id === event.target?.value)[0]]);
      }else{
          setSelectedQuotasId(selectedQuotasId.filter((quotaId) => quotaId !== parseInt(event.target?.value)));
          console.log(selectedQuotas.filter((quota) => quota.id !== event.target?.value));
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

  const handleOpenSumModal = () => {
      if(isSelectedQuotas()){
          setIsSumOpen(true);

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

    const theme = extendTheme({
        colors: {
            firstScheme: {
                "100": broker ? broker.color : "",
                "200": broker ? broker.color : "",
                "300": broker ? broker.color : "",
                "400": broker ? broker.color : "",
                "500": broker ? broker.color : "",
                "700": broker ? broker.color : "",
                "900": broker ? broker.color : "",
            },
            first: broker ? broker.color : "",
            second: broker ? broker.second_color : ""
        },
        shadows: {
            outline: broker ? `0 0 0 3px ${broker.color}` : "",
        },
        fonts: {
            heading: 'Raleway',
            body: 'Poppins'
        },
        styles: {
            global: {
                body: {
                    bg: 'gray.100',
                    color: 'gray.900'
                }
            }
        },
    })

    console.log(fontSize);

  return broker ? (
            <div>
                <Head>
                    <title>{broker.name_display ? broker.name_display : broker.name}</title>
                    <meta name="description" content={`Estoque de cartas contempladas ${broker.name}`} />
                    <link rel="icon" href="/favicon.ico" />

                    <link rel="logo" type="image/png" href={`${storageApi}${broker.logo}`}></link>
                    <meta property="og:image" content={`${storageApi}${broker.logo}`}></meta>
                </Head>

                <ChakraProvider theme={theme}>
                    <Box position="relative">
                        <Header broker={broker}/>

                        <Sum broker={broker} isOpen={isSumOpen} handleCloseSumModal={handleCloseSumModal} selectedQuotas={selectedQuotas}/>

                        <Flex flexDir="column" w="100%">
                            <Stack flexDir="column" w="100%" maxW="1200px" m="0 auto" py="28" spacing="20" justifyContent="space-between">
                                <Stack spacing="5" px={["6", "2"]}>
                                    <Stack flexDirection={['column', 'row']} spacing="4" justifyContent="space-between" alignItems="center">
                                        <Heading fontSize={["4xl","6xl"]}>Cartas Contempladas</Heading>
                                        <Flex bg="" w="200px" h="200px" alignItems="center" justifyContent="center" overflow="hidden">
                                            {
                                                broker.logo && <Img maxW="100%" src={`${storageApi}${broker.logo}`} alt={`${broker.name_display ? broker.name_display : broker.name} - Créditos para conquistar seus sonhos`} flexWrap="wrap"/>
                                            }
                                        </Flex>
                                        {/* <Text fontSize="2xl">{broker.name_display ? broker.name_display : broker.name}</Text> */}
                                    </Stack>

                                    <Box w="100px" h="2px" bg="first" />

                                    <Text>Encontre e some as melhores ofertas para você!</Text>
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

                                            <CSVLink data={quotas}>
                                                <OutlineButton px="4" size="sm" borderColor="gray.300" _hover={{borderColor: 'first'}}>
                                                    Salvar
                                                </OutlineButton>
                                            </CSVLink>
                                        </HStack>
                                    </Box>
                                </Stack>
)}
                            </Stack>
                        </Flex>

                        <Box position="fixed" right="20px" bottom="20px" zIndex="2" boxShadow="lg">
                            {/* <Text>Simule um plano</Text> */}

                            <SolidButton onClick={() => handleOpenSumModal()} bgGradient='linear(to-r, first, first)' color="white" fontSize="md" size="lg">
                                Somar
                            </SolidButton>
                        </Box>

                        <Footer broker={broker}/>
                    </Box>
                </ChakraProvider>
            </div>

        ) : <NotFound />
}

export const getServerSideProps: GetServerSideProps = async ({req, params }) => {
    let broker = null;

    if(params){
        const { slug } = params;

        try{
            const responseBroker = await serverApi.get(`brokers/${slug}`);

            if(responseBroker.data.error){
            throw Error;
            }

            broker = responseBroker.data;
        }catch(error: any){
            console.log("Erro ao buscar parceiro.");
        }
    }

    const response = await axios.get('https://contempladas.lanceconsorcio.com.br');

    const quotas = response.data;

    const vehicleQuotas = quotas.filter((quota:Quota) => quota.categoria === "Veículo")
    vehicleQuotas.sort(function (a:Quota, b:Quota) {
        if(parseFloat(a.valor_credito.replace(".", "").replace(",", ".")) > parseFloat(b.valor_credito.replace(".", "").replace(",", "."))){
            return 1;
        }

        if(parseFloat(a.valor_credito.replace(".", "").replace(",", ".")) < parseFloat(b.valor_credito.replace(".", "").replace(",", "."))){
            return -1;
        }

        return 0;
    });

    const realtyQuotas = quotas.filter((quota:Quota) => quota.categoria === "Imóvel")
    realtyQuotas.sort(function (a:Quota, b:Quota) {
        if(parseFloat(a.valor_credito.replace(".", "").replace(",", ".")) > parseFloat(b.valor_credito.replace(".", "").replace(",", "."))){
            return 1;
        }

        if(parseFloat(a.valor_credito.replace(".", "").replace(",", ".")) < parseFloat(b.valor_credito.replace(".", "").replace(",", "."))){
            return -1;
        }

        return 0;
    });
    return {
        props: {
            quotas: [...vehicleQuotas, ...realtyQuotas],
            broker: broker
        }
    }
}