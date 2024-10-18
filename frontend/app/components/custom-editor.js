'use client' 

import { CKEditor } from '@ckeditor/ckeditor5-react';
import {
	ClassicEditor,
	Autoformat,
	Bold,
	Italic,
	Underline,
	BlockQuote,
	Base64UploadAdapter,
	Essentials,
	Heading,
	PictureEditing,
	Indent,
	IndentBlock,
	Link,
	List,
	MediaEmbed,
	Mention,
	Paragraph,
	PasteFromOffice,
	Table,
	TableCaption,
	TableCellProperties,
	TableColumnResize,
	TableProperties,
	TableToolbar,
	TextTransformation,
} from 'ckeditor5';

import 'ckeditor5/ckeditor5.css';
import { useState } from 'react';

function CustomEditor({ onChange, initialValue }) {
    const [editorData, setEditorData] = useState('');

    const handleEditorChange = (event, editor) => {
        const data = editor.getData();
        setEditorData(data);
        onChange(data); // Chama a função onChange com os dados do editor
    };

    return (
        <CKEditor
            editor={ClassicEditor}
            data={editorData} // Passa o valor do estado para o CKEditor
            onChange={handleEditorChange}
            config={{
                toolbar: [
                    'undo',
                    'redo',
                    '|',
                    'heading',
                    '|',
                    'bold',
                    'italic',
                    'underline',
                    '|',
                    'link',
                    'insertTable',
                    'blockQuote',
                    'mediaEmbed',
                    '|',
                    'bulletedList',
                    'numberedList',
                    '|',
                    'outdent',
                    'indent',
                ],
                plugins: [
                    Autoformat,
                    BlockQuote,
                    Bold,
                    Essentials,
                    Heading,
                    Base64UploadAdapter,
                    Indent,
                    IndentBlock,
                    Italic,
                    Link,
                    List,
                    MediaEmbed,
                    Mention,
                    Paragraph,
                    PasteFromOffice,
                    PictureEditing,
                    Table,
                    TableCaption,
                    TableCellProperties,
                    TableColumnResize,
                    TableProperties,
                    TableToolbar,
                    TextTransformation,
                    Underline,
                ],
                heading: {
                    options: [
                        {
                            model: 'paragraph',
                            title: 'Paragraph',
                            class: 'ck-heading_paragraph',
                        },
                        {
                            model: 'heading1',
                            view: 'h1',
                            title: 'Heading 1',
                            class: 'ck-heading_heading1',
                        },
                        {
                            model: 'heading2',
                            view: 'h2',
                            title: 'Heading 2',
                            class: 'ck-heading_heading2',
                        },
                        {
                            model: 'heading3',
                            view: 'h3',
                            title: 'Heading 3',
                            class: 'ck-heading_heading3',
                        },
                        {
                            model: 'heading4',
                            view: 'h4',
                            title: 'Heading 4',
                            class: 'ck-heading_heading4',
                        },
                    ],
                },
                link: {
                    addTargetToExternalLinks: true,
                    defaultProtocol: 'https://',
                },
                table: {
                    contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells'],
                },
                initialData: initialValue
            }}
        />
    );
}

export default CustomEditor;

