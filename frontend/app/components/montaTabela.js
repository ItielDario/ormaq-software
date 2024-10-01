'use client'
import Link from "next/link";

export default function MontaTabela(props){

    const cabecalhos = props.cabecalhos
    const listaMaquinas = props.listaMaquinas

    console.log(listaMaquinas)
    
    return(
        <table>
            <thead>
                <tr>
                    {   
                        cabecalhos.map((cab, index) => (
                            <th>{cab}</th>
                        ))
                    }
                </tr>
            </thead>
            <tbody>
                {listaMaquinas.map((maquina, index) => (
                    <tr key={index}>
                        <td></td>
                        <td>{maquina.maqNome}</td>
                        <td>{maquina.maqDataAquisicao}</td>
                        <td>{maquina.maqTipo}</td>
                        <td>{maquina.maqHorasUso}</td>
                        <td>{maquina.equipamentoStatus.equipamentoStatusDescricao}</td>
                        <td></td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}
