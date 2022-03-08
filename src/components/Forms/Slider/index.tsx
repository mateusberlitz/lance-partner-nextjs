import { Slider as ChakraSlider, Stack, Input as ChakraInput, SliderFilledTrack, SliderMark, SliderThumb, SliderTrack, HStack, Text, InputProps, ChakraProps, FormControl, FormLabel, FormErrorMessage } from "@chakra-ui/react";
import { Ref, useEffect, useState } from "react";
import { FieldError, UseFormRegister } from "react-hook-form";
import { Input } from "../Inputs/Input";
import { mask as applyMask } from "../../../utils/ReMask";
import CurrencyInput from "react-currency-input-field";
import { CurrencyInputOnChangeValues } from "react-currency-input-field/dist/components/CurrencyInputProps";
import styles from './styles.module.css';

//interface SliderProps extends InputProps{

export interface SliderProps extends ChakraProps{
    name: string;
    type: string;
    value?: number;
    label?: string;
    variant?: string;
    icon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    register?: UseFormRegister<any>;
    control?: any;
    mask?: "phone" | "cpf" | "cnpj" | "money" | "cep" | "cpf-cnpj" | "";
    error?: FieldError;
    onChange?: (value: any) => void;
    inputRef?: Ref<any>
}

export function Slider({ name, type, icon, variant = "", value = 200000, label = "", mask = "", register = undefined, onChange, inputRef, control, error, maxW, ...rest }: SliderProps){
    const [sliderValue, setSliderValue] = useState<number>();

    useEffect(() => {
        setSliderValue(value);

        if(onChange){
            onChange(value);
        }
    }, [value]);

    function getControlledInputAttributes(){
        if(register){
            return {
                ...register(name),
                value: sliderValue,
                onValueChange: (value: string | undefined, name?: string | undefined, values?: CurrencyInputOnChangeValues) => {
                    setSliderValue(values ? (values.float ? values.float : 0) : 0);
                }
            }
        }

        return {
            ref: (inputRef ? inputRef : undefined),
            value: sliderValue,
            onValueChange: (value: string | undefined, name?: string | undefined, values?: CurrencyInputOnChangeValues) => {
                    setSliderValue(values ? (values.float ? values.float : 0) : 0);
                    if(onChange){
                        onChange(values ? (values.float ? values.float : 0) : 0);
                    }
                }
                
        }
    }

    return(
        <FormControl pos="relative" isInvalid={!!error} maxW={maxW}>
            <HStack w="100%" justifyContent="space-between" mb="3">
                <FormLabel w="50%" fontSize="sm" mb="0">{label}</FormLabel>
                <CurrencyInput decimalSeparator="," groupSeparator="." prefix="R$" {...getControlledInputAttributes()}
                    className={styles.sliderCurrency}
                    name={name}
                    defaultValue={sliderValue}
                    //value={sliderValue}
                    decimalsLimit={2}
                />;

            </HStack>

            <ChakraSlider focusThumbOnChange={false} pos="relative" aria-label='slider-ex-6' colorScheme='red' value={sliderValue} defaultValue={sliderValue} min={30000} max={1000000} step={5000} 
            onChange={(value) => {
                setSliderValue(value);
                if(onChange){
                    onChange(value);
                }
            }} 
            {...rest}>

                <SliderTrack>
                    <SliderFilledTrack />
                </SliderTrack>

                <SliderThumb />
            </ChakraSlider>

            { !!error && (
                <FormErrorMessage fontSize="11px">
                    {error.message}
                </FormErrorMessage>
            )}
        </FormControl>
    )
}