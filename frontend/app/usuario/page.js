'use client';
import { useState, useEffect, useRef } from "react";
import MontarTabela from "../components/montarTabela.js";
import CriarBotao from "../components/criarBotao.js";
import httpClient from "../utils/httpClient.js"

export default function Usuario() {
    return (
        <section className="content-main-children-listar">
            <article className="title">
                <h1>Lista de Usuários</h1>
            </article>
        </section>
    );
}
