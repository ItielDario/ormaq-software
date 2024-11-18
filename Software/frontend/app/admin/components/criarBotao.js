'use client'
import Link from "next/link";

export default function criarBotao(props){
    return ( <Link className={props.class} href={props.href}>{props.value}</Link> )
}