'use client'
import { useState } from 'react';
import CustomEditor from './custom-editor';

export default function MontarFormulario(props) {
    const [descricao, setDescricao] = useState('');

    return (
        <form>
            <section>
                <label htmlFor="maqNome">Nome da Máquina:</label>
                <input type="text" id="maqNome" name="maqNome" required />
            </section>

            <section>
                <label htmlFor="maqDataAquisicao">Data de Aquisição:</label>
                <input type="date" id="maqDataAquisicao" name="maqDataAquisicao" required />
            </section>

            <section>
                <label htmlFor="maqTipo">Tipo de Máquina:</label>
                <select id="maqTipo" name="maqTipo" required>
                    <option value="Nova">Nova</option>
                    <option value="Semi-Nova">Semi-Nova</option>
                </select>
            </section>

            <section>
                <label htmlFor="maqHorasUso">Horas de Uso:</label>
                <input type="number" id="maqHorasUso" name="maqHorasUso" required />
            </section>

            <section>
                <label htmlFor="equipamentoStatusId">Status do Equipamento:</label>
                <select id="equipamentoStatusId" name="equipamentoStatusId" required>
                    <option value="1">Disponível</option>
                </select>
            </section>

            <section>
                <label htmlFor="maqInativo">Inativo:</label>
                <select id="maqInativo" name="maqInativo" required>
                    <option value="N">Não</option>
                    <option value="S">Sim</option>
                </select>
            </section>

            <section>
                <label htmlFor="maqDescricao">Descrição da Máquina:</label>
                <CustomEditor value={descricao} onChange={setDescricao} />
            </section>
        </form>
    );
}
