export function parseRealParaFloat(valor: string) {
  return parseFloat(
    valor
      .replace(/\./g, '') // remove os pontos de milhar
      .replace(',', '.'), // troca vírgula por ponto decimal
  );
}
