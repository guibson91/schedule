/**
* Remover caracteres especiais de uma string
* Ex: Telefones, CPF, CNPJ etc.
*/
export function removeSymbol(doc: string) {
    return doc.replace(" ", "").replace(/\./g, "").replace("-", "").replace("/", "").replace("(", "").replace(")", "");
}