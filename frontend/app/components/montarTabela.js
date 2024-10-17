'use client';

export default function MontaTabela({ cabecalhos, listaDados, renderActions }) {
    return (
        <table>
            <thead>
                <tr>
                    {cabecalhos.map((cab, index) => (
                        <th key={index}>{cab}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {listaDados.map((item, index) => (
                    <tr key={item.id}>
                        {Object.values(item).map((value, idx) => (
                            <td key={idx}>{value}</td>
                        ))}
                        {renderActions && <td className="coluna-acoes">{renderActions(item)}</td>}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}