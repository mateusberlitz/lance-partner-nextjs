import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Heading,
  HStack,
  Icon,
  IconButton,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { X } from "react-feather";
import { serverApi } from "../../services/api";
import { formatBRDate } from "../../utils/Date/formatBRDate";
import { getHour } from "../../utils/Date/getHour";
import { SolidButton } from "../Buttons/SolidButton";

interface Card {
  segment: string;
  cod: number;
  credit: number;
  entry: number;
  debt: number;
  tax: number;
  deadline: number;
  installment: number;
  insurance: number;
  adm: number;
  fund: number;
}

interface Sum {
  user_id: number;
  credit: number;
  entry: number;
  debt: number;
  tax: number;
  deadline: number;
  installment: number;
  insurance: number;
  fund: number;
  cards: Card[];
  created_at: string;
}

export function SumLog() {
  const [isOpenLog, setIsOpenLog] = useState<Boolean>(false);
  const [sums, setSums] = useState<Sum[]>([]);
  const [loadingSums, setLoadingSums] = useState<Boolean>(true);

  const fetchSums = () => {
    serverApi.get("sums").then((response) => {
      setSums(response.data);
      setLoadingSums(false);
    });
  };

  const handleToggleLogModal = () => {
    setIsOpenLog(!isOpenLog);
  };

  const handleCloseLogModal = () => {
    setIsOpenLog(false);
  };

  useEffect(() => {
    fetchSums();
  }, []);

  return (
    <Stack
      position="fixed"
      right="20px"
      bottom="90px"
      zIndex="2"
      alignItems={"flex-end"}
      justifyContent="right"
      maxW="430px"
      w={"100%"}
    >
      <Stack
        className={isOpenLog ? "open-log" : "hidden-log"}
        maxH="435px"
        overflow="auto"
        spacing="6"
        bg="white"
        boxShadow="lg"
        padding="8"
        borderRadius={"4"}
        w={"100%"}
        position="relative"
      >
        <Heading fontSize="lg">Histórico de somas</Heading>
        <IconButton
          aria-label="Fechar histórico de somas"
          onClick={handleCloseLogModal}
          position="absolute"
          top="0"
          right="4"
          variant="ghost"
        >
          <Icon as={X} stroke="#000" fontSize="md" fill="none" mr="0" />
        </IconButton>

        {loadingSums ? (
          <Spinner />
        ) : sums.length > 0 ? (
          <Accordion defaultIndex={[0]} allowMultiple>
            {sums.map((sum) => {
              return (
                <AccordionItem
                  key={`soma-${sum.created_at}`}
                  title={""}
                  border="0"
                  borderBottom="1px dashed"
                  borderColor={"gray.200"}
                >
                  <h2>
                    <AccordionButton>
                      <Box as="span" flex="1" textAlign="left">
                        <HStack justifyContent={"space-between"}>
                          <Stack spacing="0">
                            <Text color="gray.700" fontSize={"12px"}>
                              {formatBRDate(sum.created_at)}{" "}
                              {getHour(sum.created_at)}
                            </Text>
                            <Text fontSize={"sm"}>
                              Crédito:{" "}
                              {sum.credit.toLocaleString("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                              })}
                            </Text>
                          </Stack>

                          <Text color="gray.700" fontSize={"sm"}>
                            {sum.cards.length} cartas
                          </Text>
                        </HStack>
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4} bg="gray.100">
                    <Stack spacing="0">
                      <HStack justifyContent={"space-between"}>
                        <Stack spacing={0}>
                          <Text color="gray.700" fontSize={"12px"}>
                            Entrada
                          </Text>
                          <Text fontSize={"sm"}>
                            {sum.entry.toLocaleString("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            })}
                          </Text>
                        </Stack>

                        <Stack spacing={0}>
                          <Text color="gray.700" fontSize={"12px"}>
                            Saldo Devedor
                          </Text>
                          <Text fontSize={"sm"}>
                            {sum.debt.toLocaleString("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            })}
                          </Text>
                        </Stack>
                      </HStack>

                      <HStack justifyContent={"space-between"}>
                        <Stack spacing={0}>
                          <Text color="gray.700" fontSize={"12px"}>
                            Parcela
                          </Text>
                          <Text fontSize={"sm"}>
                            {sum.installment.toLocaleString("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            })}
                          </Text>
                        </Stack>

                        <Stack spacing={0}>
                          <Text color="gray.700" fontSize={"12px"}>
                            Prazo
                          </Text>
                          <Text fontSize={"sm"}>{sum.deadline}x</Text>
                        </Stack>
                      </HStack>

                      <HStack justifyContent={"space-between"}>
                        <Stack spacing={0}>
                          <Text color="gray.700" fontSize={"12px"}>
                            Cartas
                          </Text>
                          <Text fontSize={"sm"}>
                            {sum.cards.map((card) => {
                              return `${card.cod}, `;
                            })}
                          </Text>
                        </Stack>
                      </HStack>
                    </Stack>
                  </AccordionPanel>
                </AccordionItem>
              );
            })}
          </Accordion>
        ) : (
          <Text>Nenhuma soma encontrada.</Text>
        )}
      </Stack>

      <SolidButton
        onClick={() => handleToggleLogModal()}
        bg="white"
        color="black"
        border="1px solid"
        borderColor={isOpenLog ? "black" : "white"}
        _hover={{ bgColor: "gray.200" }}
        fontSize="md"
        size="lg"
        boxShadow="lg"
      >
        Histórico
      </SolidButton>
    </Stack>
  );
}
