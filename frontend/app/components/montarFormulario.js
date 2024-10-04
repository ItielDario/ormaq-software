'use client';

export default function MontarFormulario(props) {
    const { labelTitle, id, typeImput, optinsOfSelect } = props;
    let contOptions = 0;
    

    return (
        <form>
            {
                typeImput.map((value, index) => {
                    const options = optinsOfSelect[contOptions];

                    return (
                        <section key={id[index]}>
                            <label htmlFor={id[index]}>{labelTitle[index]}</label>
                            
                            {value === 'text' && (
                                <input type="text" id={id[index]} name={id[index]} required />
                            )}

                            {value === 'number' && (
                                <input type="number" id={id[index]} name={id[index]} required />
                            )}

                            {value === 'date' && (
                                <input type="date" id={id[index]} name={id[index]} required />
                            )}

                            {value === 'select' && (
                                <select id={id[index]} name={id[index]} required>
                                    {options.map((option, optionIndex) => (
                                        <option key={optionIndex} value={option}>{option}</option>
                                    ))}
                                </select>
                               
                            )}
                             {/*contOptions++*/}
                        </section>
                    );
                })                
            }
        </form>
    );
}
