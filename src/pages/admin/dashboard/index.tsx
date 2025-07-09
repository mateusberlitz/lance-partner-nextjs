import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Box,
  Divider,
  Flex,
  Heading,
  HStack,
  Link,
  Spinner,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import { ProfileProvider, useProfile } from "../../../contexts/useProfile";

import * as yup from "yup";
import { useCallback, useEffect, useState } from "react";
import { serverApi } from "../../../services/api";
import { Menu } from "../../../components/Menu";
import axios from "axios";

import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ptBR } from "date-fns/locale";
import { formatYmdDate } from "../../../utils/Date/formatYmdDate";
import { Partner, QuotaSale, ReadyQuotaPurchases } from "../../../types";
import { Check, Home, Info, Minus, Plus, X } from "react-feather";
import { SolidButton } from "../../../components/Buttons/SolidButton";
import { RemoveButton } from "../../../components/Buttons/RemoveButton";
import { formatBRDate } from "../../../utils/Date/formatBRDate";

registerLocale("ptBR", ptBR);

interface ProfileFormData {
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

export interface Broker {
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

export interface Quota {
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

interface ContempladasProps {
  quotas: Quota[];
  broker?: Broker;
}

interface SelectQuota {
  id: number;
  selected: boolean;
}

interface ContemplatedsFilter {
  credit: number;
  value: number;
  deadline?: number;
  segment?: string;
  reserved?: string;
  adm?: string;
}

interface User {
  slug: string;
  name: string;
  name_display: string;
  email: string;
  email_display: string;
  phone: string;
  cnpj: string;
  address: string;
  color: string;
  second_color: string;
  master: boolean;
  sums_count: number;
}

function getAvailableProcesses(partner: Partner): number {
  // Certifica-se que os valores existem e são numéricos
  const soldQuotas = Number(partner.purchases?.length) || 0;
  const boughtQuotas = Number(partner.bought_quotas_count) || 0;
  const currentProcesses = Number(partner.processes) || 0;

  // Total de pontos
  const totalPoints = soldQuotas + boughtQuotas;

  // Cálculo de processos a que tem direito (1 processo a cada 10 pontos)
  const totalProcessesEntitled = Math.floor(totalPoints / 10);

  // Processos disponíveis = total a que tem direito menos os já utilizados
  const availableProcesses = Math.max(
    0,
    totalProcessesEntitled - currentProcesses
  );

  return availableProcesses;
}

const FilterFormSchema = yup.object().shape({
  credit: yup
    .number()
    .nullable(true)
    .transform((v) => (v === "" || Number.isNaN(v) ? null : v)),
  value: yup
    .number()
    .nullable(true)
    .transform((v) => (v === "" || Number.isNaN(v) ? null : v)),
  deadline: yup
    .number()
    .nullable(true)
    .transform((v) => (v === "" || Number.isNaN(v) ? null : v)),
  segment: yup.string().nullable(),
  reserved: yup.string().nullable(),
  adm: yup.string().nullable(),
});

function AdminPageContent({ quotas, broker }: ContempladasProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState<Boolean>(true);
  const [loadingPartner, setLoadingPartner] = useState<Boolean>(true);
  const [accessesCount, setAccessesCount] = useState<number>();
  const [loadingAccesses, setLoadingAccesses] = useState<Boolean>(true);
  const [profileAsPartner, setProfileAsPartner] = useState<Partner>();

  const { profile } = useProfile();

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const handleDateChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  const fetchUsers = (startDate?: string, endDate?: string) => {
    serverApi
      .get("users", { params: { start_date: startDate, end_date: endDate } })
      .then((response) => {
        setUsers(response.data);
        setLoadingUsers(false);
      });
  };

  const fetchAccesses = () => {
    serverApi.get("accessCount").then((response) => {
      setAccessesCount(response.data.count);
      setLoadingAccesses(false);
    });
  };

  // const loadProfilePartnerData = () =>{
  //     if(profile){
  //         serverApi.get(`proxy/partners/${profile.slug}`).then((response) => {
  //             setLoadingPartner(false);
  //             setProfileAsPartner(response.data);
  //         })
  //     }
  // }

  const loadProfilePartnerData = useCallback(() => {
    if (profile) {
      serverApi.get(`proxy/partners/${profile.slug}`).then((response) => {
        setLoadingPartner(false);
        setProfileAsPartner(response.data);
      });
    }
  }, [profile]);

  useEffect(() => {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    setStartDate(firstDayOfMonth);
    setEndDate(now);

    fetchUsers(firstDayOfMonth.toISOString(), now.toISOString());
    fetchAccesses();
  }, []);

  useEffect(() => {
    fetchUsers(
      startDate ? formatYmdDate(startDate.toISOString()) : undefined,
      endDate ? formatYmdDate(endDate.toISOString()) : undefined
    );
  }, [startDate, endDate]);

  useEffect(() => {
    console.log("chamou pela funçvao");
    loadProfilePartnerData();
  }, [profile, loadProfilePartnerData]);

  console.log(profile);

  return profile ? (
    // <ChakraProvider theme={theme}>
    <Box bg="gray.100">
      <Menu />
      <Box position="relative">
        <Flex flexDir="column" w="100%">
          <Stack
            flexDir="column"
            w="100%"
            maxW="1200px"
            m="0 auto"
            py="6"
            spacing="20"
            justifyContent="space-between"
          >
            <Stack
              flexDirection={["column", "row"]}
              justifyContent={"space-between"}
              spacing="6"
            >
              <Stack spacing="2" px={["6", "2"]}>
                <Stack
                  flexDirection={["column", "row"]}
                  spacing="4"
                  justifyContent="space-between"
                  alignItems="left"
                >
                  <Heading fontSize={["4xl", "6xl"]}>Dashboard</Heading>
                  {/* <Flex bg="" w="200px" h="200px" alignItems="center" justifyContent="center" overflow="hidden">
                                                            {
                                                                profile.logo && <Img maxW="100%" src={`${storageApi}${profile.logo}`} alt={`${profile.name_display ? profile.name_display : profile.name} - Créditos para conquistar seus sonhos`} flexWrap="wrap"/>
                                                            }
                                                        </Flex> */}
                  {/* <Text fontSize="2xl">{broker.name_display ? broker.name_display : broker.name}</Text> */}
                </Stack>

                <Box w="100px" h="2px" bg="first" />

                <Text>
                  Relatório de todas interações e negociações com a Lance
                  Consórcio
                </Text>
              </Stack>

              <Stack p="6">
                <DatePicker
                  selected={startDate}
                  onChange={handleDateChange}
                  startDate={startDate}
                  endDate={endDate}
                  selectsRange
                  locale="ptBR"
                  inline
                />
              </Stack>
            </Stack>

            {loadingPartner && <Spinner />}

            {profileAsPartner && (
              <>
                <Stack
                  direction={["column", "column", "row", "row"]}
                  spacing="8"
                  width="100%"
                >
                  <Stack
                    spacing="5"
                    w="100%"
                    minWidth="300px"
                    justify="space-between"
                    alignItems="left"
                    bg="white"
                    borderRadius="16px"
                    shadow="xl"
                    px="8"
                    py="8"
                  >
                    <Text fontSize="xl" w="100%">
                      Cotas fornecidas:
                    </Text>

                    <Text
                      fontSize="2xl"
                      w="100%"
                      fontWeight="bold"
                      color={
                        profileAsPartner.sold_quotas_total > 0
                          ? "blue.400"
                          : "red.400"
                      }
                    >
                      {Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(profileAsPartner.sold_quotas_total)}
                    </Text>
                    <Text fontSize="xl" w="100%">
                      Cotas fornecidas:{" "}
                      <b>{profileAsPartner.sold_quotas_count}</b>
                    </Text>
                    {/* <Text fontSize="xl" w="100%">
                      Cotas fornecidas:{" "}
                      <b>{profileAsPartner.sold_quotas?.}</b>
                    </Text> */}
                  </Stack>

                  <Stack
                    spacing="5"
                    w="100%"
                    minWidth="300px"
                    justify="space-between"
                    alignItems="left"
                    bg="white"
                    borderRadius="16px"
                    shadow="xl"
                    px="8"
                    py="8"
                  >
                    <Text fontSize="xl" w="100%">
                      Compras
                    </Text>

                    <Text
                      fontSize="2xl"
                      w="100%"
                      fontWeight="bold"
                      color={
                        profileAsPartner.bought_quotas_total > 0
                          ? "green.400"
                          : "red.400"
                      }
                    >
                      {Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(profileAsPartner.bought_quotas_total)}
                    </Text>
                    <Text fontSize="xl" w="100%">
                      Processos adquiridos:{" "}
                      <b>{profileAsPartner.bought_quotas_count}</b>
                    </Text>
                    {/* <Text fontSize="md" w="100%">
                      Cotas compradas:{" "}
                      <b>{profileAsPartner.bought_quotas_count}</b>
                    </Text> */}
                  </Stack>

                  <Stack
                    spacing="5"
                    w="100%"
                    minWidth="300px"
                    justify="space-between"
                    alignItems="left"
                    bg="white"
                    borderRadius="16px"
                    shadow="xl"
                    px="8"
                    py="8"
                  >
                    <HStack>
                      <Text fontSize="xl" w="100%">
                        Processos
                      </Text>
                      <HStack opacity={0.6}>
                        <Tooltip label="A cada 10 vendas ou compras você ganha 1 crédito para efetuar o processo com o time interno da Lance Consórcio.">
                          <Info />
                        </Tooltip>
                      </HStack>
                    </HStack>

                    <Text fontSize="md" w="100%" opacity={0.6}>
                      em andamento: <b>{profileAsPartner.processes}</b>
                    </Text>
                    <Text
                      fontSize="2xl"
                      w="100%"
                      fontWeight="bold"
                      color={
                        profileAsPartner.finished_processes > 0
                          ? "green.400"
                          : "red.400"
                      }
                    >
                      {profileAsPartner.finished_processes} finalizados
                    </Text>
                    <Text fontSize="xl" w="100%">
                      Crédito disponíveis:{" "}
                      <b>{getAvailableProcesses(profileAsPartner)}</b>
                    </Text>
                  </Stack>
                </Stack>

                <Tabs colorScheme="black">
                  <TabList>
                    <Tab>Compras</Tab>
                    <Tab>Fornecidas</Tab>
                  </TabList>

                  <TabPanels>
                    <TabPanel>
                      <Accordion
                        w="100%"
                        border="2px"
                        borderColor="gray.500"
                        borderRadius="26"
                        overflow="hidden"
                        allowMultiple
                      >
                        <HStack
                          spacing="8"
                          justify="space-between"
                          paddingX="8"
                          paddingY="3"
                          bg="gray.200"
                        >
                          <Text fontWeight="extrabold">
                            {profileAsPartner.bought_quotas_count} Compras
                          </Text>

                          {/* <Text float="right">TOTAL faturado: <strong>{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(monthTotalValue)}</strong></Text> */}
                          <Text float="right">
                            TOTAL em crédito:{" "}
                            <strong>
                              {Intl.NumberFormat("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                              }).format(profileAsPartner.bought_quotas_total)}
                            </strong>
                          </Text>
                        </HStack>

                        {profileAsPartner.bought_quotas &&
                          profileAsPartner.bought_quotas.map(
                            (quotaSale: QuotaSale) => {
                              const creditAmount =
                                (quotaSale.ready_quota
                                  ? quotaSale.ready_quota.credit
                                  : 0) +
                                (quotaSale.sale_ready_quotas.length > 0
                                  ? quotaSale.sale_ready_quotas.reduce(
                                      (sumAmount, saleReadyQuota) => {
                                        return (
                                          sumAmount +
                                          saleReadyQuota.ready_quota.credit
                                        );
                                      },
                                      0
                                    )
                                  : 0);
                              const totalCost =
                                (quotaSale.ready_quota &&
                                quotaSale.ready_quota.total_cost
                                  ? quotaSale.ready_quota.total_cost
                                  : 0) +
                                (quotaSale.sale_ready_quotas.length > 0
                                  ? quotaSale.sale_ready_quotas.reduce(
                                      (sumAmount, saleReadyQuota) => {
                                        return (
                                          sumAmount +
                                          (saleReadyQuota.ready_quota.total_cost
                                            ? saleReadyQuota.ready_quota
                                                .total_cost
                                            : 0)
                                        );
                                      },
                                      0
                                    )
                                  : 0);

                              return (
                                <AccordionItem
                                  key={quotaSale.id}
                                  display="flex"
                                  flexDir="column"
                                  paddingX="8"
                                  paddingTop="3"
                                  bg="white"
                                  borderTop="2px"
                                  borderTopColor="gray.500"
                                  borderBottom="0"
                                >
                                  {({ isExpanded }) => (
                                    <>
                                      <HStack
                                        justify="space-between"
                                        mb="3"
                                        opacity={quotaSale.cancelled ? 0.5 : 1}
                                      >
                                        <AccordionButton
                                          p="0"
                                          height="fit-content"
                                          w="auto"
                                        >
                                          <Flex
                                            alignItems="center"
                                            justifyContent="center"
                                            h="24px"
                                            w="30px"
                                            p="0"
                                            borderRadius="full"
                                            border="2px"
                                            borderColor="blue.800"
                                          >
                                            {!isExpanded ? (
                                              <Plus
                                                stroke="#2a4365"
                                                fill="none"
                                                width="12px"
                                              />
                                            ) : (
                                              <Minus
                                                stroke="#2a4365"
                                                fill="none"
                                                width="12px"
                                              />
                                            )}
                                          </Flex>
                                        </AccordionButton>

                                        <Stack spacing="0">
                                          <Text
                                            fontSize="10px"
                                            color="gray.800"
                                          >
                                            {quotaSale.sale_date
                                              ? formatBRDate(
                                                  quotaSale.sale_date
                                                )
                                              : "--"}
                                          </Text>
                                          <Text
                                            fontSize="sm"
                                            fontWeight="bold"
                                            color="gray.800"
                                          >
                                            {quotaSale.id}
                                          </Text>
                                        </Stack>

                                        <HStack spacing="4">
                                          <Home
                                            stroke="#4e4b66"
                                            fill="none"
                                            width="22px"
                                          />

                                          <Stack spacing="0">
                                            <Text
                                              fontSize="10px"
                                              color="gray.800"
                                            >
                                              Valor da compra
                                            </Text>
                                            <Text
                                              fontSize="sm"
                                              fontWeight="bold"
                                              color="gray.800"
                                            >
                                              {Intl.NumberFormat("pt-BR", {
                                                style: "currency",
                                                currency: "BRL",
                                              }).format(creditAmount)}
                                            </Text>
                                          </Stack>
                                        </HStack>

                                        <Stack spacing="0">
                                          <Text
                                            fontSize="10px"
                                            color="gray.800"
                                            fontWeight="bold"
                                          >
                                            Valor recebido
                                          </Text>
                                          <Text
                                            fontSize="sm"
                                            fontWeight="bold"
                                            color="gray.800"
                                          >
                                            {Intl.NumberFormat("pt-BR", {
                                              style: "currency",
                                              currency: "BRL",
                                            }).format(quotaSale.value)}{" "}
                                            (
                                            {(
                                              (quotaSale.value * 100) /
                                              creditAmount
                                            ).toFixed(0)}
                                            %)
                                          </Text>
                                        </Stack>

                                        {quotaSale.ready_quota && (
                                          <Stack spacing="0">
                                            <Text
                                              fontSize="12px"
                                              color="gray.800"
                                            >
                                              Grupo:{" "}
                                              <strong>
                                                {quotaSale.ready_quota.group}
                                              </strong>
                                            </Text>
                                            <Text
                                              fontSize="12px"
                                              color="gray.800"
                                            >
                                              Cota:{" "}
                                              <strong>
                                                {quotaSale.ready_quota.quota}
                                              </strong>
                                            </Text>
                                          </Stack>
                                        )}

                                        <Stack spacing="0">
                                          <Text
                                            fontSize="10px"
                                            color="gray.800"
                                            fontWeight="bold"
                                          >
                                            Cotas
                                          </Text>
                                          <HStack>
                                            {quotaSale.sale_ready_quotas
                                              .length > 0 &&
                                              quotaSale.sale_ready_quotas.map(
                                                (saleReadyQuota) => {
                                                  return (
                                                    <Text
                                                      key={`${saleReadyQuota.ready_quota.group}-${saleReadyQuota.ready_quota.quota}`}
                                                      fontSize="sm"
                                                      fontWeight="bold"
                                                      color="gray.800"
                                                    >
                                                      {
                                                        saleReadyQuota
                                                          .ready_quota.group
                                                      }
                                                      -
                                                      {
                                                        saleReadyQuota
                                                          .ready_quota.quota
                                                      }
                                                      ,
                                                    </Text>
                                                  );
                                                }
                                              )}
                                          </HStack>
                                        </Stack>

                                        <HStack spacing="5">
                                          {quotaSale.cancelled && (
                                            <HStack>
                                              <Flex
                                                fontWeight="bold"
                                                alignItems="center"
                                                color="red.400"
                                              >
                                                <X
                                                  stroke="#c30052"
                                                  fill="none"
                                                  width="16px"
                                                />
                                                <Text ml="2">Cancelada</Text>
                                              </Flex>
                                            </HStack>
                                          )}
                                        </HStack>
                                      </HStack>

                                      <AccordionPanel
                                        flexDir="column"
                                        borderTop="2px"
                                        borderColor="gray.500"
                                        px="0"
                                        py="5"
                                        opacity={quotaSale.cancelled ? 0.5 : 1}
                                      >
                                        <HStack
                                          justifyContent="space-between"
                                          marginBottom="4"
                                        >
                                          <Stack spacing="0">
                                            <Text
                                              fontSize="10px"
                                              color="gray.800"
                                            >
                                              Taxa
                                            </Text>
                                            <Text
                                              fontSize="sm"
                                              fontWeight="semibold"
                                              color="gray.800"
                                            >
                                              {Intl.NumberFormat("pt-BR", {
                                                style: "currency",
                                                currency: "BRL",
                                              }).format(
                                                quotaSale.tax
                                                  ? quotaSale.tax
                                                  : 0
                                              )}
                                            </Text>
                                          </Stack>
                                        </HStack>

                                        <Stack pb="6" pt="3">
                                          <HStack>
                                            <Text fontWeight="700" mr="2">
                                              Cotas compradas:{" "}
                                            </Text>
                                          </HStack>
                                          {quotaSale.sale_ready_quotas.map(
                                            (saleReadyQuota) => {
                                              return (
                                                <Stack
                                                  key={`venda-${saleReadyQuota.id}`}
                                                  spacing="2"
                                                  padding="3"
                                                  bg="gray.100"
                                                  borderRadius="16px"
                                                >
                                                  <HStack
                                                    justifyContent={
                                                      "space-between"
                                                    }
                                                    key={saleReadyQuota.id}
                                                  >
                                                    <Stack spacing="0">
                                                      <Text
                                                        fontSize="10px"
                                                        color="gray.800"
                                                      >
                                                        Cota
                                                      </Text>
                                                      <Text
                                                        fontSize="sm"
                                                        fontWeight="semibold"
                                                        color="gray.800"
                                                      >
                                                        {
                                                          saleReadyQuota
                                                            .ready_quota.group
                                                        }{" "}
                                                        -{" "}
                                                        {
                                                          saleReadyQuota
                                                            .ready_quota.quota
                                                        }
                                                      </Text>
                                                    </Stack>

                                                    <Stack spacing="0">
                                                      <Text
                                                        fontSize="10px"
                                                        color="gray.800"
                                                      >
                                                        Valor
                                                      </Text>
                                                      <Text
                                                        fontSize="sm"
                                                        fontWeight="semibold"
                                                        color="gray.800"
                                                      >
                                                        {Intl.NumberFormat(
                                                          "pt-BR",
                                                          {
                                                            style: "currency",
                                                            currency: "BRL",
                                                          }
                                                        ).format(
                                                          saleReadyQuota.value
                                                        )}
                                                      </Text>
                                                    </Stack>

                                                    <Stack spacing="0">
                                                      <Text
                                                        fontSize="10px"
                                                        color="gray.800"
                                                      >
                                                        Crédito
                                                      </Text>
                                                      <Text
                                                        fontSize="sm"
                                                        fontWeight="semibold"
                                                        color="gray.800"
                                                      >
                                                        {Intl.NumberFormat(
                                                          "pt-BR",
                                                          {
                                                            style: "currency",
                                                            currency: "BRL",
                                                          }
                                                        ).format(
                                                          saleReadyQuota
                                                            .ready_quota.credit
                                                            ? saleReadyQuota
                                                                .ready_quota
                                                                .credit
                                                            : 0
                                                        )}
                                                      </Text>
                                                    </Stack>

                                                    <Stack spacing="0">
                                                      <Text
                                                        fontSize="12px"
                                                        color="gray.800"
                                                      >
                                                        {saleReadyQuota
                                                          .ready_quota.deadline
                                                          ? `${saleReadyQuota.ready_quota.deadline}x`
                                                          : "--"}
                                                      </Text>
                                                      <Text
                                                        fontSize="sm"
                                                        fontWeight="normal"
                                                        color="gray.800"
                                                      >
                                                        {saleReadyQuota
                                                          .ready_quota.parcel
                                                          ? Intl.NumberFormat(
                                                              "pt-BR",
                                                              {
                                                                style:
                                                                  "currency",
                                                                currency: "BRL",
                                                              }
                                                            ).format(
                                                              saleReadyQuota
                                                                .ready_quota
                                                                .parcel
                                                            )
                                                          : ""}
                                                      </Text>
                                                    </Stack>
                                                  </HStack>
                                                </Stack>
                                              );
                                            }
                                          )}
                                        </Stack>

                                        <Divider mb="3" />
                                      </AccordionPanel>
                                    </>
                                  )}
                                </AccordionItem>
                              );
                            }
                          )}
                      </Accordion>
                    </TabPanel>
                    <TabPanel>
                      <Accordion
                        w="100%"
                        border="2px"
                        borderColor="gray.500"
                        borderRadius="26"
                        overflow="hidden"
                        allowMultiple
                      >
                        <HStack
                          spacing="8"
                          justify="space-between"
                          paddingX="8"
                          paddingY="3"
                          bg="gray.200"
                        >
                          <Text fontWeight="extrabold">
                            {profileAsPartner.purchases.length} Vendas
                          </Text>

                          {/* <Text float="right">TOTAL faturado: <strong>{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(monthTotalValue)}</strong></Text> */}
                          <Text float="right">
                            TOTAL em crédito:{" "}
                            <strong>
                              {Intl.NumberFormat("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                              }).format(profileAsPartner.sold_quotas_total)}
                            </strong>
                          </Text>
                        </HStack>

                        {profileAsPartner.purchases &&
                          profileAsPartner.purchases.map(
                            (purchase: ReadyQuotaPurchases) => {
                              const creditAmount =
                                purchase.quotas.length > 0
                                  ? purchase.quotas.reduce(
                                      (sumAmount, saleReadyQuota) => {
                                        return (
                                          sumAmount + saleReadyQuota.credit
                                        );
                                      },
                                      0
                                    )
                                  : 0;

                              return (
                                <AccordionItem
                                  key={purchase.id}
                                  display="flex"
                                  flexDir="column"
                                  paddingX="8"
                                  paddingTop="3"
                                  bg="white"
                                  borderTop="2px"
                                  borderTopColor="gray.500"
                                  borderBottom="0"
                                >
                                  {({ isExpanded }) => (
                                    <>
                                      <HStack
                                        justify="space-between"
                                        mb="3"
                                        opacity={1}
                                      >
                                        <AccordionButton
                                          p="0"
                                          height="fit-content"
                                          w="auto"
                                        >
                                          <Flex
                                            alignItems="center"
                                            justifyContent="center"
                                            h="24px"
                                            w="30px"
                                            p="0"
                                            borderRadius="full"
                                            border="2px"
                                            borderColor="blue.800"
                                          >
                                            {!isExpanded ? (
                                              <Plus
                                                stroke="#2a4365"
                                                fill="none"
                                                width="12px"
                                              />
                                            ) : (
                                              <Minus
                                                stroke="#2a4365"
                                                fill="none"
                                                width="12px"
                                              />
                                            )}
                                          </Flex>
                                        </AccordionButton>

                                        <Stack spacing="0">
                                          <Text
                                            fontSize="10px"
                                            color="gray.800"
                                          >
                                            {purchase.created_at
                                              ? formatBRDate(
                                                  purchase.created_at
                                                )
                                              : "--"}
                                          </Text>
                                          <Text
                                            fontSize="sm"
                                            fontWeight="bold"
                                            color="gray.800"
                                          >
                                            {purchase.id}
                                          </Text>
                                        </Stack>

                                        <HStack spacing="4">
                                          <Home
                                            stroke="#4e4b66"
                                            fill="none"
                                            width="22px"
                                          />

                                          <Stack spacing="0">
                                            <Text
                                              fontSize="10px"
                                              color="gray.800"
                                            >
                                              Valor da venda
                                            </Text>
                                            <Text
                                              fontSize="sm"
                                              fontWeight="bold"
                                              color="gray.800"
                                            >
                                              {Intl.NumberFormat("pt-BR", {
                                                style: "currency",
                                                currency: "BRL",
                                              }).format(creditAmount)}
                                            </Text>
                                          </Stack>
                                        </HStack>

                                        {/* <Stack spacing="0">
                                          <Text
                                            fontSize="10px"
                                            color="gray.800"
                                            fontWeight="bold"
                                          >
                                            Valor pago
                                          </Text>
                                          <Text
                                            fontSize="sm"
                                            fontWeight="bold"
                                            color="gray.800"
                                          >
                                            {Intl.NumberFormat("pt-BR", {
                                              style: "currency",
                                              currency: "BRL",
                                            }).format(quotaSale.value)}{" "}
                                            (
                                            {(
                                              (quotaSale.value * 100) /
                                              creditAmount
                                            ).toFixed(0)}
                                            %)
                                          </Text>
                                        </Stack> */}

                                        <Stack spacing="0">
                                          <Text
                                            fontSize="10px"
                                            color="gray.800"
                                            fontWeight="bold"
                                          >
                                            Cotas
                                          </Text>
                                          <HStack>
                                            {purchase.quotas.length > 0 &&
                                              purchase.quotas.map((quota) => {
                                                return (
                                                  <Text
                                                    key={`${quota.group}-${quota.quota}`}
                                                    fontSize="sm"
                                                    fontWeight="bold"
                                                    color="gray.800"
                                                  >
                                                    {quota.group}-{quota.quota},
                                                  </Text>
                                                );
                                              })}
                                          </HStack>
                                        </Stack>
                                      </HStack>

                                      <AccordionPanel
                                        flexDir="column"
                                        borderTop="2px"
                                        borderColor="gray.500"
                                        px="0"
                                        py="5"
                                        opacity={1}
                                      >
                                        <Stack pb="6" pt="3">
                                          <HStack>
                                            <Text fontWeight="700" mr="2">
                                              Cotas vendidas:{" "}
                                            </Text>
                                          </HStack>
                                          {purchase.quotas.map((quotas) => {
                                            return (
                                              <Stack
                                                key={`venda-${quotas.id}`}
                                                spacing="2"
                                                padding="3"
                                                bg="gray.100"
                                                borderRadius="16px"
                                              >
                                                <HStack
                                                  justifyContent={
                                                    "space-between"
                                                  }
                                                  key={quotas.id}
                                                >
                                                  <Stack spacing="0">
                                                    <Text
                                                      fontSize="10px"
                                                      color="gray.800"
                                                    >
                                                      Cota
                                                    </Text>
                                                    <Text
                                                      fontSize="sm"
                                                      fontWeight="semibold"
                                                      color="gray.800"
                                                    >
                                                      {quotas.group} -{" "}
                                                      {quotas.quota}
                                                    </Text>
                                                  </Stack>

                                                  <Stack spacing="0">
                                                    <Text
                                                      fontSize="10px"
                                                      color="gray.800"
                                                    >
                                                      Valor
                                                    </Text>
                                                    <Text
                                                      fontSize="sm"
                                                      fontWeight="semibold"
                                                      color="gray.800"
                                                    >
                                                      {Intl.NumberFormat(
                                                        "pt-BR",
                                                        {
                                                          style: "currency",
                                                          currency: "BRL",
                                                        }
                                                      ).format(
                                                        quotas.total_cost ?? 0
                                                      )}
                                                    </Text>
                                                  </Stack>

                                                  <Stack spacing="0">
                                                    <Text
                                                      fontSize="10px"
                                                      color="gray.800"
                                                    >
                                                      Crédito
                                                    </Text>
                                                    <Text
                                                      fontSize="sm"
                                                      fontWeight="semibold"
                                                      color="gray.800"
                                                    >
                                                      {Intl.NumberFormat(
                                                        "pt-BR",
                                                        {
                                                          style: "currency",
                                                          currency: "BRL",
                                                        }
                                                      ).format(
                                                        quotas.credit
                                                          ? quotas.credit
                                                          : 0
                                                      )}
                                                    </Text>
                                                  </Stack>

                                                  <Stack spacing="0">
                                                    <Text
                                                      fontSize="12px"
                                                      color="gray.800"
                                                    >
                                                      {quotas.deadline
                                                        ? `${quotas.deadline}x`
                                                        : "--"}
                                                    </Text>
                                                    <Text
                                                      fontSize="sm"
                                                      fontWeight="normal"
                                                      color="gray.800"
                                                    >
                                                      {quotas.parcel
                                                        ? Intl.NumberFormat(
                                                            "pt-BR",
                                                            {
                                                              style: "currency",
                                                              currency: "BRL",
                                                            }
                                                          ).format(
                                                            quotas.parcel
                                                          )
                                                        : ""}
                                                    </Text>
                                                  </Stack>
                                                </HStack>
                                              </Stack>
                                            );
                                          })}
                                        </Stack>

                                        <Divider mb="3" />
                                      </AccordionPanel>
                                    </>
                                  )}
                                </AccordionItem>
                              );
                            }
                          )}
                      </Accordion>
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </>
            )}

            {/* <Stack direction={["column", "column", "row", "row"]}>
                                                <Stack spacing={"6"} bg="white" p="8" w={["100%", "100%", "33%", "33%"]} boxShadow="sm">
                                                    <Stack>
                                                        <Heading fontSize={"xl"}>Ranking de parceiros</Heading>
                                                        <Heading fontSize={"sm"} fontWeight="medium" color="gray.700">Ranking de parceiros</Heading>
                                                    </Stack>

                                                    <Stack maxH="400px" overflow={"auto"}>
                                                    {
                                                        loadingUsers ? (
                                                            <Spinner />
                                                        ) : (users.length > 0) ? (
                                                                users.map((user, index) => {
                                                                    return (
                                                                        <HStack justifyContent={"space-between"}>
                                                                            <Text>{index + 1}. {user.name_display}</Text>
                                                                            <Text><strong>{user.sums_count}</strong> somas</Text>
                                                                        </HStack>
                                                                    )
                                                                })
                                                        ) : (
                                                            <Text>Nenhuma soma encontrada.</Text>
                                                        )
                                                    }
                                                    </Stack>
                                                </Stack>

                                                <Stack spacing={"6"} bg="white" p="8" w={["100%", "100%", "33%", "33%"]} boxShadow="sm">
                                                    <Stack>
                                                        <Heading fontSize={"xl"}>Acessos</Heading>
                                                        <Heading fontSize={"sm"} fontWeight="medium" color="gray.700">Visualizações das cartas</Heading>
                                                    </Stack>

                                                    <Stack maxH="400px" overflow={"auto"}>
                                                    {
                                                        loadingAccesses ? (
                                                            <Spinner />
                                                        ) : (
                                                            <HStack>
                                                                <Text fontSize={"xl"}>{accessesCount} visualizações</Text>
                                                            </HStack>
                                                        ) 
                                                    }
                                                    </Stack>
                                                </Stack>
                                            </Stack> */}
          </Stack>
        </Flex>
      </Box>
    </Box>
  ) : (
    // </ChakraProvider>
    <Flex
      flexDirection="column"
      w="100vw"
      h="100vh"
      bg="gray.200"
      alignItems="center"
      justifyContent="center"
    >
      <Spinner />
    </Flex>
  );
}

export default function AdminPage({ quotas, broker }: ContempladasProps) {
  return (
    <ProfileProvider>
      <AdminPageContent quotas={quotas} broker={broker} />
    </ProfileProvider>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  params,
}) => {
  const response = await axios.get(
    "https://contempladas.lanceconsorcio.com.br"
  );

  const quotas = response.data;

  const vehicleQuotas = quotas.filter(
    (quota: Quota) => quota.categoria == "Veículo"
  );
  vehicleQuotas.sort(function (a: Quota, b: Quota) {
    if (
      parseFloat(a.valor_credito.replaceAll(".", "").replaceAll(",", ".")) >
      parseFloat(b.valor_credito.replaceAll(".", "").replaceAll(",", "."))
    ) {
      return 1;
    }

    if (
      parseFloat(a.valor_credito.replaceAll(".", "").replaceAll(",", ".")) <
      parseFloat(b.valor_credito.replaceAll(".", "").replaceAll(",", "."))
    ) {
      return -1;
    }

    return 0;
  });

  const realtyQuotas = quotas.filter(
    (quota: Quota) => quota.categoria == "Imóvel"
  );
  realtyQuotas.sort(function (a: Quota, b: Quota) {
    if (
      parseFloat(a.valor_credito.replaceAll(".", "").replaceAll(",", ".")) >
      parseFloat(b.valor_credito.replaceAll(".", "").replaceAll(",", "."))
    ) {
      return 1;
    }

    if (
      parseFloat(a.valor_credito.replaceAll(".", "").replaceAll(",", ".")) <
      parseFloat(b.valor_credito.replaceAll(".", "").replaceAll(",", "."))
    ) {
      return -1;
    }

    return 0;
  });

  return {
    props: {
      quotas: [...vehicleQuotas, ...realtyQuotas],
      //broker: broker
    },
  };
};
