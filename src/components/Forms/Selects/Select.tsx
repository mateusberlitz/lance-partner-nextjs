import { FormControl, SelectProps, Select as ChakraSelect, FormErrorMessage } from "@chakra-ui/react";
import { ReactNode, Ref, useEffect, useState } from "react";
import { FieldError, UseFormRegister } from "react-hook-form";

interface FormSelectProps extends SelectProps{
    name: string;
    children: ReactNode;
    variant?: string;
    leftIcon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;

    value?: string;
    error?: FieldError;
    register?: UseFormRegister<any>;
    onChange?: (value: any) => void;
    selectRef?: Ref<any>

    selected?: number;
}

export function Select({ name, children, variant, selectRef, value = "", selected, error, register, onChange, ...rest } : FormSelectProps){
    const [controlledValue, setControlledValue] = useState("");

    function getRegister(){
        if(register){
            return {
                ...register(name)
            }
        }

        return {
            ref: (selectRef ? selectRef : undefined),
            value: controlledValue,
            onChange: (event: any) => { //React.ChangeEvent<HTMLInputElement>
                    setControlledValue(event.target.value);
                    if(onChange){
                        onChange(event.target.value)
                    }
                }
                
        }
    }

    useEffect(() => {
        setControlledValue(value);
        if(onChange){
            onChange(value);
        }
    }, [value, onChange]);

    return(
        <FormControl pos="relative" isInvalid={!!error}>
            <ChakraSelect {...getRegister()} borderRadius="3px" h="50px" fontWeight={controlledValue ? 'semibold' : 'regular'} name={name} fontSize="sm" borderColor={"gray.200"} bgColor={"gray.100"} _hover={ {bgColor: 'gray.500'} } size="lg" color={controlledValue ? "black" : "gray.700"} {...rest}>
                {children}
            </ChakraSelect>

            { !!error && (
                <FormErrorMessage>
                    {error.message}
                </FormErrorMessage>
            )}
        </FormControl>
    );
}