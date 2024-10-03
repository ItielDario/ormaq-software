'use client'
import { useState } from 'react';
import CustomEditor from './custom-editor';

export default function MontarFormulario(props) {
    const labelTitle = props.labelTitle;
    const id = props.id;
    const typeImput = props.typeImput;

    console.log(props);
    console.log(labelTitle);
    console.log(id);
    console.log(typeImput);

    return (
        <form>
            {
                typeImput.map((value, index) => {
                    if(value == 'text'){
                        return(
                            <section>
                                <label htmlFor={id[index]}>{labelTitle[index]}</label>
                                <input type="text" id={id[index]} name={id[index]} required />
                            </section>
                        )
                    }
                    else if(value == 'number'){
                        return(
                            <section>
                                <label htmlFor={id[index]}>{labelTitle[index]}</label>
                                <input type="number" id={id[index]} name={id[index]} required />
                            </section>
                        )
                    }
                    else if(value == 'date'){
                        return(
                            <section>
                                <label htmlFor={id[index]}>{labelTitle[index]}</label>
                                <input type="date" id={id[index]} name={id[index]} required />
                            </section>
                        )
                    }
                    else if(value == 'select'){
                        {console.log(value)}
                        return(
                            
                            <section>
                                <label htmlFor={id[index]}>{labelTitle[index]}</label>
                                <select id={id[index]} name={id[index]} required>
                                    <option value="Nova">Nova</option>
                                    <option value="Semi-Nova">Semi-Nova</option>
                                </select>
                            </section>
                        )
                    }
                })
            }
        </form>
    );
}
