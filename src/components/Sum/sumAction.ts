import { Quota } from "../../pages/admin";

export function GetSumResult(selectedQuotas: Quota[]){
    const newAmount = selectedQuotas.reduce((accumulator, quota) => {
        return {
            credit: accumulator.credit + parseFloat(quota.valor_credito.replaceAll(".", "").replaceAll(",", ".")),
            entry: accumulator.entry + parseFloat(quota.entrada.replaceAll(".", "").replaceAll(",", ".")),
            deadline: accumulator.deadline + parseInt(quota.parcelas),
            parcel: accumulator.parcel + parseFloat(quota.valor_parcela.replaceAll(".", "").replaceAll(",", ".")),
            debt: accumulator.debt + parseFloat(quota.valor_parcela.replaceAll(".", "").replaceAll(",", "."))*parseInt(quota.parcelas),
            tax: accumulator.tax + (quota.taxa ? parseFloat(quota.taxa.toString().replaceAll('.', '').replaceAll(',', '.')) : 0),
            fund: accumulator.fund + (quota.fundo ? parseFloat(quota.fundo.toString().replaceAll('.', '').replaceAll(',', '.')) : 0),
            security: accumulator.security + parseFloat(quota.valor_parcela.replaceAll(".", "").replaceAll(",", "."))*parseInt(quota.parcelas) * (quota.categoria == "Veículo" ? 0.00088 : 0.00055),
        }
    }, {
        credit: 0,
        entry: 0,
        deadline: 0,
        parcel: 0,
        debt: 0,
        tax: 0,
        fund: 0,
        security: 0
    });

    newAmount.deadline = Math.round(newAmount.debt / newAmount.parcel);

    return newAmount;
}