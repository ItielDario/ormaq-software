'use client';
import CustomEditor from "./custom-editor.js";
import { forwardRef, useImperativeHandle, useRef, useEffect } from "react";

const MontarFormulario = forwardRef((props, ref) => {
    const { labelTitle, id, typeImput, optinsOfSelect, initialValues, customType } = props;
    
    // Utilize a chave correta para buscar a descrição a partir dos valores iniciais
    const customEditorValue = useRef(initialValues?.[customType] || ''); // Preencher com valor inicial, se existir
    const formRef = useRef(null); // Referência para o formulário
    let contOptions = -1;

    useImperativeHandle(ref, () => ({
        getCustomEditorValue: () => customEditorValue.current, // Função para obter o valor do editor
        getFormElement: () => formRef.current // Expor a referência do formulário
    }));

    const handleCustomEditorChange = (data) => {
        customEditorValue.current = data; 
    };

    useEffect(() => {
        // Preenche os inputs com os dados iniciais quando o formulário for montado
        if (formRef.current && initialValues) {
            id.forEach((inputId) => {
                const inputElement = formRef.current.querySelector(`#${inputId}`);
                if (inputElement) {
                    inputElement.value = initialValues[inputId] || ''; // Preencher com o valor inicial se existir
                }
            });
        }
    }, [initialValues, id]);

    return (
        <form ref={formRef}>
            {
                typeImput.map((value, index) => (
                    <section key={id[index]}>
                        <label htmlFor={id[index]}>{labelTitle[index]}</label>
                        
                        {value === 'text' && (
                            <input type="text" id={id[index]} name={id[index]} defaultValue={initialValues?.[id[index]] || ''} required />
                        )}

                        {value === 'number' && (
                            <input type="number" id={id[index]} name={id[index]} defaultValue={initialValues?.[id[index]] || ''} required />
                        )}

                        {value === 'date' && (
                            <input type="date" id={id[index]} name={id[index]} defaultValue={initialValues?.[id[index]] || ''} required />
                        )}

                        {value === 'select' && (
                        <select id={id[index]} name={id[index]} defaultValue={initialValues?.[id[index]]} required>
                            {contOptions++}
                            {optinsOfSelect[contOptions]?.map((option, optionIndex) => (
                                <option key={optionIndex} value={optionIndex + 1}>{option}</option>
                            ))}
                        </select>
                        )}

                        {value === 'customEditor' && (
                            <CustomEditor 
                                onChange={handleCustomEditorChange} 
                                initialValue={initialValues?.[customType] || ''} // Usa a chave genérica para descrição
                            />
                        )}
                    </section>
                ))
            }
        </form>
    );
});

export default MontarFormulario;