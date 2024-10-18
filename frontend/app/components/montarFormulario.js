'use client';
import CustomEditor from "./custom-editor.js";
import { forwardRef, useImperativeHandle, useRef } from "react";

const MontarFormulario = forwardRef((props, ref) => {
    const { labelTitle, id, typeImput, optinsOfSelect } = props;
    const customEditorValue = useRef(''); // Cria uma referência para armazenar o valor do editor
    const formRef = useRef(null); // Referência para o formulário
    let contOptions = -1;

    useImperativeHandle(ref, () => ({
        getCustomEditorValue: () => customEditorValue.current, // Função para obter o valor do editor
        getFormElement: () => formRef.current // Expor a referência do formulário
    }));

    const handleCustomEditorChange = (data) => {
        customEditorValue.current = data; 
    };

    return (
        <form ref={formRef}>
            {
                typeImput.map((value, index) => {
                    return (
                        <section key={id[index]}>
                            <label htmlFor={id[index]}>{labelTitle[index]}</label>
                            
                            {value === 'text' && (
                                <input type="text" id={id[index]} name={id[index]} required />
                            )}

                            {value === 'number' && (
                                <input type="number" id={id[index]} name={id[index]} required />
                            )}B

                            {value === 'date' && (
                                <input type="date" id={id[index]} name={id[index]} required />
                            )}

                            {value === 'select' && (
                                <>
                                    <select id={id[index]} name={id[index]} required>
                                        {contOptions++}
                                        {optinsOfSelect[contOptions]?.map((option, optionIndex) => (
                                            <option key={optionIndex} value={optionIndex + 1}>{option}</option>
                                        ))}
                                    </select>
                                </>
                            )}

                            {value === 'customEditor' && (
                                <CustomEditor onChange={handleCustomEditorChange} />
                            )}
                        </section>
                    );
                })
            }
        </form>
    );
});

export default MontarFormulario;